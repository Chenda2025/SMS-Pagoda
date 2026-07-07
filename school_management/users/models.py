from django.contrib.auth.hashers import check_password, make_password
from django.db import models

class ActivityLogs(models.Model):
    user = models.ForeignKey('users.Users', models.DO_NOTHING, blank=True, null=True, verbose_name='អ្នកប្រើប្រាស់')
    action = models.CharField(max_length=50, verbose_name='សកម្មភាព')
    table_name = models.CharField(max_length=50, blank=True, null=True, verbose_name='ឈ្មោះតារាង')
    record_id = models.IntegerField(blank=True, null=True, verbose_name='លេខសម្គាល់កំណត់ត្រា')
    description = models.CharField(max_length=255, blank=True, null=True, verbose_name='ការពិពណ៌នា')
    ip_address = models.CharField(max_length=45, blank=True, null=True, verbose_name='អាសយដ្ឋាន IP')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'activity_logs'
        verbose_name = 'កំណត់ហេតុសកម្មភាព'
        verbose_name_plural = 'កំណត់ហេតុសកម្មភាព'

    def __str__(self):
        return f'{self.user} - {self.action}'


class Positions(models.Model):
    title = models.CharField(max_length=100, verbose_name='ចំណងជើង')
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True, verbose_name='តួនាទីមេ')
    description = models.CharField(max_length=255, blank=True, null=True, verbose_name='ការពិពណ៌នា')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'positions'
        verbose_name = 'តួនាទី'
        verbose_name_plural = 'តួនាទី'

    def __str__(self):
        return self.title


class StaffPositions(models.Model):
    teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, verbose_name='គ្រូ')
    position = models.ForeignKey('users.Positions', models.DO_NOTHING, verbose_name='តួនាទី')
    start_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃចាប់ផ្តើម')
    end_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃបញ្ចប់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'staff_positions'
        verbose_name = 'តួនាទីបុគ្គលិក'
        verbose_name_plural = 'តួនាទីបុគ្គលិក'

    def __str__(self):
        return f'{self.teacher} - {self.position}'


class TeacherEducation(models.Model):
    teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, verbose_name='គ្រូ')
    degree = models.CharField(max_length=100, verbose_name='សញ្ញាបត្រ')
    field = models.CharField(max_length=100, blank=True, null=True, verbose_name='ជំនាញ')
    institution = models.CharField(max_length=150, blank=True, null=True, verbose_name='គ្រឹះស្ថាន')
    education_type = models.CharField(max_length=20, blank=True, null=True, verbose_name='ប្រភេទការសិក្សា')
    start_year = models.SmallIntegerField(blank=True, null=True, verbose_name='ឆ្នាំចាប់ផ្តើម')
    end_year = models.SmallIntegerField(blank=True, null=True, verbose_name='ឆ្នាំបញ្ចប់')
    is_completed = models.BooleanField(blank=True, null=True, verbose_name='បានបញ្ចប់')
    note = models.CharField(max_length=255, blank=True, null=True, verbose_name='កំណត់ចំណាំ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'teacher_education'
        verbose_name = 'ការសិក្សារបស់គ្រូ'
        verbose_name_plural = 'ការសិក្សារបស់គ្រូ'

    def __str__(self):
        return f'{self.teacher} - {self.degree}'


class TeacherSalaries(models.Model):
    teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, verbose_name='គ្រូ')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, verbose_name='មុខវិជ្ជា')
    academic_year = models.ForeignKey('core.AcademicYears', models.DO_NOTHING, blank=True, null=True, verbose_name='ឆ្នាំសិក្សា')
    period_label = models.CharField(max_length=50, blank=True, null=True, verbose_name='ឈ្មោះរយៈពេល')
    total_hours = models.DecimalField(max_digits=6, decimal_places=2, verbose_name='ចំនួនម៉ោងសរុប')
    rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='ថ្លៃក្នុងមួយម៉ោង')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, verbose_name='ប្រាក់សរុប')
    calculated_at = models.DateTimeField(blank=True, null=True, verbose_name='ពេលគណនា')

    class Meta:
        managed = True
        db_table = 'teacher_salaries'
        unique_together = (('teacher', 'subject', 'academic_year', 'period_label'),)
        verbose_name = 'ប្រាក់ខែគ្រូ'
        verbose_name_plural = 'ប្រាក់ខែគ្រូ'

    def __str__(self):
        return f'{self.teacher} - {self.subject}'


