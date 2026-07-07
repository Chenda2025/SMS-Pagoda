from django.db import models

class PermissionActions(models.Model):
    action_code = models.CharField(unique=True, max_length=50, verbose_name='កូដសកម្មភាព')
    action_name = models.CharField(max_length=100, verbose_name='ឈ្មោះសកម្មភាព')
    description = models.TextField(blank=True, null=True, verbose_name='ការពិពណ៌នា')
    action_level = models.SmallIntegerField(blank=True, null=True, verbose_name='កម្រិតសកម្មភាព')
    is_active = models.BooleanField(blank=True, null=True, verbose_name='កំពុងប្រើប្រាស់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'permission_actions'
        verbose_name = 'សកម្មភាពសិទ្ធិ'
        verbose_name_plural = 'សកម្មភាពសិទ្ធិ'

    def __str__(self):
        return self.action_name


class PermissionAuditLogs(models.Model):
    user = models.ForeignKey('users.Users', models.DO_NOTHING, verbose_name='អ្នកប្រើប្រាស់')
    action_type = models.CharField(max_length=30, verbose_name='ប្រភេទសកម្មភាព')
    resource = models.ForeignKey('permissions.PermissionResources', models.DO_NOTHING, blank=True, null=True, verbose_name='ធនធាន')
    action = models.ForeignKey('permissions.PermissionActions', models.DO_NOTHING, blank=True, null=True, verbose_name='សកម្មភាព')
    permission = models.ForeignKey('permissions.Permissions', models.DO_NOTHING, blank=True, null=True, verbose_name='សិទ្ធិ')
    target_user = models.ForeignKey('users.Users', models.DO_NOTHING, related_name='permissionauditlogs_target_user_set', blank=True, null=True, verbose_name='អ្នកប្រើប្រាស់ត្រូវប៉ះពាល់')
    target_role = models.CharField(max_length=30, blank=True, null=True, verbose_name='តួនាទីត្រូវប៉ះពាល់')
    old_value = models.TextField(blank=True, null=True, verbose_name='តម្លៃចាស់')
    new_value = models.TextField(blank=True, null=True, verbose_name='តម្លៃថ្មី')
    reason = models.TextField(blank=True, null=True, verbose_name='មូលហេតុ')
    ip_address = models.CharField(max_length=45, blank=True, null=True, verbose_name='អាសយដ្ឋាន IP')
    is_success = models.BooleanField(blank=True, null=True, verbose_name='ជោគជ័យ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'permission_audit_logs'
        verbose_name = 'កំណត់ហេតុត្រួតពិនិត្យសិទ្ធិ'
        verbose_name_plural = 'កំណត់ហេតុត្រួតពិនិត្យសិទ្ធិ'

    def __str__(self):
        return f'{self.user} - {self.action_type}'


class PermissionGroupMembers(models.Model):
    group = models.ForeignKey('permissions.PermissionGroups', models.DO_NOTHING, verbose_name='ក្រុមសិទ្ធិ')
    permission = models.ForeignKey('permissions.Permissions', models.DO_NOTHING, verbose_name='សិទ្ធិ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'permission_group_members'
        unique_together = (('group', 'permission'),)
        verbose_name = 'សមាជិកក្រុមសិទ្ធិ'
        verbose_name_plural = 'សមាជិកក្រុមសិទ្ធិ'

    def __str__(self):
        return f'{self.group} - {self.permission}'


class PermissionGroups(models.Model):
    group_code = models.CharField(unique=True, max_length=50, verbose_name='កូដក្រុម')
    group_name = models.CharField(max_length=150, verbose_name='ឈ្មោះក្រុម')
    description = models.TextField(blank=True, null=True, verbose_name='ការពិពណ៌នា')
    group_type = models.CharField(max_length=30, blank=True, null=True, verbose_name='ប្រភេទក្រុម')
    icon = models.CharField(max_length=50, blank=True, null=True, verbose_name='រូបតំណាង')
    display_order = models.SmallIntegerField(blank=True, null=True, verbose_name='លំដាប់បង្ហាញ')
    is_active = models.BooleanField(blank=True, null=True, verbose_name='កំពុងប្រើប្រាស់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'permission_groups'
        verbose_name = 'ក្រុមសិទ្ធិ'
        verbose_name_plural = 'ក្រុមសិទ្ធិ'

    def __str__(self):
        return self.group_name


class PermissionResources(models.Model):
    resource_code = models.CharField(unique=True, max_length=50, verbose_name='កូដធនធាន')
    resource_name = models.CharField(max_length=150, verbose_name='ឈ្មោះធនធាន')
    description = models.TextField(blank=True, null=True, verbose_name='ការពិពណ៌នា')
    resource_type = models.CharField(max_length=30, blank=True, null=True, verbose_name='ប្រភេទធនធាន')
    icon = models.CharField(max_length=50, blank=True, null=True, verbose_name='រូបតំណាង')
    display_order = models.SmallIntegerField(blank=True, null=True, verbose_name='លំដាប់បង្ហាញ')
    is_active = models.BooleanField(blank=True, null=True, verbose_name='កំពុងប្រើប្រាស់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'permission_resources'
        verbose_name = 'ធនធានសិទ្ធិ'
        verbose_name_plural = 'ធនធានសិទ្ធិ'

    def __str__(self):
        return self.resource_name


class Permissions(models.Model):
    resource = models.ForeignKey('permissions.PermissionResources', models.DO_NOTHING, verbose_name='ធនធាន')
    action = models.ForeignKey('permissions.PermissionActions', models.DO_NOTHING, verbose_name='សកម្មភាព')
    permission_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='ឈ្មោះសិទ្ធិ')
    description = models.TextField(blank=True, null=True, verbose_name='ការពិពណ៌នា')
    is_active = models.BooleanField(blank=True, null=True, verbose_name='កំពុងប្រើប្រាស់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'permissions'
        unique_together = (('resource', 'action'),)
        verbose_name = 'សិទ្ធិ'
        verbose_name_plural = 'សិទ្ធិ'

    def __str__(self):
        return self.permission_name or f'{self.resource} - {self.action}'


class ResourceAccessPolicies(models.Model):
    resource = models.ForeignKey('permissions.PermissionResources', models.DO_NOTHING, verbose_name='ធនធាន')
    policy_name = models.CharField(max_length=150, blank=True, null=True, verbose_name='ឈ្មោះគោលការណ៍')
    policy_type = models.CharField(max_length=30, blank=True, null=True, verbose_name='ប្រភេទគោលការណ៍')
    default_access = models.CharField(max_length=20, blank=True, null=True, verbose_name='ការចូលប្រើលំនាំដើម')
    require_approval = models.BooleanField(blank=True, null=True, verbose_name='ត្រូវការការអនុម័ត')
    approval_role = models.CharField(max_length=30, blank=True, null=True, verbose_name='តួនាទីអនុម័ត')
    is_active = models.BooleanField(blank=True, null=True, verbose_name='កំពុងប្រើប្រាស់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'resource_access_policies'
        verbose_name = 'គោលការណ៍ចូលប្រើធនធាន'
        verbose_name_plural = 'គោលការណ៍ចូលប្រើធនធាន'

    def __str__(self):
        return self.policy_name or f'{self.resource}'


class RolePermissions(models.Model):
    role = models.CharField(max_length=30, verbose_name='តួនាទី')
    permission = models.ForeignKey('permissions.Permissions', models.DO_NOTHING, verbose_name='សិទ្ធិ')
    granted_at = models.DateTimeField(blank=True, null=True, verbose_name='ពេលផ្តល់សិទ្ធិ')
    granted_by = models.ForeignKey('users.Users', models.DO_NOTHING, db_column='granted_by', blank=True, null=True, verbose_name='អ្នកផ្តល់សិទ្ធិ')
    notes = models.TextField(blank=True, null=True, verbose_name='កំណត់ចំណាំ')
    is_active = models.BooleanField(blank=True, null=True, verbose_name='កំពុងប្រើប្រាស់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'role_permissions'
        unique_together = (('role', 'permission'),)
        verbose_name = 'សិទ្ធិតាមតួនាទី'
        verbose_name_plural = 'សិទ្ធិតាមតួនាទី'

    def __str__(self):
        return f'{self.role} - {self.permission}'


class UserPermissions(models.Model):
    user = models.ForeignKey('users.Users', models.DO_NOTHING, verbose_name='អ្នកប្រើប្រាស់')
    permission = models.ForeignKey('permissions.Permissions', models.DO_NOTHING, verbose_name='សិទ្ធិ')
    grant_type = models.CharField(max_length=20, blank=True, null=True, verbose_name='ប្រភេទផ្តល់សិទ្ធិ')
    reason = models.TextField(blank=True, null=True, verbose_name='មូលហេតុ')
    granted_at = models.DateTimeField(blank=True, null=True, verbose_name='ពេលផ្តល់សិទ្ធិ')
    granted_by = models.ForeignKey('users.Users', models.DO_NOTHING, db_column='granted_by', related_name='userpermissions_granted_by_set', blank=True, null=True, verbose_name='អ្នកផ្តល់សិទ្ធិ')
    expiry_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃផុតកំណត់')
    is_active = models.BooleanField(blank=True, null=True, verbose_name='កំពុងប្រើប្រាស់')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')
    updated_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទកែប្រែ')

    class Meta:
        managed = True
        db_table = 'user_permissions'
        unique_together = (('user', 'permission'),)
        verbose_name = 'សិទ្ធិអ្នកប្រើប្រាស់'
        verbose_name_plural = 'សិទ្ធិអ្នកប្រើប្រាស់'

    def __str__(self):
        return f'{self.user} - {self.permission}'

