from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import connection
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework import status
from django.http import HttpResponse
import json
import pandas as pd # nix-shell -p python313Packages.pandas
from io import StringIO, BytesIO
from PIL import Image
import io


def get_satellite(sat_id):
    """
    Returns the name of the satellite. 
    We have only two satellites, "MOHAMMEDIA-SAT" and "UM5-EOSAT"
    """
    if sat_id == 1:
        return "UM5-EOSAT"
    elif sat_id == 2:
        return "MOHAMMEDIA-SAT"
    else:
        raise ValueError("This satellite do not exist in the database.")   

def set_search_path(schema):
    with connection.cursor() as cursor:
        cursor.execute(f"""SET search_path TO "{schema}";""") 

@api_view(['GET'])
def satellite_list(request):
    """
    GET /api/satellites 
    Retrieve all satellites
    """
    data = {"satellites": [{"id":1, "name": "UM5-EOSAT"}, {"id": 2, "name": "MOHAMMEDIA-SAT"}]}
    return Response({"status": "success", "data": data})

# TODO: Afficher les sous systèmes d'un satellite.
@api_view(['GET'])
def satellite_subsystems(request, sat_id):
    """
    GET /api/satellites/int:sat_id/subsystems/
    """
    name = get_satellite(sat_id)
    with connection.cursor() as cursor:
        query = f''' SELECT subsystem_id FROM "{name}".sat_files '''
        cursor.execute(query)
        rows = cursor.fetchall()
        columns_name = [col[0] for col in cursor.description] 
    data = [dict(zip(columns_name, row)) for row in rows]
    return Response({"status": "success","data": data})       


@api_view(['GET'])
def subsystem_files(request, sat_id, sub_id):
    """
    GET api/satellites/<int:sat_id>/subsystems/<int:sub_id>/files/
    Retrieves all files id related to the specific subsystem
    """
    name = get_satellite(sat_id)
    with connection.cursor() as cursor:
        query = f'''Select * FROM "{name}".sat_files WHERE subsystem_id = %s'''
        cursor.execute(query, [sub_id])
        rows = cursor.fetchall()
        columns_name = [col[0] for col in cursor.description] 
    data = [dict(zip(columns_name, row)) for row in rows]
    return Response({"status": "success","data": data})

@api_view(['GET'])
def file_versions(request, sat_id, sub_id, id_in_subsystem):
    """
    GET /api/satellites/<sat_id>/subsystems/<sub_id>/files/<id_in_subsystem>/
    """
    schema = get_satellite(sat_id)          

    with connection.cursor() as cursor:
        cursor.execute(
            f'''
            SELECT df.*
              FROM "{schema}".db_files AS df
              JOIN "{schema}".sat_files AS sf
                ON df.sat_file_id = sf.id
             WHERE sf.id_in_subsystem = %s      
               AND sf.subsystem_id    = %s
             ORDER BY df.file_ver;              
            ''',
            [id_in_subsystem, sub_id],
        )
        rows = cursor.fetchall()
        columns = [c[0] for c in cursor.description]

    if not rows:
        return Response(
            {"status": "error", "detail": "No versions found."},
            status=status.HTTP_404_NOT_FOUND,
        ) 
    data = [dict(zip(columns, row)) for row in rows]
    return Response({"status": "success", "data": data})


