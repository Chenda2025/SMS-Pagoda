import datetime
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from students.models import Enrollments, MultiplePermission
from attendance.models import Attendance

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monitor_summary(request):
    classroom_id = request.query_params.get('classroom_id')
    if not classroom_id:
        return Response({'error': 'classroom_id required'}, status=status.HTTP_400_BAD_REQUEST)

    today = datetime.date.today()
    student_ids = list(Enrollments.objects.filter(
        classroom_id=classroom_id, academic_year__is_current=True
    ).values_list('student_id', flat=True))
    students_count = len(student_ids)

    # A student with no attendance row for a day is considered present --
    # only exceptions (absent/permission/late) get rows, matching the
    # convention the attendance and student-list pages already use. Counting
    # explicit status='present' rows (as before) always undercounts since
    # those rows are essentially never created.
    absent_today = Attendance.objects.filter(
        student_id__in=student_ids, attendance_date=today, status='absent'
    ).values('student_id').distinct().count()
    attendance_rate = round((students_count - absent_today) / students_count * 100) if students_count > 0 else None

    # Multi-day leave requests (the monitor's "សុំច្បាប់" feature) are stored
    # in MultiplePermission, not as Attendance rows, so leave count must be
    # read from there rather than Attendance status='permission'.
    on_leave = MultiplePermission.objects.filter(
        student_id__in=student_ids, start_date__lte=today, end_date__gte=today
    ).values('student_id').distinct().count()

    return Response({
        'total_students': students_count,
        'on_leave_today': on_leave,
        'attendance_rate': attendance_rate
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monitor_students(request):
    classroom_id = request.query_params.get('classroom_id')
    if not classroom_id:
        return Response({'error': 'classroom_id required'}, status=status.HTTP_400_BAD_REQUEST)

    enrollments = Enrollments.objects.filter(classroom_id=classroom_id, academic_year__is_current=True).select_related('student', 'classroom')
    students_data = []
    classroom_name = ''

    for en in enrollments:
        if not classroom_name:
            classroom_name = en.classroom.class_name
        
        # Calculate summary of attendance for this student
        atts = Attendance.objects.filter(student_id=en.student_id, classroom_id=classroom_id)
        present = atts.filter(status='present').count()
        absent = atts.filter(status='absent').count()
        permission = atts.filter(status='permission').count()
        late = atts.filter(status='late').count()

        students_data.append({
            'id': en.student_id,
            'name': f"{en.student.last_name or ''} {en.student.first_name or ''}".strip(),
            'dob': en.student.date_of_birth,
            'pagoda': en.student.current_pagoda.name if en.student.current_pagoda else '',
            'kodi': en.student.kuti.kuti_name if en.student.kuti else '',
            'present': present,
            'absent': absent,
            'permission': permission,
            'late': late
        })

    return Response({
        'students': students_data,
        'classroom_name': classroom_name
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def monitor_student_attendance(request):
    classroom_id = request.query_params.get('classroom_id')
    student_id = request.query_params.get('student_id')
    if not classroom_id or not student_id:
        return Response({'error': 'classroom_id and student_id required'}, status=status.HTTP_400_BAD_REQUEST)

    atts = Attendance.objects.filter(student_id=student_id, classroom_id=classroom_id).order_by('-attendance_date')
    data = []
    for att in atts:
        # Note: model does not have 'note' by default, maybe it's missing or we can ignore it
        data.append({
            'attendance_date': att.attendance_date,
            'status': att.status,
            'note': getattr(att, 'note', ''),
            'subject_name': getattr(att.subject, 'subject_name', '') if hasattr(att, 'subject') else ''
        })

    return Response(data)
