from django.db import models

class Awards(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='សិស្ស')
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, verbose_name='ឆ្នាំសិក្សា')
    title = models.CharField(max_length=150, verbose_name='ចំណងជើង')
    award_type = models.CharField(max_length=30, verbose_name='ប្រភេទរង្វាន់')
    category = models.CharField(max_length=100, blank=True, null=True, verbose_name='ប្រភេទ')
    rank = models.SmallIntegerField(blank=True, null=True, verbose_name='ចំណាត់ថ្នាក់')
    awarded_date = models.DateField(verbose_name='ថ្ងៃទទួលរង្វាន់')
    description = models.TextField(blank=True, null=True, verbose_name='ការពិពណ៌នា')
    evidence_url = models.CharField(max_length=500, blank=True, null=True, verbose_name='តំណភ័ស្តុតាង')
    awarded_by = models.ForeignKey('users.Teachers', models.DO_NOTHING, db_column='awarded_by', blank=True, null=True, verbose_name='អ្នកប្រគល់')
    status = models.CharField(max_length=20, blank=True, null=True, verbose_name='ស្ថានភាព')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'awards'
        verbose_name = 'រង្វាន់'
        verbose_name_plural = 'រង្វាន់'

    def __str__(self):
        return f'{self.student} - {self.title}'


class ClassMonitors(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='សិស្ស')
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, verbose_name='ថ្នាក់រៀន')
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, verbose_name='ឆ្នាំសិក្សា')
    role = models.CharField(max_length=30, verbose_name='តួនាទី')
    appointed_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃតែងតាំង')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'class_monitors'
        unique_together = (('classroom', 'academic_year', 'role'),)
        verbose_name = 'ប្រធានថ្នាក់'
        verbose_name_plural = 'ប្រធានថ្នាក់'

    def __str__(self):
        return f'{self.student} - {self.role}'


