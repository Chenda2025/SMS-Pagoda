from rest_framework import serializers
from .models import PermissionActions, PermissionAuditLogs, PermissionGroupMembers, PermissionGroups, PermissionResources, Permissions, ResourceAccessPolicies, RolePermissions, UserPermissions

class PermissionActionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionActions
        fields = '__all__'

class PermissionAuditLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionAuditLogs
        fields = '__all__'

class PermissionGroupMembersSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionGroupMembers
        fields = '__all__'

class PermissionGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionGroups
        fields = '__all__'

class PermissionResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionResources
        fields = '__all__'

class PermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permissions
        fields = '__all__'

class ResourceAccessPoliciesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceAccessPolicies
        fields = '__all__'

class RolePermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermissions
        fields = '__all__'

class UserPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPermissions
        fields = '__all__'

