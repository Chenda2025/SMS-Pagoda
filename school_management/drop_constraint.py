import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("ALTER TABLE academic_periods DROP CONSTRAINT IF EXISTS academic_periods_period_type_check;")
    print("Constraint dropped!")