class Enrollments(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='សិស្ស')
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, verbose_name='ថ្នាក់រៀន')
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, verbose_name='ឆ្នាំសិក្សា')
    enrollment_date = models.DateField(verbose_name='ថ្ងៃចុះឈ្មោះ')
    desk_number = models.SmallIntegerField(blank=True, null=True, verbose_name='លេខតុ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'enrollments'
        unique_together = (('student', 'classroom', 'academic_year'),)
        verbose_name = 'ការចុះឈ្មោះចូលរៀន'
        verbose_name_plural = 'ការចុះឈ្មោះចូលរៀន'

    def __str__(self):
        return f'{self.student} - {self.classroom}'


class MonkPermission(models.Model):
    monk = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='ព្រះសង្ឃ')
    reason = models.CharField(max_length=255, verbose_name='មូលហេតុ')
    start_date = models.DateField(verbose_name='ថ្ងៃចាប់ផ្តើម')
    end_date = models.DateField(verbose_name='ថ្ងៃបញ្ចប់')
    status = models.CharField(max_length=20, verbose_name='ស្ថានភាព')
    reviewed_by = models.ForeignKey('users.Teachers', models.DO_NOTHING, db_column='reviewed_by', blank=True, null=True, verbose_name='អ្នកត្រួតពិនិត្យ')
    reviewed_by_monitor = models.ForeignKey('students.Students', models.DO_NOTHING, db_column='reviewed_by_monitor', related_name='monkpermission_reviewed_by_monitor_set', blank=True, null=True, verbose_name='ប្រធានថ្នាក់ត្រួតពិនិត្យ')
    reviewed_at = models.DateTimeField(blank=True, null=True, verbose_name='ពេលត្រួតពិនិត្យ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'monk_permission'
        verbose_name = 'ច្បាប់ឈប់សម្រាក'
        verbose_name_plural = 'ច្បាប់ឈប់សម្រាក'

    def __str__(self):
        return f'{self.monk} - {self.start_date}'


class MonkPermissionLogs(models.Model):
    permission = models.ForeignKey('students.MonkPermission', models.DO_NOTHING, verbose_name='ច្បាប់ឈប់សម្រាក')
    action = models.CharField(max_length=30, verbose_name='សកម្មភាព')
    old_status = models.CharField(max_length=20, blank=True, null=True, verbose_name='ស្ថានភាពចាស់')
    new_status = models.CharField(max_length=20, blank=True, null=True, verbose_name='ស្ថានភាពថ្មី')
    performed_by = models.ForeignKey('users.Teachers', models.DO_NOTHING, db_column='performed_by', blank=True, null=True, verbose_name='អ្នកអនុវត្ត')
    performed_by_monitor = models.ForeignKey('students.Students', models.DO_NOTHING, db_column='performed_by_monitor', blank=True, null=True, verbose_name='ប្រធានថ្នាក់អនុវត្ត')
    note = models.CharField(max_length=255, blank=True, null=True, verbose_name='កំណត់ចំណាំ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'monk_permission_logs'
        verbose_name = 'កំណត់ហេតុច្បាប់ឈប់សម្រាក'
        verbose_name_plural = 'កំណត់ហេតុច្បាប់ឈប់សម្រាក'

    def __str__(self):
        return f'{self.permission} - {self.action}'


class PendingStudents(models.Model):
    tracking_code = models.CharField(max_length=6, unique=True, blank=True, null=True, verbose_name='កូដតាមដាន')
    image_url = models.ImageField(upload_to='pending_students/', max_length=500, blank=True, null=True, verbose_name='រូបថត')
    new_current_pagoda_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='វត្តកំពុងស្នាក់ (ថ្មី)')
    new_birth_pagoda_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='វត្តកំណើត (ថ្មី)')
    new_kuti_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='កុដិ (ថ្មី)')
    new_nationality_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='សញ្ជាតិ (ថ្មី)')
    first_name = models.CharField(max_length=50, verbose_name='នាមខ្លួន')
    last_name = models.CharField(max_length=50, verbose_name='នាមត្រកូល')
    latin_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឡាតាំង')
    gender = models.CharField(max_length=10, blank=True, null=True, verbose_name='ភេទ')
    monk_status = models.CharField(max_length=20, blank=True, null=True, verbose_name='ឋានៈព្រះសង្ឃ')
    sanghatika_no = models.CharField(max_length=50, blank=True, null=True, verbose_name='លេខសង្ឃាដិក')
    chaya_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឆាយា')
    chaya_no = models.CharField(max_length=50, blank=True, null=True, verbose_name='លេខឆាយា')
    ordination_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃបួស')
    preceptor_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='ឈ្មោះព្រះឧបជ្ឈាយ៍')
    nationality = models.ForeignKey('core.Nationalities', models.DO_NOTHING, blank=True, null=True, verbose_name='សញ្ជាតិ')
    date_of_birth = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃខែឆ្នាំកំណើត')
    birth_village_code = models.ForeignKey('core.Villages', models.DO_NOTHING, db_column='birth_village_code', blank=True, null=True, verbose_name='ភូមិកំណើត')
    education_level = models.CharField(max_length=50, blank=True, null=True, verbose_name='កម្រិតវប្បធម៌')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='ទូរស័ព្ទ')
    current_pagoda = models.ForeignKey('core.Pagodas', models.DO_NOTHING, blank=True, null=True, verbose_name='វត្តកំពុងស្នាក់')
    birth_pagoda = models.ForeignKey('core.Pagodas', models.DO_NOTHING, related_name='pending_students_birth_pagoda_set', blank=True, null=True, verbose_name='វត្តកំណើត')
    kuti = models.ForeignKey('core.Kutis', models.DO_NOTHING, blank=True, null=True, verbose_name='កុដិ')
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name='អាសយដ្ឋាន')
    note = models.TextField(blank=True, null=True, verbose_name='កំណត់ចំណាំ')
    status = models.CharField(max_length=20, default='draft', verbose_name='ស្ថានភាព')
    reviewed_by = models.ForeignKey('users.Users', models.DO_NOTHING, db_column='reviewed_by', blank=True, null=True, verbose_name='អ្នកត្រួតពិនិត្យ')
    reviewed_at = models.DateTimeField(blank=True, null=True, verbose_name='ពេលត្រួតពិនិត្យ')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'pending_students'
        verbose_name = 'សិស្សកំពុងរង់ចាំ'
        verbose_name_plural = 'សិស្សកំពុងរង់ចាំ'

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class StudentEducation(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='សិស្ស')
    level = models.CharField(max_length=100, verbose_name='កម្រិតវប្បធម៌')
    institution = models.CharField(max_length=150, blank=True, null=True, verbose_name='គ្រឹះស្ថាន')
    start_year = models.SmallIntegerField(blank=True, null=True, verbose_name='ឆ្នាំចាប់ផ្តើម')
    end_year = models.SmallIntegerField(blank=True, null=True, verbose_name='ឆ្នាំបញ្ចប់')
    note = models.CharField(max_length=255, blank=True, null=True, verbose_name='កំណត់ចំណាំ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'student_education'
        verbose_name = 'ការសិក្សារបស់សិស្ស'
        verbose_name_plural = 'ការសិក្សារបស់សិស្ស'

    def __str__(self):
        return f'{self.student} - {self.level}'


class StudentPayYear(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='សិស្ស')
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, verbose_name='ឆ្នាំសិក្សា')
    amount_due = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='ប្រាក់ត្រូវបង់')
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='ប្រាក់បានបង់')
    balance = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name='ប្រាក់នៅខ្វះ')
    payment_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃបង់ប្រាក់')
    status = models.CharField(max_length=20, verbose_name='ស្ថានភាព')
    note = models.TextField(blank=True, null=True, verbose_name='កំណត់ចំណាំ')
    recorded_by = models.ForeignKey('users.Users', models.DO_NOTHING, db_column='recorded_by', blank=True, null=True, verbose_name='អ្នកកត់ត្រា')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'student_pay_year'
        unique_together = (('student', 'academic_year'),)
        verbose_name = 'ការបង់ប្រាក់សិស្សប្រចាំឆ្នាំ'
        verbose_name_plural = 'ការបង់ប្រាក់សិស្សប្រចាំឆ្នាំ'

    def __str__(self):
        return f'{self.student} - {self.academic_year}'


