from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_payrollrates_academic_period'),
    ]

    operations = [
        migrations.RunSQL(
            sql="ALTER TABLE payroll_rates ADD COLUMN IF NOT EXISTS note TEXT NULL;",
            reverse_sql="ALTER TABLE payroll_rates DROP COLUMN IF EXISTS note;",
        ),
    ]
