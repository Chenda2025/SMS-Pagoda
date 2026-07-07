# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AcademicPeriods(models.Model):
    academic_year = models.ForeignKey('AcademicYears', models.DO_NOTHING)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    period_type = models.CharField(max_length=15)
    period_number = models.SmallIntegerField()
    name = models.CharField(max_length=50, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'academic_periods'


class AcademicYears(models.Model):
    year_name = models.CharField(unique=True, max_length=20)
    start_date = models.DateField()
    end_date = models.DateField()
    is_current = models.BooleanField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'academic_years'


class ActivityLogs(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    action = models.CharField(max_length=50)
    table_name = models.CharField(max_length=50, blank=True, null=True)
    record_id = models.IntegerField(blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'activity_logs'


class Attendance(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING)
    classroom = models.ForeignKey('Classrooms', models.DO_NOTHING)
    session = models.CharField(max_length=10)
    attendance_date = models.DateField()
    status = models.CharField(max_length=15)
    subject = models.ForeignKey('Subjects', models.DO_NOTHING, blank=True, null=True)
    academic_year = models.ForeignKey(AcademicYears, models.DO_NOTHING)
    recorded_by_teacher = models.ForeignKey('Teachers', models.DO_NOTHING, blank=True, null=True)
    recorded_by_monitor = models.ForeignKey('Students', models.DO_NOTHING, related_name='attendance_recorded_by_monitor_set', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'attendance'
        unique_together = (('student', 'attendance_date', 'session'),)


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class AuthtokenToken(models.Model):
    key = models.CharField(primary_key=True, max_length=40)
    created = models.DateTimeField()
    user = models.OneToOneField(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'authtoken_token'


class Awards(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING)
    academic_year = models.ForeignKey(AcademicYears, models.DO_NOTHING)
    title = models.CharField(max_length=150)
    award_type = models.CharField(max_length=30)
    category = models.CharField(max_length=100, blank=True, null=True)
    rank = models.SmallIntegerField(blank=True, null=True)
    awarded_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    evidence_url = models.CharField(max_length=500, blank=True, null=True)
    awarded_by = models.ForeignKey('Teachers', models.DO_NOTHING, db_column='awarded_by', blank=True, null=True)
    status = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'awards'


class ClassMonitors(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING)
    classroom = models.ForeignKey('Classrooms', models.DO_NOTHING)
    academic_year = models.ForeignKey(AcademicYears, models.DO_NOTHING)
    role = models.CharField(max_length=30)
    appointed_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'class_monitors'
        unique_together = (('classroom', 'academic_year', 'role'),)


class ClassSubjects(models.Model):
    classroom = models.ForeignKey('Classrooms', models.DO_NOTHING)
    subject = models.ForeignKey('Subjects', models.DO_NOTHING)
    teacher = models.ForeignKey('Teachers', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'class_subjects'
        unique_together = (('classroom', 'subject'),)


class Classrooms(models.Model):
    class_name = models.CharField(max_length=50)
    grade_level = models.SmallIntegerField()
    homeroom_teacher = models.ForeignKey('Teachers', models.DO_NOTHING, blank=True, null=True)
    room = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'classrooms'


class Communes(models.Model):
    commune_code = models.CharField(primary_key=True, max_length=8)
    name_kh = models.CharField(max_length=100, blank=True, null=True)
    name_en = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'communes'


class Districts(models.Model):
    district_code = models.CharField(primary_key=True, max_length=8)
    name_kh = models.CharField(max_length=100, blank=True, null=True)
    name_en = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'districts'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Documents(models.Model):
    title = models.CharField(max_length=255)
    doc_category = models.CharField(max_length=50)
    file_url = models.TextField()
    description = models.TextField(blank=True, null=True)
    uploaded_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='uploaded_by', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'documents'


class Enrollments(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING)
    classroom = models.ForeignKey(Classrooms, models.DO_NOTHING)
    academic_year = models.ForeignKey(AcademicYears, models.DO_NOTHING)
    enrollment_date = models.DateField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'enrollments'
        unique_together = (('student', 'classroom', 'academic_year'),)


class FinalScores(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING)
    subject = models.ForeignKey('Subjects', models.DO_NOTHING)
    period = models.ForeignKey(AcademicPeriods, models.DO_NOTHING)
    attendance_score = models.DecimalField(max_digits=5, decimal_places=2)
    homework_score = models.DecimalField(max_digits=5, decimal_places=2)
    exercise_score = models.DecimalField(max_digits=5, decimal_places=2)
    exam_score = models.DecimalField(max_digits=6, decimal_places=2)
    total_activity = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    final_score = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'final_scores'
        unique_together = (('student', 'subject', 'period'),)


class Kutis(models.Model):
    pagoda = models.ForeignKey('Pagodas', models.DO_NOTHING)
    kuti_name = models.CharField(max_length=30)
    manager_name = models.CharField(max_length=150)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'kutis'
        unique_together = (('pagoda', 'kuti_name'),)


class MonkPermission(models.Model):
    monk = models.ForeignKey('Students', models.DO_NOTHING)
    reason = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20)
    reviewed_by = models.ForeignKey('Teachers', models.DO_NOTHING, db_column='reviewed_by', blank=True, null=True)
    reviewed_by_monitor = models.ForeignKey('Students', models.DO_NOTHING, db_column='reviewed_by_monitor', related_name='monkpermission_reviewed_by_monitor_set', blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'monk_permission'


class MonkPermissionLogs(models.Model):
    permission = models.ForeignKey(MonkPermission, models.DO_NOTHING)
    action = models.CharField(max_length=30)
    old_status = models.CharField(max_length=20, blank=True, null=True)
    new_status = models.CharField(max_length=20, blank=True, null=True)
    performed_by = models.ForeignKey('Teachers', models.DO_NOTHING, db_column='performed_by', blank=True, null=True)
    performed_by_monitor = models.ForeignKey('Students', models.DO_NOTHING, db_column='performed_by_monitor', blank=True, null=True)
    note = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'monk_permission_logs'


class Nationalities(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'nationalities'


class Notifications(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING, blank=True, null=True)
    type = models.CharField(max_length=50)
    title = models.CharField(max_length=150)
    message = models.TextField()
    related_id = models.IntegerField(blank=True, null=True)
    is_read = models.BooleanField()
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notifications'


class Pagodas(models.Model):
    name = models.CharField(max_length=150)
    abbot_name = models.CharField(max_length=150)
    village = models.CharField(max_length=100, blank=True, null=True)
    commune = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    province = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagodas'


class PaperHeaders(models.Model):
    name = models.CharField(max_length=100)
    doc_type = models.CharField(max_length=50, blank=True, null=True)
    header_html = models.TextField(blank=True, null=True)
    footer_html = models.TextField(blank=True, null=True)
    logo_url = models.CharField(max_length=500, blank=True, null=True)
    is_default = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'paper_headers'


class PayRates(models.Model):
    subject = models.ForeignKey('Subjects', models.DO_NOTHING, blank=True, null=True)
    rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    is_active = models.BooleanField()
    effective_from = models.DateField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pay_rates'


class PendingStudents(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    gender = models.CharField(max_length=1, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    pagoda_name = models.CharField(max_length=150, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20)
    reviewed_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='reviewed_by', blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pending_students'


class PermissionActions(models.Model):
    action_code = models.CharField(unique=True, max_length=50)
    action_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    action_level = models.SmallIntegerField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'permission_actions'


class PermissionAuditLogs(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING)
    action_type = models.CharField(max_length=30)
    resource = models.ForeignKey('PermissionResources', models.DO_NOTHING, blank=True, null=True)
    action = models.ForeignKey(PermissionActions, models.DO_NOTHING, blank=True, null=True)
    permission = models.ForeignKey('Permissions', models.DO_NOTHING, blank=True, null=True)
    target_user = models.ForeignKey('Users', models.DO_NOTHING, related_name='permissionauditlogs_target_user_set', blank=True, null=True)
    target_role = models.CharField(max_length=30, blank=True, null=True)
    old_value = models.TextField(blank=True, null=True)
    new_value = models.TextField(blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    ip_address = models.CharField(max_length=45, blank=True, null=True)
    is_success = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'permission_audit_logs'


class PermissionGroupMembers(models.Model):
    group = models.ForeignKey('PermissionGroups', models.DO_NOTHING)
    permission = models.ForeignKey('Permissions', models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'permission_group_members'
        unique_together = (('group', 'permission'),)


class PermissionGroups(models.Model):
    group_code = models.CharField(unique=True, max_length=50)
    group_name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    group_type = models.CharField(max_length=30, blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    display_order = models.SmallIntegerField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'permission_groups'


class PermissionResources(models.Model):
    resource_code = models.CharField(unique=True, max_length=50)
    resource_name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    resource_type = models.CharField(max_length=30, blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)
    display_order = models.SmallIntegerField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'permission_resources'


class Permissions(models.Model):
    resource = models.ForeignKey(PermissionResources, models.DO_NOTHING)
    action = models.ForeignKey(PermissionActions, models.DO_NOTHING)
    permission_name = models.CharField(max_length=150, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'permissions'
        unique_together = (('resource', 'action'),)


class Positions(models.Model):
    title = models.CharField(max_length=100)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'positions'


class Provinces(models.Model):
    province_code = models.CharField(primary_key=True, max_length=8)
    name_kh = models.CharField(max_length=100, blank=True, null=True)
    name_en = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'provinces'


class ReportDaily(models.Model):
    report_date = models.DateField()
    title = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField()
    reported_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='reported_by', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'report_daily'
        unique_together = (('report_date', 'reported_by'),)


class ResourceAccessPolicies(models.Model):
    resource = models.ForeignKey(PermissionResources, models.DO_NOTHING)
    policy_name = models.CharField(max_length=150, blank=True, null=True)
    policy_type = models.CharField(max_length=30, blank=True, null=True)
    default_access = models.CharField(max_length=20, blank=True, null=True)
    require_approval = models.BooleanField(blank=True, null=True)
    approval_role = models.CharField(max_length=30, blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'resource_access_policies'


class RolePermissions(models.Model):
    role = models.CharField(max_length=30)
    permission = models.ForeignKey(Permissions, models.DO_NOTHING)
    granted_at = models.DateTimeField(blank=True, null=True)
    granted_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='granted_by', blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'role_permissions'
        unique_together = (('role', 'permission'),)


class ScheduleSubstitutions(models.Model):
    classroom = models.ForeignKey(Classrooms, models.DO_NOTHING)
    change_date = models.DateField()
    time_slot = models.ForeignKey('TimeSlots', models.DO_NOTHING)
    original_subject = models.ForeignKey('Subjects', models.DO_NOTHING)
    new_subject = models.ForeignKey('Subjects', models.DO_NOTHING, related_name='schedulesubstitutions_new_subject_set')
    new_teacher = models.ForeignKey('Teachers', models.DO_NOTHING, blank=True, null=True)
    reason = models.CharField(max_length=255, blank=True, null=True)
    created_by = models.ForeignKey('Teachers', models.DO_NOTHING, db_column='created_by', related_name='schedulesubstitutions_created_by_set', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'schedule_substitutions'


class SchoolCalendar(models.Model):
    title = models.CharField(max_length=150)
    event_type = models.CharField(max_length=30)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    classroom = models.ForeignKey(Classrooms, models.DO_NOTHING, blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)
    organizer = models.ForeignKey('Teachers', models.DO_NOTHING, blank=True, null=True)
    is_recurring = models.BooleanField(blank=True, null=True)
    recurring_type = models.CharField(max_length=20, blank=True, null=True)
    color_code = models.CharField(max_length=7, blank=True, null=True)
    notify_days = models.SmallIntegerField(blank=True, null=True)
    is_public = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'school_calendar'


class Scores(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING)
    subject = models.ForeignKey('Subjects', models.DO_NOTHING)
    period = models.ForeignKey(AcademicPeriods, models.DO_NOTHING)
    score_type = models.CharField(max_length=30)
    raw_score = models.DecimalField(max_digits=6, decimal_places=2)
    exam_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'scores'
        unique_together = (('student', 'subject', 'period', 'score_type'),)


class StaffPositions(models.Model):
    teacher = models.ForeignKey('Teachers', models.DO_NOTHING)
    position = models.ForeignKey(Positions, models.DO_NOTHING)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'staff_positions'


class StudentEducation(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING)
    level = models.CharField(max_length=100)
    institution = models.CharField(max_length=150, blank=True, null=True)
    start_year = models.SmallIntegerField(blank=True, null=True)
    end_year = models.SmallIntegerField(blank=True, null=True)
    note = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student_education'


class StudentPayYear(models.Model):
    student = models.ForeignKey('Students', models.DO_NOTHING)
    academic_year = models.ForeignKey(AcademicYears, models.DO_NOTHING)
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    balance = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    payment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20)
    note = models.TextField(blank=True, null=True)
    recorded_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='recorded_by', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'student_pay_year'
        unique_together = (('student', 'academic_year'),)


class Students(models.Model):
    student_code = models.CharField(unique=True, max_length=20)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    latin_name = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=10)
    monk_status = models.CharField(max_length=20)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    sanghatika_no = models.CharField(max_length=50, blank=True, null=True)
    chaya_name = models.CharField(max_length=100, blank=True, null=True)
    chaya_no = models.CharField(max_length=50, blank=True, null=True)
    ordination_date = models.DateField(blank=True, null=True)
    preceptor_name = models.CharField(max_length=150, blank=True, null=True)
    nationality = models.ForeignKey(Nationalities, models.DO_NOTHING, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    birth_village_code = models.ForeignKey('Villages', models.DO_NOTHING, db_column='birth_village_code', blank=True, null=True)
    education_level = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    current_pagoda = models.ForeignKey(Pagodas, models.DO_NOTHING, blank=True, null=True)
    birth_pagoda = models.ForeignKey(Pagodas, models.DO_NOTHING, related_name='students_birth_pagoda_set', blank=True, null=True)
    kuti = models.ForeignKey(Kutis, models.DO_NOTHING, blank=True, null=True)
    enrollment_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'students'


class Subjects(models.Model):
    subject_code = models.CharField(unique=True, max_length=20)
    subject_name = models.CharField(max_length=100)
    coefficient = models.SmallIntegerField()
    total_hours = models.IntegerField(blank=True, null=True)
    total_score = models.IntegerField(blank=True, null=True)
    total_homework = models.IntegerField(blank=True, null=True)
    total_time_exam = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'subjects'


class TeacherEducation(models.Model):
    teacher = models.ForeignKey('Teachers', models.DO_NOTHING)
    degree = models.CharField(max_length=100)
    field = models.CharField(max_length=100, blank=True, null=True)
    institution = models.CharField(max_length=150, blank=True, null=True)
    education_type = models.CharField(max_length=20, blank=True, null=True)
    start_year = models.SmallIntegerField(blank=True, null=True)
    end_year = models.SmallIntegerField(blank=True, null=True)
    is_completed = models.BooleanField(blank=True, null=True)
    note = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'teacher_education'


class TeacherSalaries(models.Model):
    teacher = models.ForeignKey('Teachers', models.DO_NOTHING)
    subject = models.ForeignKey(Subjects, models.DO_NOTHING)
    academic_year = models.ForeignKey(AcademicYears, models.DO_NOTHING, blank=True, null=True)
    period_label = models.CharField(max_length=50, blank=True, null=True)
    total_hours = models.DecimalField(max_digits=6, decimal_places=2)
    rate_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    calculated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'teacher_salaries'
        unique_together = (('teacher', 'subject', 'academic_year', 'period_label'),)


class Teachers(models.Model):
    teacher_code = models.CharField(unique=True, max_length=20)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    latin_name = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=10)
    monk_status = models.CharField(max_length=20)
    phone = models.CharField(max_length=20, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    status = models.CharField(max_length=20)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'teachers'


class TeachingSessions(models.Model):
    teacher = models.ForeignKey(Teachers, models.DO_NOTHING)
    subject = models.ForeignKey(Subjects, models.DO_NOTHING)
    classroom = models.ForeignKey(Classrooms, models.DO_NOTHING)
    session_date = models.DateField()
    time_slot = models.ForeignKey('TimeSlots', models.DO_NOTHING)
    is_substitute = models.BooleanField()
    substitution = models.ForeignKey(ScheduleSubstitutions, models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'teaching_sessions'
        unique_together = (('classroom', 'session_date', 'time_slot'),)


class TimeSlots(models.Model):
    session = models.CharField(max_length=10)
    slot_no = models.SmallIntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        managed = False
        db_table = 'time_slots'
        unique_together = (('session', 'slot_no'),)


class Timetable(models.Model):
    classroom = models.ForeignKey(Classrooms, models.DO_NOTHING)
    subject = models.ForeignKey(Subjects, models.DO_NOTHING)
    academic_year = models.ForeignKey(AcademicYears, models.DO_NOTHING, blank=True, null=True)
    day_no = models.SmallIntegerField()
    time_slot = models.ForeignKey(TimeSlots, models.DO_NOTHING)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'timetable'
        unique_together = (('classroom', 'academic_year', 'day_no', 'time_slot'),)


class UserPermissions(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING)
    permission = models.ForeignKey(Permissions, models.DO_NOTHING)
    grant_type = models.CharField(max_length=20, blank=True, null=True)
    reason = models.TextField(blank=True, null=True)
    granted_at = models.DateTimeField(blank=True, null=True)
    granted_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='granted_by', related_name='userpermissions_granted_by_set', blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_permissions'
        unique_together = (('user', 'permission'),)


class Users(models.Model):
    username = models.CharField(unique=True, max_length=50)
    password_hash = models.CharField(max_length=255)
    role = models.CharField(max_length=20)
    teacher = models.ForeignKey(Teachers, models.DO_NOTHING, blank=True, null=True)
    student = models.ForeignKey(Students, models.DO_NOTHING, blank=True, null=True)
    is_active = models.BooleanField()
    last_login = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'


class Villages(models.Model):
    village_code = models.CharField(primary_key=True, max_length=8)
    name_kh = models.CharField(max_length=100, blank=True, null=True)
    name_en = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'villages'


class YearbookEntries(models.Model):
    academic_year = models.ForeignKey(AcademicYears, models.DO_NOTHING)
    classroom = models.ForeignKey(Classrooms, models.DO_NOTHING, blank=True, null=True)
    entry_type = models.CharField(max_length=30)
    title = models.CharField(max_length=150)
    section_order = models.SmallIntegerField(blank=True, null=True)
    image_url = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    person = models.ForeignKey(Students, models.DO_NOTHING, blank=True, null=True)
    event_date = models.DateField(blank=True, null=True)
    uploaded_by = models.ForeignKey(Teachers, models.DO_NOTHING, db_column='uploaded_by', blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'yearbook_entries'
        unique_together = (('academic_year', 'classroom', 'person'),)
