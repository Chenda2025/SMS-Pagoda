import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_management.settings')
django.setup()

from attendance.models import Attendance

mornings = Attendance.objects.filter(session='morning')
print(f"Fixing {mornings.count()} morning sessions to ព្រឹក")
mornings.update(session='ព្រឹក')

afternoons = Attendance.objects.filter(session='afternoon')
print(f"Fixing {afternoons.count()} afternoon sessions to រសៀល")
afternoons.update(session='រសៀល')

nights = Attendance.objects.filter(session='night')
print(f"Fixing {nights.count()} night sessions to យប់")
nights.update(session='យប់')

print("Done fixing sessions.")
