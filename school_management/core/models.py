from django.db import models

from .utils import to_buddhist_era


class AcademicPeriods(models.Model):
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, verbose_name='ឆ្នាំសិក្សា')
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True, verbose_name='មេ')
    period_type = models.CharField(max_length=15, verbose_name='ប្រភេទរយៈពេល')
    period_number = models.SmallIntegerField(verbose_name='លេខរយៈពេល')
    name = models.CharField(max_length=50, blank=True, null=True, verbose_name='ឈ្មោះ')
    start_date = models.DateField(verbose_name='ថ្ងៃចាប់ផ្តើម')
    end_date = models.DateField(verbose_name='ថ្ងៃបញ្ចប់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'academic_periods'
        verbose_name = 'រយៈពេលសិក្សា'
        verbose_name_plural = 'រយៈពេលសិក្សា'

    def __str__(self):
        return self.name or f'{self.period_type} {self.period_number}'


class AcademicYears(models.Model):
    year_name = models.CharField(unique=True, max_length=20, verbose_name='ឆ្នាំសិក្សា')
    start_date = models.DateField(verbose_name='ថ្ងៃចាប់ផ្តើម', help_text='ឧទាហរណ៍៖ 2024-09-01')
    end_date = models.DateField(verbose_name='ថ្ងៃបញ្ចប់', help_text='ឧទាហរណ៍៖ 2025-07-30')
    is_current = models.BooleanField(verbose_name='ឆ្នាំសិក្សាបច្ចុប្បន្ន')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'academic_years'
        verbose_name = 'ឆ្នាំសិក្សា'
        verbose_name_plural = 'ឆ្នាំសិក្សា'

    @property
    def buddhist_era_year(self):
        return to_buddhist_era(self.start_date.year)

    def save(self, *args, **kwargs):
        if self.is_current:
            # When saving a current academic year, set all others to False
            AcademicYears.objects.filter(is_current=True).exclude(pk=self.pk).update(is_current=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.year_name


class ClassSubjects(models.Model):
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, verbose_name='ថ្នាក់រៀន')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, verbose_name='មុខវិជ្ជា')
    teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, verbose_name='គ្រូ')
    order = models.IntegerField(default=0, verbose_name='លំដាប់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'class_subjects'
        unique_together = (('classroom', 'subject'),)
        ordering = ['order', 'id']
        verbose_name = 'មុខវិជ្ជាថ្នាក់'
        verbose_name_plural = 'មុខវិជ្ជាថ្នាក់'

    def __str__(self):
        return f'{self.classroom} - {self.subject}'


class Classrooms(models.Model):
    class_name = models.CharField(max_length=50, verbose_name='ឈ្មោះថ្នាក់')
    grade_level = models.SmallIntegerField(verbose_name='កម្រិតថ្នាក់')
    homeroom_teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, blank=True, null=True, verbose_name='គ្រូបន្ទុកថ្នាក់')
    room = models.CharField(max_length=20, blank=True, null=True, verbose_name='បន្ទប់')
    desks_per_row = models.SmallIntegerField(default=5, verbose_name='ចំនួនតុក្នុងមួយជួរ')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'classrooms'
        verbose_name = 'ថ្នាក់រៀន'
        verbose_name_plural = 'ថ្នាក់រៀន'

    def __str__(self):
        return self.class_name


class Communes(models.Model):
    commune_code = models.CharField(primary_key=True, max_length=8, verbose_name='កូដឃុំ')
    district = models.ForeignKey('core.Districts', models.DO_NOTHING, blank=True, null=True, verbose_name='ស្រុក/ខណ្ឌ')
    name_kh = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះខ្មែរ')
    name_en = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឡាតាំង')

    class Meta:
        managed = True
        db_table = 'communes'
        verbose_name = 'ឃុំ'
        verbose_name_plural = 'ឃុំ'

    def __str__(self):
        return self.name_kh or self.name_en or self.commune_code


