from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Poll
from .serializers import PollSerializer
from django.db import transaction
from django.db.utils import IntegrityError

@api_view(['POST'])
def vote(request):
    vote = request.data['vote']
    rushee_name = request.data['rushee_name']
    voter_email = request.data['email']

    print(f"vote: {vote}, rushee_name: {rushee_name}, voter_email: {voter_email}")

    try:
        poll = Poll.objects.create(rushee_name=rushee_name, voter=voter_email, vote=vote)
        print("poll created")
        poll.save()
        print("poll saved")
    except:
        return Response({"error": "There was an error registering your vote."}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'message': 'Your vote has been registered.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_percentage(request):
    rushee_name = request.query_params.get('rushee_name')
    votes = Poll.objects.filter(rushee_name=rushee_name)

    total_votes = len(votes)

    if total_votes == 0:
        return Response({"percentage": f"{0:.2f}"}, status=status.HTTP_200_OK)
    
    yes_votes = len(votes.filter(vote='yes'))

    percentage = yes_votes / total_votes

    return Response({"percentage": f"{percentage*100:.2f}"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_percentage_breakdown(request):
    rushee_name = request.query_params.get('rushee_name')
    votes = Poll.objects.filter(rushee_name=rushee_name)

    total_votes = len(votes)

    yes_votes = len(votes.filter(vote='yes'))
    no_votes = len(votes.filter(vote='no'))
    idk_votes = len(votes.filter(vote='idk'))

    yes_percentage, no_percentage, idk_percentage = 0, 0, 0

    if total_votes != 0:
        yes_percentage = yes_votes / total_votes
        no_percentage = no_votes / total_votes
        idk_percentage = idk_votes / total_votes

    return Response({"yes": (f"{yes_percentage*100:.2f}", yes_votes), 
                     "no": (f"{no_percentage*100:.2f}", no_votes), 
                     "idk": (f"{idk_percentage*100:.2f}", idk_votes)}, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def get_voters(request):
#     rushee_name = request.query_params.get('rushee_name')
#     rushee_stats = get_object_or_404(Poll, rushee_name=rushee_name)

#     return Response({"voters": rushee_stats.voters}, status=status.HTTP_200_OK)

@api_view(['GET'])
def has_voted(request):
    rushee_name = request.query_params.get('rushee_name')
    voter_email = request.query_params.get('email')

    votes = Poll.objects.filter(rushee_name=rushee_name, voter=voter_email)

    return Response({"has_voted": len(votes) > 0}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_poll(request):
    rushee_name = request.data['rushee_name']
    votes = Poll.objects.filter(rushee_name=rushee_name)

    for vote in votes:
        vote.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def test_redis(request):
    import redis, os
    client = redis.Redis.from_url(os.getenv("REDIS_URL"))

    try:
        client.ping()
        return Response('connection successful', status=status.HTTP_200_OK)
    except Exception as e:
        return Response(f'connection error: {e}. redis url: {os.getenv("REDIS_URL")}', status=status.HTTP_400_BAD_REQUEST)
