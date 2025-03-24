from django.db import models
from django.contrib.postgres.fields import ArrayField

class Poll(models.Model):
    rushee_name = models.CharField(max_length=150, blank=False, null=False, verbose_name='rushee name', unique=False)
    voter = models.CharField(max_length=150, blank=False, null=False, verbose_name='voter email', unique=False)
    vote = models.CharField(max_length=3, blank=False, null=False, verbose_name='vote')

    class Meta:
        verbose_name = 'poll'
        unique_together = ('rushee_name', 'voter')