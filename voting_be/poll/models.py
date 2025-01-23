from django.db import models
from django.contrib.postgres.fields import ArrayField

class Poll(models.Model):
    rushee_name = models.CharField(max_length=150, blank=False, null=False, verbose_name='rushee name', unique=True)
    yes_votes = models.IntegerField(blank=False, null=False, verbose_name='yes votes')
    no_votes = models.IntegerField(blank=False, null=False, verbose_name='no votes')
    voters = ArrayField(models.EmailField(max_length=255), blank=True, null=False, verbose_name='voters', default=list)