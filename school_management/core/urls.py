from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AcademicPeriodsViewSet, AcademicYearsViewSet, ClassroomsViewSet, ClassSubjectsViewSet, CommunesViewSet, DistrictsViewSet, DocumentsViewSet, EducationLevelsViewSet, KutisViewSet, NationalitiesViewSet, PagodasViewSet, PaperHeadersViewSet, PayRatesViewSet, PayrollRecordsViewSet, MonthlyPayrollsViewSet, ProvincesViewSet, ScheduleSubstitutionsViewSet, SchoolCalendarViewSet, SubjectsViewSet, TeachingSessionsViewSet, TimeSlotsViewSet, TimetableViewSet, VillagesViewSet, YearbookEntriesViewSet
from .rpc import RPCView
from .views import PayrollRatesViewSet

router = DefaultRouter()
router.register(r'academic-periods', AcademicPeriodsViewSet, basename='academic-periods')
router.register(r'academic-years', AcademicYearsViewSet, basename='academic-years')
router.register(r'classrooms', ClassroomsViewSet, basename='classrooms')    
router.register(r'class-subjects', ClassSubjectsViewSet, basename='class-subjects')
router.register(r'communes', CommunesViewSet, basename='communes')
router.register(r'districts', DistrictsViewSet, basename='districts')
router.register(r'documents', DocumentsViewSet, basename='documents')
router.register(r'education-levels', EducationLevelsViewSet, basename='education-levels')
router.register(r'kutis', KutisViewSet, basename='kutis')
router.register(r'nationalities', NationalitiesViewSet, basename='nationalities')
router.register(r'pagodas', PagodasViewSet, basename='pagodas')
router.register(r'paper-headers', PaperHeadersViewSet, basename='paper-headers')
router.register(r'pay-rates', PayRatesViewSet, basename='pay-rates')
router.register(r'payroll-records', PayrollRecordsViewSet, basename='payroll-records')
router.register(r'monthly-payrolls', MonthlyPayrollsViewSet, basename='monthly-payrolls')
router.register(r'payroll-rates', PayrollRatesViewSet, basename='payroll-rates')
router.register(r'provinces', ProvincesViewSet, basename='provinces')
router.register(r'schedule-substitutions', ScheduleSubstitutionsViewSet, basename='schedule-substitutions')
router.register(r'school-calendar', SchoolCalendarViewSet, basename='school-calendar')
router.register(r'subjects', SubjectsViewSet, basename='subjects')
router.register(r'teaching-sessions', TeachingSessionsViewSet, basename='teaching-sessions')
router.register(r'time-slots', TimeSlotsViewSet, basename='time-slots')
router.register(r'timetable', TimetableViewSet, basename='timetable')
router.register(r'villages', VillagesViewSet, basename='villages')
router.register(r'yearbook-entries', YearbookEntriesViewSet, basename='yearbook-entries')

from .monitor_views import monitor_summary, monitor_students, monitor_student_attendance

urlpatterns = [
    path('rpc/', RPCView.as_view(), name='rpc'),
    path('monitor/summary/', monitor_summary, name='monitor-summary'),
    path('monitor/students/', monitor_students, name='monitor-students'),
    path('monitor/student-attendance/', monitor_student_attendance, name='monitor-student-attendance'),
    path('', include(router.urls)),
]
