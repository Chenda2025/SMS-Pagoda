import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from attendance.models import Attendance
from students.models import Students
from core.models import Classrooms, AcademicYears

s = Students.objects.first()
c = Classrooms.objects.first()
a = AcademicYears.objects.first()

print("Testing PM format")
try:
    att = Attendance.objects.create(
        student=s, classroom=c, academic_year=a, 
        session='morning', attendance_date='2026-07-09',
        status='late', late_time='14:05:01 PM'
    )
    print("SUCCESS 14:05:01 PM:", att.late_time)
except Exception as e:
    print("ERROR 14:05:01 PM:", e)

print("Testing normal format")
try:
    att2 = Attendance.objects.create(
        student=s, classroom=c, academic_year=a, 
        session='afternoon', attendance_date='2026-07-09',
        status='late', late_time='14:05:01'
    )
    print("SUCCESS 14:05:01:", att2.late_time)
except Exception as e:
    print("ERROR 14:05:01:", e)
