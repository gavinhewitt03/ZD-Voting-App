from .views import *
from django.urls import path

urlpatterns = [
    path('vote/', vote, name='vote'),
    path('voted/', has_voted, name='has_voted'),
    path('percentage/', get_percentage, name='get_percentage'),
    path('breakdown/', get_percentage_breakdown, name='get_percentage_breakdown'),
    path('delete/', delete_poll, name='delete_poll'),
    path('redis_test/', test_redis, name='test_redis')
]