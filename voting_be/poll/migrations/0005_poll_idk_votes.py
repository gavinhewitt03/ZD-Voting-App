# Generated by Django 4.2.17 on 2025-02-22 15:49

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("poll", "0004_alter_poll_rushee_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="poll",
            name="idk_votes",
            field=models.IntegerField(default=0, verbose_name="i don't know  votes"),
            preserve_default=False,
        ),
    ]
