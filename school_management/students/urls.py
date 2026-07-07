from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentsViewSet, PendingStudentsViewSet, StudentEducationViewSet,
    EnrollmentsViewSet, AwardsViewSet, StudentPayYearViewSet,
    ClassMonitorsViewSet, MonkPermissionViewSet, PublicApplyView, RegistrationSessionViewSet,
    MultiplePermissionViewSet, DropoutStudentViewSet
)

router = DefaultRouter()
router.register(r'list', StudentsViewSet, basename='students')
router.register(r'pending', PendingStudentsViewSet, basename='pending-students')
router.register(r'education', StudentEducationViewSet, basename='student-education')
router.register(r'enrollments', EnrollmentsViewSet, basename='enrollments')
router.register(r'awards', AwardsViewSet, basename='awards')
router.register(r'payments', StudentPayYearViewSet, basename='student-payments')
router.register(r'monitors', ClassMonitorsViewSet, basename='class-monitors')
router.register(r'monk-permissions', MonkPermissionViewSet, basename='monk-permissions')
router.register(r'registration-sessions', RegistrationSessionViewSet, basename='registration-sessions')
router.register(r'multiple-permissions', MultiplePermissionViewSet, basename='multiple-permissions')
router.register(r'dropouts', DropoutStudentViewSet, basename='dropouts')

urlpatterns = [
    path('public-apply/', PublicApplyView.as_view(), name='public-apply'),
    path('', include(router.urls)),
]
