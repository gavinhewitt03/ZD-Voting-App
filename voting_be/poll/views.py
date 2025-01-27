from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Poll
from .serializers import PollSerializer

@api_view(['POST'])
def vote(request):
    vote = request.data['vote']
    rushee_name = request.data['rushee_name']
    voter_email = request.data['email']
    rushee_stats = get_object_or_404(Poll, rushee_name=rushee_name)

    rushee_stats.voters.append(voter_email)

    if vote:
        rushee_stats.yes_votes += 1
        serializer = PollSerializer(rushee_stats, {'yes_votes': rushee_stats.yes_votes, 'voters': rushee_stats.voters}, partial=True)
    else:
        rushee_stats.no_votes += 1
        serializer = PollSerializer(rushee_stats, {'no_votes': rushee_stats.no_votes, 'voters': rushee_stats.voters}, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Vote has been received."}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

@api_view(['POST'])
def create_poll(request):
    serializer = PollSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    
    return Response({"error": "Rushee name is either invalid or not provided."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_percentage(request):
    rushee_name = request.query_params.get('rushee_name')
    rushee_stats = get_object_or_404(Poll, rushee_name=rushee_name)

    total_votes = rushee_stats.yes_votes + rushee_stats.no_votes

    if total_votes == 0:
        return Response({"percentage": f"{0:.2f}"}, status=status.HTTP_200_OK)
    
    percentage = rushee_stats.yes_votes / total_votes

    return Response({"percentage": f"{percentage*100:.2f}"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_voters(request):
    rushee_name = request.query_params.get('rushee_name')
    rushee_stats = get_object_or_404(Poll, rushee_name=rushee_name)

    return Response({"voters": rushee_stats.voters}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_poll(request):
    rushee_name = request.data['rushee_name']
    rushee_stats = get_object_or_404(Poll, rushee_name=rushee_name)

    rushee_stats.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def test_redis(request):
    import redis, os
    client = redis.Redis(os.getenv("REDIS_URL"))

    try:
        client.ping()
        print('connection successful')
        client.close()
    except Exception as e:
        print(f'no, error: {e}')
