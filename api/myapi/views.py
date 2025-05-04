from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import SatFiles, DbFiles
from .serializers import SatFilesSerializer, DbFilesSerializer

@api_view(['GET'])
def satellite_list(request):
    """
    GET /api/satellites 
    Retrieve all satellites
    """
    satellites = SatFiles.objects.all()
    serializer = SatFilesSerializer(satellites, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def subsystem_files(request, sat_id, sub_id):
    files = SatFiles.objects.filter(subsystem_id=sub_id, id=sat_id)
    serializer = SatFilesSerializer(files, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def file_metadata(request, sat_id, sub_id, file_id):
    satellite = SatFiles.objects.filter(id=sat_id, subsystem_id=sub_id)
    file_metad = DbFiles.objects.filter(sat_file_id=file_id, file_ver=satellite.cur_file_ver)
    serializer = DbFilesSerializer(file_metad)
    return Response(serializer.data)

@api_view(['GET'])
def config_list(request, sat_id):
    pass