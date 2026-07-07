from rest_framework import viewsets
from .models import PermissionActions, PermissionAuditLogs, PermissionGroupMembers, PermissionGroups, PermissionResources, Permissions, ResourceAccessPolicies, RolePermissions, UserPermissions
from .serializers import PermissionActionsSerializer, PermissionAuditLogsSerializer, PermissionGroupMembersSerializer, PermissionGroupsSerializer, PermissionResourcesSerializer, PermissionsSerializer, ResourceAccessPoliciesSerializer, RolePermissionsSerializer, UserPermissionsSerializer

class PermissionActionsViewSet(viewsets.ModelViewSet):
    queryset = PermissionActions.objects.all()
    serializer_class = PermissionActionsSerializer

class PermissionAuditLogsViewSet(viewsets.ModelViewSet):
    queryset = PermissionAuditLogs.objects.all()
    serializer_class = PermissionAuditLogsSerializer

class PermissionGroupMembersViewSet(viewsets.ModelViewSet):
    queryset = PermissionGroupMembers.objects.all()
    serializer_class = PermissionGroupMembersSerializer

class PermissionGroupsViewSet(viewsets.ModelViewSet):
    queryset = PermissionGroups.objects.all()
    serializer_class = PermissionGroupsSerializer

class PermissionResourcesViewSet(viewsets.ModelViewSet):
    queryset = PermissionResources.objects.all()
    serializer_class = PermissionResourcesSerializer

class PermissionsViewSet(viewsets.ModelViewSet):
    queryset = Permissions.objects.all()
    serializer_class = PermissionsSerializer

class ResourceAccessPoliciesViewSet(viewsets.ModelViewSet):
    queryset = ResourceAccessPolicies.objects.all()
    serializer_class = ResourceAccessPoliciesSerializer

class RolePermissionsViewSet(viewsets.ModelViewSet):
    queryset = RolePermissions.objects.all()
    serializer_class = RolePermissionsSerializer

class UserPermissionsViewSet(viewsets.ModelViewSet):
    queryset = UserPermissions.objects.all()
    serializer_class = UserPermissionsSerializer