class Districts(models.Model):
    district_code = models.CharField(primary_key=True, max_length=8, verbose_name='កូដស្រុក/ខណ្ឌ')
    province = models.ForeignKey('core.Provinces', models.DO_NOTHING, blank=True, null=True, verbose_name='ខេត្ត/ក្រុង')
    name_kh = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះខ្មែរ')
    name_en = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឡាតាំង')

    class Meta:
        managed = True
        db_table = 'districts'
        verbose_name = 'ស្រុក/ខណ្ឌ'
        verbose_name_plural = 'ស្រុក/ខណ្ឌ'

    def __str__(self):
        return self.name_kh or self.name_en or self.district_code


class Documents(models.Model):
    title = models.CharField(max_length=255, verbose_name='ចំណងជើង')
    doc_category = models.CharField(max_length=50, verbose_name='ប្រភេទឯកសារ')
    file_url = models.TextField(verbose_name='តំណឯកសារ')
    description = models.TextField(blank=True, null=True, verbose_name='ការពិពណ៌នា')
    uploaded_by = models.ForeignKey('users.Users', models.DO_NOTHING, db_column='uploaded_by', blank=True, null=True, verbose_name='អ្នកបញ្ចូល')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'documents'
        verbose_name = 'ឯកសារ'
        verbose_name_plural = 'ឯកសារ'

    def __str__(self):
        return self.title


class EducationLevels(models.Model):
    name = models.CharField(max_length=50, verbose_name='កម្រិតវប្បធម៌')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'education_levels'
        verbose_name = 'កម្រិតវប្បធម៌'
        verbose_name_plural = 'កម្រិតវប្បធម៌'

    def __str__(self):
        return self.name


class Kutis(models.Model):
    pagoda = models.ForeignKey('core.Pagodas', models.DO_NOTHING, verbose_name='វត្ត')
    kuti_name = models.CharField(max_length=30, verbose_name='ឈ្មោះកុដិ')
    manager_name = models.CharField(max_length=150, verbose_name='ឈ្មោះអ្នកគ្រប់គ្រង')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'kutis'
        unique_together = (('pagoda', 'kuti_name'),)
        verbose_name = 'កុដិ'
        verbose_name_plural = 'កុដិ'

    def __str__(self):
        return self.kuti_name


class Nationalities(models.Model):
    name = models.CharField(max_length=100, verbose_name='ឈ្មោះ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'nationalities'
        verbose_name = 'សញ្ជាតិ'
        verbose_name_plural = 'សញ្ជាតិ'

    def __str__(self):
        return self.name


class Pagodas(models.Model):
    name = models.CharField(max_length=150, verbose_name='ឈ្មោះ')
    abbot_name = models.CharField(max_length=150, verbose_name='ឈ្មោះព្រះអធិការ')
    village = models.ForeignKey('core.Villages', models.DO_NOTHING, blank=True, null=True, verbose_name='ភូមិ')
    commune = models.ForeignKey('core.Communes', models.DO_NOTHING, blank=True, null=True, verbose_name='ឃុំ/សង្កាត់')
    district = models.ForeignKey('core.Districts', models.DO_NOTHING, blank=True, null=True, verbose_name='ស្រុក/ខណ្ឌ')
    province = models.ForeignKey('core.Provinces', models.DO_NOTHING, blank=True, null=True, verbose_name='ខេត្ត/ក្រុង')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='ទូរស័ព្ទ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'pagodas'
        verbose_name = 'វត្ត'
        verbose_name_plural = 'វត្ត'

    def __str__(self):
        return self.name


class PaperHeaders(models.Model):
    name = models.CharField(max_length=100, verbose_name='ឈ្មោះ')
    doc_type = models.CharField(max_length=50, blank=True, null=True, verbose_name='ប្រភេទឯកសារ')
    header_html = models.TextField(blank=True, null=True, verbose_name='ក្បាលក្រដាស (HTML)')
    footer_html = models.TextField(blank=True, null=True, verbose_name='បាតក្រដាស (HTML)')
    logo_url = models.ImageField(upload_to='paper_headers/', max_length=500, blank=True, null=True, verbose_name='រូបសញ្ញា')
    is_default = models.BooleanField(blank=True, null=True, verbose_name='លំនាំដើម')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'paper_headers'
        verbose_name = 'ក្បាលក្រដាស'
        verbose_name_plural = 'ក្បាលក្រដាស'

    def __str__(self):
        return self.name


class PayRates(models.Model):
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, blank=True, null=True, verbose_name='មុខវិជ្ជា')
    rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='ថ្លៃក្នុងមួយម៉ោង')
    currency = models.CharField(max_length=10, verbose_name='រូបិយប័ណ្ណ')
    is_active = models.BooleanField(verbose_name='កំពុងប្រើប្រាស់')
    effective_from = models.DateField(verbose_name='ថ្ងៃចូលជាធរមាន')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'pay_rates'
        verbose_name = 'អត្រាប្រាក់ខែ'
        verbose_name_plural = 'អត្រាប្រាក់ខែ'

    def __str__(self):
        return f'{self.subject} - {self.rate_per_hour} {self.currency}'


