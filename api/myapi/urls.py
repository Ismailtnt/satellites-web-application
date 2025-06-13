from django.urls import path
from . import views

urlpatterns = [
    path('satellites/', views.satellite_list),
    path('satellites/<int:sat_id>/subsystems/', views.satellite_subsystems),
    path('satellites/<int:sat_id>/subsystems/<int:sub_id>/files/', views.subsystem_files),
    path('satellites/<int:sat_id>/subsystems/<int:sub_id>/files/<int:id_in_subsystem>/', views.file_versions),
    path('satellites/<int:sat_id>/subsystems/<int:sub_id>/files/<int:id_in_subsystem>/version/<int:file_ver>/', views.file_metadata),
    path('satellites/<int:sat_id>/subsystems/<int:sub_id>/files/<int:id_in_subsystem>/version/<int:file_ver>/download/', views.download_file),
    path('satellites/<int:sat_id>/subsystems/<int:sub_id>/files/<int:id_in_subsystem>/version/<int:file_ver>/parsed/<str:format>/', views.parsed_file),
    #path('satellites/<int:sat_id>config/', views.SatelliteConfigView),
    #path('satellites/<int:sat_id>/logs/', views.SatelliteLogsView),
]