from django.db import models

class Attendance(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='សិស្ស')
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, verbose_name='ថ្នាក់រៀន')
    session = models.CharField(max_length=10, verbose_name='សម័យ')
    attendance_date = models.DateField(verbose_name='ថ្ងៃវត្តមាន')
    status = models.CharField(max_length=15, verbose_name='ស្ថានភាព')
    late_time = models.TimeField(blank=True, null=True, verbose_name='ម៉ោងយឺត')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, blank=True, null=True, verbose_name='មុខវិជ្ជា')
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, verbose_name='ឆ្នាំសិក្សា')
    recorded_by_teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, blank=True, null=True, verbose_name='កត់ត្រាដោយគ្រូ')
    recorded_by_monitor = models.ForeignKey('students.Students', models.DO_NOTHING, related_name='attendance_recorded_by_monitor_set', blank=True, null=True, verbose_name='កត់ត្រាដោយប្រធានថ្នាក់')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'attendance'
        unique_together = (('student', 'attendance_date', 'session'),)
        verbose_name = 'វត្តមាន'
        verbose_name_plural = 'វត្តមាន'

    def __str__(self):
        return f'{self.student} - {self.attendance_date}'


class Notifications(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, blank=True, null=True, verbose_name='សិស្ស')
    type = models.CharField(max_length=50, verbose_name='ប្រភេទ')
    title = models.CharField(max_length=150, verbose_name='ចំណងជើង')
    message = models.TextField(verbose_name='សារ')
    related_id = models.IntegerField(blank=True, null=True, verbose_name='លេខសម្គាល់ពាក់ព័ន្ធ')
    is_read = models.BooleanField(verbose_name='បានអាន')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'notifications'
        verbose_name = 'សេចក្តីជូនដំណឹង'
        verbose_name_plural = 'សេចក្តីជូនដំណឹង'

    def __str__(self):
        return self.title


class AttendanceWarning(models.Model):
    # Tracks the highest absence/permission/late count already warned about
    # per student per academic year, so the Telegram escalation warning (fires
    # again every +2 past a per-category base) doesn't re-send on every page
    # load once a threshold has been crossed.
    student = models.ForeignKey('students.Students', on_delete=models.CASCADE, verbose_name='សិស្ស')
    academic_year = models.ForeignKey('core.AcademicYears', on_delete=models.CASCADE, verbose_name='ឆ្នាំសិក្សា')
    last_absent_warned = models.IntegerField(default=0, verbose_name='កម្រិតព្រមានអវត្តមានចុងក្រោយ')
    last_permission_warned = models.IntegerField(default=0, verbose_name='កម្រិតព្រមានច្បាប់ចុងក្រោយ')
    last_late_warned = models.IntegerField(default=0, verbose_name='កម្រិតព្រមានយឺតចុងក្រោយ')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'attendance_warnings'
        unique_together = (('student', 'academic_year'),)
        verbose_name = 'ការព្រមានវត្តមាន'
        verbose_name_plural = 'ការព្រមានវត្តមាន'

    def __str__(self):
        return f'{self.student} - {self.academic_year}'


class ReportDaily(models.Model):
    report_date = models.DateField(verbose_name='ថ្ងៃរបាយការណ៍')
    title = models.CharField(max_length=255, blank=True, null=True, verbose_name='ចំណងជើង')
    content = models.TextField(verbose_name='មាតិកា')
    reported_by = models.ForeignKey('users.Users', models.DO_NOTHING, db_column='reported_by', blank=True, null=True, verbose_name='អ្នករាយការណ៍')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'report_daily'
        unique_together = (('report_date', 'reported_by'),)
        verbose_name = 'របាយការណ៍ប្រចាំថ្ងៃ'
        verbose_name_plural = 'របាយការណ៍ប្រចាំថ្ងៃ'

    def __str__(self):
        return self.title or str(self.report_date)