class PayrollRecords(models.Model):
    teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, verbose_name='គ្រូបង្រៀន')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, blank=True, null=True, verbose_name='មុខវិជ្ជា')
    month_year = models.CharField(max_length=7, verbose_name='ខែ/ឆ្នាំ (ឧ. 2026-06)')
    total_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='ម៉ោងសរុប')
    total_teaching = models.IntegerField(default=0, verbose_name='ចំនួនបង្រៀនសរុប')
    total_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name='ចំនួនទឹកប្រាក់សរុប')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'payroll_records'
        verbose_name = 'កំណត់ត្រាបើកប្រាក់ខែ'
        verbose_name_plural = 'កំណត់ត្រាបើកប្រាក់ខែ'

    def __str__(self):
        return f'{self.teacher} - {self.month_year} - {self.total_amount}'


class MonthlyPayrolls(models.Model):
    teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, verbose_name='គ្រូបង្រៀន')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, verbose_name='មុខវិជ្ជា')
    academic_period = models.ForeignKey('core.AcademicPeriods', models.DO_NOTHING, verbose_name='វគ្គសិក្សា')
    total_hours = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True, verbose_name='ម៉ោងសរុប')
    total_teaching = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='ចំនួនបង្រៀនសរុប')
    rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='ថ្លៃក្នុងមួយម៉ោង')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, verbose_name='ចំនួនទឹកប្រាក់សរុប')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = False
        db_table = 'monthly_payrolls'
        verbose_name = 'កំណត់ត្រាបើកប្រាក់ខែប្រចាំខែ'
        verbose_name_plural = 'កំណត់ត្រាបើកប្រាក់ខែប្រចាំខែ'
        unique_together = (('teacher', 'subject', 'academic_period'),)

    def __str__(self):
        return f'{self.teacher} - {self.academic_period}'


class Provinces(models.Model):
    province_code = models.CharField(primary_key=True, max_length=8, verbose_name='កូដខេត្ត/ក្រុង')
    name_kh = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះខ្មែរ')
    name_en = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឡាតាំង')

    class Meta:
        managed = True
        db_table = 'provinces'
        verbose_name = 'ខេត្ត'
        verbose_name_plural = 'ខេត្ត'

    def __str__(self):
        return self.name_kh or self.name_en or self.province_code


class ScheduleSubstitutions(models.Model):
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, verbose_name='ថ្នាក់រៀន')
    change_date = models.DateField(verbose_name='ថ្ងៃផ្លាស់ប្តូរ')
    time_slot = models.ForeignKey('core.TimeSlots', models.DO_NOTHING, verbose_name='ផ្ទាំងពេលវេលា')
    original_subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, verbose_name='មុខវិជ្ជាដើម')
    original_teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, related_name='schedulesubstitutions_original_teacher_set', blank=True, null=True, verbose_name='គ្រូដើម')
    new_subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, related_name='schedulesubstitutions_new_subject_set', verbose_name='មុខវិជ្ជាថ្មី')
    new_teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, blank=True, null=True, verbose_name='គ្រូជំនួស')
    status = models.CharField(max_length=20, default='pending', choices=[('pending', 'pending'), ('approved', 'approved'), ('rejected', 'rejected')], verbose_name='ស្ថានភាព')
    reason = models.CharField(max_length=255, blank=True, null=True, verbose_name='មូលហេតុ')
    created_by = models.ForeignKey('users.Teachers', models.DO_NOTHING, db_column='created_by', related_name='schedulesubstitutions_created_by_set', blank=True, null=True, verbose_name='អ្នកបង្កើត')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'schedule_substitutions'
        verbose_name = 'ការផ្លាស់ប្តូរកាលវិភាគ'
        verbose_name_plural = 'ការផ្លាស់ប្តូរកាលវិភាគ'

    def __str__(self):
        return f'{self.classroom} - {self.change_date}'


