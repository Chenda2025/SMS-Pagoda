from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Attendance, AttendanceWarning, Notifications, ReportDaily
from .serializers import AttendanceSerializer, AttendanceWarningSerializer, NotificationsSerializer, ReportDailySerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

    @action(detail=False, methods=['get'], url_path='report-data')
    def report_data(self, request):
        attendances = Attendance.objects.select_related('subject').all()
        data = {}
        for att in attendances:
            sid = str(att.student_id)
            if sid not in data:
                data[sid] = {
                    'absentDates': [],
                    'permissionDates': [],
                    'lateDates': [],
                    'bySubject': {}
                }
            
            date_str = att.attendance_date.strftime('%Y-%m-%d')
            status = att.status.lower()
            
            list_name = None
            if 'absent' in status:
                list_name = 'absentDates'
            elif 'permission' in status:
                list_name = 'permissionDates'
            elif 'late' in status:
                list_name = 'lateDates'
                
            if list_name:
                # Add to overall
                if date_str not in data[sid][list_name]:
                    data[sid][list_name].append(date_str)
                
                # Add to subject
                if att.subject:
                    subj_name = att.subject.subject_name
                    if subj_name not in data[sid]['bySubject']:
                        data[sid]['bySubject'][subj_name] = {'absentDates': [], 'permissionDates': [], 'lateDates': []}
                    if date_str not in data[sid]['bySubject'][subj_name][list_name]:
                        data[sid]['bySubject'][subj_name][list_name].append(date_str)
                        
        return Response(data)


class AttendanceWarningViewSet(viewsets.ModelViewSet):
    queryset = AttendanceWarning.objects.all()
    serializer_class = AttendanceWarningSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        academic_year = self.request.query_params.get('academic_year')
        if academic_year:
            qs = qs.filter(academic_year_id=academic_year)
        return qs

    # Frontend only ever knows "this student/year's warning levels should now
    # be X/Y/Z" -- get-or-create-then-update in one call instead of making it
    # do a GET first to discover whether a row already exists.
    @action(detail=False, methods=['post'], url_path='upsert')
    def upsert(self, request):
        student_id = request.data.get('student')
        academic_year_id = request.data.get('academic_year')
        obj, _ = AttendanceWarning.objects.get_or_create(student_id=student_id, academic_year_id=academic_year_id)
        for field in ('last_absent_warned', 'last_permission_warned', 'last_late_warned'):
            if field in request.data:
                setattr(obj, field, request.data[field])
        obj.save()
        return Response(AttendanceWarningSerializer(obj).data)


class NotificationsViewSet(viewsets.ModelViewSet):
    queryset = Notifications.objects.all()
    serializer_class = NotificationsSerializer

class ReportDailyViewSet(viewsets.ModelViewSet):
    queryset = ReportDaily.objects.all()
    serializer_class = ReportDailySerializer