class Teachers(models.Model):
    teacher_code = models.CharField(unique=True, max_length=20, blank=True, verbose_name='កូដគ្រូ')
    first_name = models.CharField(max_length=50, verbose_name='នាមខ្លួន')
    last_name = models.CharField(max_length=50, verbose_name='នាមត្រកូល')
    latin_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឡាតាំង')
    GENDER_CHOICES = [
        ('ប្រុស', 'ប្រុស'),
        ('ស្រី', 'ស្រី'),
    ]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name='ភេទ')
    MONK_STATUS_CHOICES = [
        ('គ្រហស្ថ', 'គ្រហស្ថ'),
        ('សាមណេរ', 'សាមណេរ'),
        ('ភិក្ខុ', 'ភិក្ខុ'),
        ('ដូនជី', 'ដូនជី'),
    ]
    monk_status = models.CharField(max_length=20, choices=MONK_STATUS_CHOICES, verbose_name='ឋានៈព្រះសង្ឃ')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='ទូរស័ព្ទ')
    start_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃចូលបម្រើការ')
    STATUS_CHOICES = [
        ('active', 'សកម្ម'),
        ('inactive', 'អសកម្ម / ឈប់ធ្វើការ'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, verbose_name='ស្ថានភាព')
    image_url = models.ImageField(upload_to='teachers/', max_length=500, blank=True, null=True, verbose_name='រូបថត')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'teachers'
        verbose_name = 'គ្រូ'
        verbose_name_plural = 'គ្រូ'

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def save(self, *args, **kwargs):
        if not self.teacher_code:
            last_teacher = Teachers.objects.all().order_by('-id').first()
            if last_teacher and last_teacher.teacher_code and last_teacher.teacher_code.startswith('T'):
                try:
                    last_num = int(last_teacher.teacher_code[1:])
                    self.teacher_code = f'T{last_num + 1:04d}'
                except ValueError:
                    self.teacher_code = 'T0001'
            else:
                self.teacher_code = 'T0001'
        super().save(*args, **kwargs)


class PendingTeachers(models.Model):
    tracking_code = models.CharField(max_length=6, unique=True, blank=True, null=True, verbose_name='កូដតាមដាន')
    image_url = models.ImageField(upload_to='pending_teachers/', max_length=500, blank=True, null=True, verbose_name='រូបថត')
    first_name = models.CharField(max_length=50, verbose_name='នាមខ្លួន')
    last_name = models.CharField(max_length=50, verbose_name='នាមត្រកូល')
    latin_name = models.CharField(max_length=100, blank=True, null=True, verbose_name='ឈ្មោះឡាតាំង')
    gender = models.CharField(max_length=10, blank=True, null=True, verbose_name='ភេទ')
    monk_status = models.CharField(max_length=20, blank=True, null=True, verbose_name='ឋានៈព្រះសង្ឃ')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name='ទូរស័ព្ទ')
    start_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃចូលបម្រើការ')
    note = models.TextField(blank=True, null=True, verbose_name='កំណត់ចំណាំ')
    status = models.CharField(max_length=20, default='draft', verbose_name='ស្ថានភាព')
    reviewed_by = models.ForeignKey('users.Users', models.DO_NOTHING, db_column='reviewed_by', blank=True, null=True, verbose_name='អ្នកត្រួតពិនិត្យ')
    reviewed_at = models.DateTimeField(blank=True, null=True, verbose_name='ពេលត្រួតពិនិត្យ')
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'pending_teachers'
        verbose_name = 'គ្រូកំពុងរង់ចាំ'
        verbose_name_plural = 'គ្រូកំពុងរង់ចាំ'

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class TeacherRegistrationSession(models.Model):
    title = models.CharField(max_length=200, verbose_name='ចំណងជើង (ឧ. ការជ្រើសរើសគ្រូប្រចាំឆ្នាំ ២០២៦)')
    start_date = models.DateField(verbose_name='ថ្ងៃចាប់ផ្តើម')
    end_date = models.DateField(verbose_name='ថ្ងៃផុតកំណត់')
    is_active = models.BooleanField(default=True, verbose_name='កំពុងបើក')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = True
        db_table = 'teacher_registration_sessions'
        verbose_name = 'រដូវកាលដាក់ពាក្យធ្វើគ្រូ'
        verbose_name_plural = 'រដូវកាលដាក់ពាក្យធ្វើគ្រូ'

    def __str__(self):
        return f'{self.title} ({self.start_date} - {self.end_date})'


class UsersManager(models.Manager):
    def get_by_natural_key(self, username):
        return self.get(username=username)

    def create_user(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'user')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        return self.create_user(username, password, **extra_fields)


class Users(models.Model):
    id = models.AutoField(primary_key=True, verbose_name='លេខសម្គាល់')
    username = models.CharField(unique=True, max_length=50, verbose_name='ឈ្មោះអ្នកប្រើប្រាស់')
    password_hash = models.CharField(max_length=255, verbose_name='ពាក្យសម្ងាត់')
    role = models.CharField(max_length=20, verbose_name='តួនាទី')
    teacher = models.ForeignKey('users.Teachers', models.DO_NOTHING, blank=True, null=True, verbose_name='គ្រូ')
    student = models.ForeignKey('students.Students', models.DO_NOTHING, blank=True, null=True, verbose_name='សិស្ស')
    is_active = models.BooleanField(default=True, verbose_name='កំពុងប្រើប្រាស់')
    last_login = models.DateTimeField(blank=True, null=True, verbose_name='ចូលប្រើចុងក្រោយ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    objects = UsersManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    EMAIL_FIELD = None

    is_anonymous = False
    is_authenticated = True

    class Meta:
        managed = True
        db_table = 'users'
        verbose_name = 'អ្នកប្រើប្រាស់'
        verbose_name_plural = 'អ្នកប្រើប្រាស់'

    def __str__(self):
        return self.username

    def get_username(self):
        return self.username

    def set_password(self, raw_password):
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password_hash)

    @property
    def is_staff(self):
        return self.role in ('admin', 'staff')

    @property
    def is_superuser(self):
        return self.role == 'admin'

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_perms(self, perm_list, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def get_all_permissions(self, obj=None):
        return set()

    def get_group_permissions(self, obj=None):
        return set()

