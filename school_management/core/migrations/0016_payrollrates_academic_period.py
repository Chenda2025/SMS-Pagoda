from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_payrollrecords'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE payroll_rates
                ADD COLUMN IF NOT EXISTS academic_period_id INTEGER
                    REFERENCES academic_periods(id) ON DELETE SET NULL;
            """,
            reverse_sql="ALTER TABLE payroll_rates DROP COLUMN IF EXISTS academic_period_id;",
        ),
    ]
