from rest_framework import serializers
from .models import Poll

class PollSerializer(serializers.ModelSerializer):
    class Meta:
        model = Poll
        fields = ('rushee_name', 'yes_votes', 'no_votes', 'idk_votes', 'voters')