class SchoolCalendar(models.Model):
    title = models.CharField(max_length=150, verbose_name='ចំណងជើង')
    event_type = models.CharField(max_length=30, verbose_name='ប្រភេទព្រឹត្តិការណ៍')
    start_date = models.DateField(verbose_name='ថ្ងៃចាប់ផ្តើម')
    end_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃបញ្ចប់')
    description = models.TextField(blank=True, null=True, verbose_name='ការពិពណ៌នា')
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, blank=True, null=True, verbose_name='ថ្នាក់រៀន')
    location = models.CharField(max_length=150, blank=True, null=True, verbose_name='ទីតាំង')
    organizer = models.ForeignKey('users.Teachers', models.DO_NOTHING, blank=True, null=True, verbose_name='អ្នករៀបចំ')
    is_recurring = models.BooleanField(blank=True, null=True, verbose_name='កើតឡើងម្តងទៀត')
    recurring_type = models.CharField(max_length=20, blank=True, null=True, verbose_name='ប្រភេទកើតឡើងម្តងទៀត')
    color_code = models.CharField(max_length=7, blank=True, null=True, verbose_name='កូដពណ៌')
    notify_days = models.SmallIntegerField(blank=True, null=True, verbose_name='ជូនដំណឹងមុន (ថ្ងៃ)')
    is_public = models.BooleanField(blank=True, null=True, verbose_name='សាធារណៈ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'school_calendar'
        verbose_name = 'ប្រតិទិនសាលា'
        verbose_name_plural = 'ប្រតិទិនសាលា'

    def __str__(self):
        return self.title


class Subjects(models.Model):
    subject_code = models.CharField(unique=True, max_length=20, blank=True, verbose_name='កូដមុខវិជ្ជា')
    subject_name = models.CharField(max_length=100, verbose_name='ឈ្មោះមុខវិជ្ជា')
    coefficient = models.SmallIntegerField(verbose_name='មេគុណ')
    total_hours = models.IntegerField(blank=True, null=True, verbose_name='ចំនួនម៉ោងសរុប')
    total_score = models.IntegerField(blank=True, null=True, verbose_name='ពិន្ទុសរុប')
    total_homework = models.IntegerField(blank=True, null=True, verbose_name='ការងារផ្ទះសរុប')
    total_time_exam = models.IntegerField(blank=True, null=True, verbose_name='រយៈពេលប្រឡងសរុប')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'subjects'
        verbose_name = 'មុខវិជ្ជា'
        verbose_name_plural = 'មុខវិជ្ជា'

    def __str__(self):
        return self.subject_name

    def save(self, *args, **kwargs):
        if not self.subject_code:
            last_subject = Subjects.objects.all().order_by('-id').first()
            if last_subject and last_subject.subject_code and last_subject.subject_code.startswith('S'):
                try:
                    last_num = int(last_subject.subject_code[1:])
                    self.subject_code = f'S{last_num + 1:03d}'
                except ValueError:
                    self.subject_code = 'S001'
            else:
                self.subject_code = 'S001'
        super().save(*args, **kwargs)


class TeachingSessions(models.Model):
    teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, verbose_name='គ្រូ')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, verbose_name='មុខវិជ្ជា')
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, verbose_name='ថ្នាក់រៀន')
    session_date = models.DateField(verbose_name='ថ្ងៃបង្រៀន')
    time_slot = models.ForeignKey('core.TimeSlots', models.DO_NOTHING, verbose_name='ផ្ទាំងពេលវេលា')
    is_substitute = models.BooleanField(verbose_name='ជាការជំនួស')
    substitution = models.ForeignKey('core.ScheduleSubstitutions', models.DO_NOTHING, blank=True, null=True, verbose_name='ការផ្លាស់ប្តូរកាលវិភាគ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'teaching_sessions'
        unique_together = (('classroom', 'session_date', 'time_slot'),)
        verbose_name = 'សម័យបង្រៀន'
        verbose_name_plural = 'សម័យបង្រៀន'

    def __str__(self):
        return f'{self.classroom} - {self.subject} - {self.session_date}'


class TimeSlots(models.Model):
    session = models.CharField(max_length=10, verbose_name='វេន')
    slot_no = models.SmallIntegerField(verbose_name='លេខផ្ទាំង')
    start_time = models.TimeField(verbose_name='ម៉ោងចាប់ផ្តើម')
    end_time = models.TimeField(verbose_name='ម៉ោងបញ្ចប់')

    class Meta:
        managed = True
        db_table = 'time_slots'
        unique_together = (('session', 'slot_no'),)
        verbose_name = 'ផ្ទាំងពេលវេលា'
        verbose_name_plural = 'ផ្ទាំងពេលវេលា'

    def __str__(self):
        return f'{self.session} {self.slot_no} ({self.start_time}-{self.end_time})'


class Timetable(models.Model):
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, verbose_name='ថ្នាក់រៀន')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, verbose_name='មុខវិជ្ជា')
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, blank=True, null=True, verbose_name='ឆ្នាំសិក្សា')
    day_no = models.SmallIntegerField(verbose_name='ថ្ងៃទី')
    time_slot = models.ForeignKey('core.TimeSlots', models.DO_NOTHING, verbose_name='ផ្ទាំងពេលវេលា')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'timetable'
        unique_together = (('classroom', 'academic_year', 'day_no', 'time_slot'),)
        verbose_name = 'កាលវិភាគ'
        verbose_name_plural = 'កាលវិភាគ'

    def __str__(self):
        return f'{self.classroom} - {self.subject} - {self.time_slot}'


