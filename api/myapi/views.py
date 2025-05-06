from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db import connection
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *

def get_satellite(sat_id):
    """
    Returns the name of the satellite. 
    We have only two satellites, "SAT-MOHAMMEDIA" and "UM5-EOSAT"
    """
    if sat_id == 1:
        return "UM5-EOSAT"
    elif sat_id == 2:
        return "SAT-MOHAMMEDIA"
    else:
        raise ValueError("This satellite do not exist in the database.")    

@api_view(['GET'])
def satellite_list(request):
    """
    GET /api/satellites 
    Retrieve all satellites
    """
    data = {"satellites": [{"id":1, "name": "UM5-EOSAT"}, {"id": 2, "name": "SAT-MOHAMMEDIA"}]}
    return Response({"status": "success", "data": data})
    

@api_view(['GET'])
def subsystem_files(request, sub_id):
    files = SatFiles.objects.filter(subsystem_id=sub_id)
    serializer = SatFilesSerializer(files, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def file_metadata(request, sat_id, sub_id, file_id):
    satellite = get_object_or_404(SatFiles, id=sat_id, subsystem_id=sub_id)
    file_metad = DbFiles.objects.filter(sat_file_id=file_id, file_ver=satellite.cur_file_ver)
    serializer = DbFilesSerializer(file_metad, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def download_file(request, sat_id, sub_id, file_id):
    """
    GET /satellites/<int:sat_id>/subsystems/<int:sub_id>/files/<int:file_id>/download/
    Download the requested file in the appropriate format
    """ 
    #file = SatFiles.objects.filter(id=)
    pass


@api_view(['GET'])
def config_list(request, sat_id):
    pass