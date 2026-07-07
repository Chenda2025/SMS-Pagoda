from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PermissionActionsViewSet, PermissionAuditLogsViewSet, PermissionGroupMembersViewSet, PermissionGroupsViewSet, PermissionResourcesViewSet, PermissionsViewSet, ResourceAccessPoliciesViewSet, RolePermissionsViewSet, UserPermissionsViewSet

router = DefaultRouter()
router.register(r'permission-actions', PermissionActionsViewSet, basename='permission-actions')
router.register(r'permission-audit-logs', PermissionAuditLogsViewSet, basename='permission-audit-logs')
router.register(r'permission-group-members', PermissionGroupMembersViewSet, basename='permission-group-members')
router.register(r'permission-groups', PermissionGroupsViewSet, basename='permission-groups')
router.register(r'permission-resources', PermissionResourcesViewSet, basename='permission-resources')
router.register(r'permissions', PermissionsViewSet, basename='permissions')
router.register(r'resource-access-policies', ResourceAccessPoliciesViewSet, basename='resource-access-policies')
router.register(r'role-permissions', RolePermissionsViewSet, basename='role-permissions')
router.register(r'user-permissions', UserPermissionsViewSet, basename='user-permissions')

urlpatterns = [
    path('', include(router.urls)),
]