class Students(models.Model):
    student_code = models.CharField(unique=True, max_length=20, verbose_name='កូដសិស្ស')
    first_name = models.CharField(max_length=50, verbose_name='នាមខ្លួន')
    last_name = models.CharField(max_length=50, verbose_name='នាមត្រកូល')
    latin_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឡាតាំង')
    gender = models.CharField(max_length=10, verbose_name='ភេទ')
    monk_status = models.CharField(max_length=20, verbose_name='ឋានៈព្រះសង្ឃ')
    image_url = models.ImageField(upload_to='students/', max_length=500, blank=True, null=True, verbose_name='រូបថត')
    sanghatika_no = models.CharField(max_length=50, blank=True, null=True, verbose_name='លេខសង្ឃាដិក')
    chaya_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឆាយា')
    chaya_no = models.CharField(max_length=50, blank=True, null=True, verbose_name='លេខឆាយា')
    ordination_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃបួស')
    preceptor_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='ឈ្មោះព្រះឧបជ្ឈាយ៍')
    nationality = models.ForeignKey('core.Nationalities', models.DO_NOTHING, blank=True, null=True, verbose_name='សញ្ជាតិ')
    date_of_birth = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃខែឆ្នាំកំណើត')
    birth_village_code = models.ForeignKey('core.Villages', models.DO_NOTHING, db_column='birth_village_code', blank=True, null=True, verbose_name='ភូមិកំណើត')
    education_level = models.ForeignKey('core.EducationLevels', models.DO_NOTHING, blank=True, null=True, verbose_name='កម្រិតវប្បធម៌')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='ទូរស័ព្ទ')
    current_pagoda = models.ForeignKey('core.Pagodas', models.DO_NOTHING, blank=True, null=True, verbose_name='វត្តកំពុងស្នាក់')
    birth_pagoda = models.ForeignKey('core.Pagodas', models.DO_NOTHING, related_name='students_birth_pagoda_set', blank=True, null=True, verbose_name='វត្តកំណើត')
    kuti = models.ForeignKey('core.Kutis', models.DO_NOTHING, blank=True, null=True, verbose_name='កុដិ')
    enrollment_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃចូលរៀន')
    status = models.CharField(max_length=20, verbose_name='ស្ថានភាព')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'students'
        verbose_name = 'សិស្ស'
        verbose_name_plural = 'សិស្ស'

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class RegistrationSession(models.Model):
    title = models.CharField(max_length=200, verbose_name='ចំណងជើង (ឧ. ឆ្នាំសិក្សា ២០២៦)')
    start_date = models.DateField(verbose_name='ថ្ងៃចាប់ផ្តើម')
    end_date = models.DateField(verbose_name='ថ្ងៃបញ្ចប់')
    is_active = models.BooleanField(default=True, verbose_name='កំពុងបើក')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'registration_sessions'
        verbose_name = 'រដូវកាលចុះឈ្មោះ'
        verbose_name_plural = 'រដូវកាលចុះឈ្មោះ'

    def __str__(self):
        return f'{self.title} ({self.start_date} - {self.end_date})'

class MultiplePermission(models.Model):
    student = models.ForeignKey('students.Students', on_delete=models.CASCADE, verbose_name='សិស្ស')
    reason = models.TextField(blank=True, null=True, verbose_name='មូលហេតុ')
    start_date = models.DateField(verbose_name='ថ្ងៃចាប់ផ្តើម')
    end_date = models.DateField(verbose_name='ថ្ងៃបញ្ចប់')
    reminder_sent = models.BooleanField(default=False, verbose_name='បានផ្ញើសាររំលឹក')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        db_table = 'multiple_permission'
        verbose_name = 'ច្បាប់ឈប់សម្រាកច្រើនថ្ងៃ'
        verbose_name_plural = 'ច្បាប់ឈប់សម្រាកច្រើនថ្ងៃ'

    def __str__(self):
        return f'{self.student} ({self.start_date} to {self.end_date})'

class DropoutStudent(models.Model):
    student = models.ForeignKey('students.Students', on_delete=models.CASCADE, verbose_name='សិស្ស')
    reason = models.TextField(blank=True, null=True, verbose_name='មូលហេតុ')
    status = models.BooleanField(default=True, verbose_name='ស្ថានភាពឈប់រៀន')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        db_table = 'dropout'
        verbose_name = 'សិស្សឈប់រៀន'
        verbose_name_plural = 'សិស្សឈប់រៀន'

    def __str__(self):
        return f'{self.student} - {"Dropped" if self.status else "Re-enrolled"}'
