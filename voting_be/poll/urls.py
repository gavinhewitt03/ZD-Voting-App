from .views import *
from django.urls import path

urlpatterns = [
    path('create/', create_poll, name='create_poll'),
    path('vote/', vote, name='vote'),
    path('percentage/', get_percentage, name='get_percentage'),
    path('voters/', get_voters, name='get_voters'),
    path('delete/', delete_poll, name='delete_poll')
]