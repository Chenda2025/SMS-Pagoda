from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityLogsViewSet, PendingTeachersViewSet, PositionsViewSet, PublicTeacherApplyView, StaffPositionsViewSet, TeacherEducationViewSet, TeacherRegistrationSessionViewSet, TeacherSalariesViewSet, TeachersViewSet, UsersViewSet

router = DefaultRouter()
router.register(r'activity-logs', ActivityLogsViewSet, basename='activity-logs')
router.register(r'positions', PositionsViewSet, basename='positions')
router.register(r'staff-positions', StaffPositionsViewSet, basename='staff-positions')
router.register(r'teacher-education', TeacherEducationViewSet, basename='teacher-education')
router.register(r'teacher-salaries', TeacherSalariesViewSet, basename='teacher-salaries')
router.register(r'teachers', TeachersViewSet, basename='teachers')
router.register(r'pending-teachers', PendingTeachersViewSet, basename='pending-teachers')
router.register(r'teacher-registration-sessions', TeacherRegistrationSessionViewSet, basename='teacher-registration-sessions')
router.register(r'users', UsersViewSet, basename='users')

urlpatterns = [
    path('public-apply-teacher/', PublicTeacherApplyView.as_view(), name='public-apply-teacher'),
    path('', include(router.urls)),
]