@api_view(['GET'])
def file_metadata(request, sat_id, sub_id, id_in_subsystem, file_ver): 
    """
    GET /api/satellites/<sat_id>/subsystems/<sub_id>/files/<id_in_subsystem>/<file_ver>/
    """
    schema = get_satellite(sat_id)

    with connection.cursor() as cursor:
        cursor.execute(
            f'''
            SELECT df.*
              FROM "{schema}".db_files AS df
              JOIN "{schema}".sat_files AS sf
                ON df.sat_file_id = sf.id
             WHERE sf.id_in_subsystem = %s         
               AND sf.subsystem_id    = %s
               AND df.file_ver        = %s;
            ''',
            [id_in_subsystem, sub_id, file_ver], 
        )
        row = cursor.fetchone()

    if row is None:
        return Response(
            {"status": "error", "detail": "File version not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    columns = [c[0] for c in cursor.description]
    return Response({"status": "success", "data": dict(zip(columns, row))})

@api_view(['GET'])
def download_file(request, sat_id, sub_id, id_in_subsystem, file_ver):  
    """
    GET /api/satellites/<sat_id>/subsystems/<sub_id>/files/<id_in_subsystem>/version/<file_ver>/download/
    """
    schema = get_satellite(sat_id)

    with connection.cursor() as cursor:
        cursor.execute(
            f'''
            SELECT dea.entry_data
              FROM "{schema}".download_entries_archive AS dea
              JOIN "{schema}".sat_files               AS sf
                ON sf.id = dea.sat_file_id
             WHERE sf.id_in_subsystem = %s            -- CHANGED
               AND sf.subsystem_id    = %s
               AND dea.file_ver       = %s
             ORDER BY dea.entry_nr;
            ''',
            [id_in_subsystem, sub_id, file_ver],    
        )
        rows = cursor.fetchall()

    if not rows:
        return Response(
            {"status": "error", "detail": "File/version not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    file_bytes = b''.join(bytes(r[0]) for r in rows)

    filename = (
        f"sat{sat_id}_sub{sub_id}_file{id_in_subsystem}_v{file_ver}.bin"  
    )
    response = HttpResponse(
        file_bytes,
        content_type='application/octet-stream',
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response['Content-Length'] = str(len(file_bytes))
    return response
    



@api_view(['GET'])
def config_list(request, sat_id):
    pass

@api_view(['GET'])
def parsed_file(request, sat_id, sub_id, id_in_subsystem, file_ver, format):
    """
    GET /api/satellites/<sat_id>/subsystems/<sub_id>/files/<id_in_subsystem>/version/<file_ver>/parsed/<format>/
    Returns parsed file data in specified format (csv, json, png, etc.)
    """
    # Déduction du nom du schéma
    with connection.cursor() as cursor:
        cursor.execute('SELECT schema_name FROM config WHERE sat_id = %s', [sat_id])
        result = cursor.fetchone()
        if not result:
            return Response(
                {"status": "error", "detail": "Satellite not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        schema = result[0]

    # Récupération des données binaires
    with connection.cursor() as cursor:
        cursor.execute(
            f'''
            SELECT dea.entry_data
              FROM "{schema}".download_entries_archive AS dea
              JOIN "{schema}".sat_files AS sf
                ON sf.id = dea.sat_file_id
             WHERE sf.id_in_subsystem = %s
               AND sf.subsystem_id = %s
               AND dea.file_ver = %s
             ORDER BY dea.entry_nr;
            ''',
            [id_in_subsystem, sub_id, file_ver]
        )
        rows = cursor.fetchall()

    if not rows:
        return Response(
            {"status": "error", "detail": "File/version not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    file_bytes = b''.join(bytes(r[0]) for r in rows)

    # Si .txt → renvoyer brut
    if format.lower() == 'txt':
        response = HttpResponse(file_bytes.decode('utf-8'), content_type='text/plain')
        filename = f"sat{sat_id}_sub{sub_id}_file{id_in_subsystem}_v{file_ver}.txt"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    try:
        if format.lower() == 'csv':
            df = pd.read_json(BytesIO(file_bytes))
            csv_buffer = StringIO()
            df.to_csv(csv_buffer, index=False)
            response = HttpResponse(csv_buffer.getvalue(), content_type='text/csv')

        elif format.lower() == 'json':
            json_data = json.loads(file_bytes.decode('utf-8'))
            response = Response({"status": "success", "data": json_data})

        elif format.lower() in ('png', 'jpg', 'jpeg'):
            img = Image.open(io.BytesIO(file_bytes))
            img_io = io.BytesIO()
            img.save(img_io, format=format.upper())
            response = HttpResponse(img_io.getvalue(), content_type=f'image/{format.lower()}')

        else:
            return Response(
                {"status": "error", "detail": f"Unsupported format '{format}'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if isinstance(response, HttpResponse):
            filename = f"sat{sat_id}_sub{sub_id}_file{id_in_subsystem}_v{file_ver}.{format.lower()}"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'

        return response

    except Exception as e:
        return Response(
            {"status": "error", "detail": f"Could not parse file: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

def set_search_path(schema):
    with connection.cursor() as cursor:
        cursor.execute(f"""SET search_path TO "{schema}";""") 
