from django.urls import path
from . import views

urlpatterns = [
    path('satellites/', views.satellite_list),
    path('satellites/<int:sat_id>/subsystems/<int:sub_id>/files/', views.subsystem_files),
    #path('satellites/<int:sat_id>/subsystems/<int:sub_id>/files/<int:file_id>/', views.FileMetadataView.as_view()),
    #path('satellites/<int:sat_id>/subsystems/<int:sub_id>/files/<int:file_id>/download/', views.FileDownloadView.as_view()),
    #path('satellites/<int:sat_id>/config/', views.SatelliteConfigView.as_view()),
    #path('satellites/<int:sat_id>/logs/', views.SatelliteLogsView.as_view()),
]