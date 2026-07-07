import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("""
        SELECT conname
        FROM pg_constraint c
        JOIN pg_namespace n ON n.oid = c.connamespace
        WHERE contype = 'c' AND conrelid = 'academic_periods'::regclass;
    """)
    constraints = cursor.fetchall()
    print("Constraints:", constraints)
