# Generated by Django 4.2.17 on 2025-01-21 07:46

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("poll", "0002_poll_voters"),
    ]

    operations = [
        migrations.AlterField(
            model_name="poll",
            name="voters",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.EmailField(max_length=255),
                blank=True,
                default=list,
                size=None,
                verbose_name="voters",
            ),
        ),
    ]
