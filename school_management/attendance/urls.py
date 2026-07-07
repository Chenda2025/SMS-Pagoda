from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, AttendanceWarningViewSet, NotificationsViewSet, ReportDailyViewSet

router = DefaultRouter()
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'attendance-warnings', AttendanceWarningViewSet, basename='attendance-warnings')
router.register(r'notifications', NotificationsViewSet, basename='notifications')
router.register(r'report-daily', ReportDailyViewSet, basename='report-daily')

urlpatterns = [
    path('', include(router.urls)),
]