class Villages(models.Model):
    village_code = models.CharField(primary_key=True, max_length=8, verbose_name='កូដភូមិ')
    commune = models.ForeignKey('core.Communes', models.DO_NOTHING, blank=True, null=True, verbose_name='ឃុំ/សង្កាត់')
    name_kh = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះខ្មែរ')
    name_en = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឡាតាំង')

    class Meta:
        managed = True
        db_table = 'villages'
        verbose_name = 'ភូមិ'
        verbose_name_plural = 'ភូមិ'

    def __str__(self):
        return self.name_kh or self.name_en or self.village_code


class YearbookEntries(models.Model):
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, verbose_name='ឆ្នាំសិក្សា')
    classroom = models.ForeignKey('core.Classrooms', models.DO_NOTHING, blank=True, null=True, verbose_name='ថ្នាក់រៀន')
    entry_type = models.CharField(max_length=30, verbose_name='ប្រភេទធាតុ')
    title = models.CharField(max_length=150, verbose_name='ចំណងជើង')
    section_order = models.SmallIntegerField(blank=True, null=True, verbose_name='លំដាប់ផ្នែក')
    image_url = models.ImageField(upload_to='yearbooks/', max_length=500, blank=True, null=True, verbose_name='រូបភាព')
    description = models.TextField(blank=True, null=True, verbose_name='ការពិពណ៌នា')
    person = models.ForeignKey('students.Students', models.DO_NOTHING, blank=True, null=True, verbose_name='សិស្ស')
    event_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃព្រឹត្តិការណ៍')
    uploaded_by = models.ForeignKey('users.Teachers', models.DO_NOTHING, db_column='uploaded_by', blank=True, null=True, verbose_name='អ្នកបញ្ចូល')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'yearbook_entries'
        unique_together = (('academic_year', 'classroom', 'person'),)
        verbose_name = 'សៀវភៅប្រចាំឆ្នាំ'
        verbose_name_plural = 'សៀវភៅប្រចាំឆ្នាំ'

    def __str__(self):
        return self.title
class PayrollRates(models.Model):
    class_subject = models.ForeignKey(ClassSubjects, on_delete=models.CASCADE, db_column='class_subject_id')
    academic_period = models.ForeignKey('core.AcademicPeriods', models.SET_NULL, null=True, blank=True, db_column='academic_period_id', verbose_name='វគ្គសិក្សា')
    total_teaching = models.DecimalField(max_digits=5, decimal_places=2)
    rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        managed = False
        db_table = 'payroll_rates'
