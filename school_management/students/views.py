import datetime
from django.utils import timezone
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.crypto import get_random_string
from django.db import transaction
from .models import (
    RegistrationSession, Students, PendingStudents, StudentEducation, Enrollments, 
    Awards, StudentPayYear, ClassMonitors, MonkPermission, MultiplePermission, DropoutStudent
)
from core.models import Pagodas, Kutis, Nationalities, EducationLevels
from .serializers import (
    RegistrationSessionSerializer, StudentsSerializer, PendingStudentsSerializer, StudentEducationSerializer,
    EnrollmentsSerializer, EnrollmentStudentSerializer, AwardsSerializer, StudentPayYearSerializer,
    ClassMonitorsSerializer, MonkPermissionSerializer, MultiplePermissionSerializer, DropoutStudentSerializer
)

class StudentsViewSet(viewsets.ModelViewSet):
    queryset = Students.objects.all()
    serializer_class = StudentsSerializer

    def perform_create(self, serializer):
        latest = Students.objects.order_by('-id').first()
        if latest:
            try:
                num = int(latest.student_code.replace('STU', '')) + 1
                new_code = f'STU{num:06d}'
            except ValueError:
                new_code = f'STU{latest.id + 1:06d}'
        else:
            new_code = 'STU000001'
        serializer.save(student_code=new_code, status='active')

    @action(detail=False, methods=['post'])
    def check_duplicate(self, request):
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        latin_name = request.data.get('latin_name', '').strip()
        phone = request.data.get('phone', '').strip()
        date_of_birth = request.data.get('date_of_birth')
        gender = request.data.get('gender')
        monk_status = request.data.get('monk_status')

        if not all([first_name, last_name, phone, date_of_birth, gender, monk_status]):
            return Response({"duplicate": False})
            
        filters = {
            'first_name': first_name,
            'last_name': last_name,
            'phone': phone,
            'date_of_birth': date_of_birth,
            'gender': gender,
            'monk_status': monk_status
        }
        if latin_name:
            filters['latin_name'] = latin_name

        exclude_id = request.data.get('exclude_id')
        students_qs = Students.objects.filter(**filters)
        if exclude_id:
            students_qs = students_qs.exclude(id=exclude_id)

        exists_in_students = students_qs.exists()
        exists_in_pending = PendingStudents.objects.filter(**filters).exists()

        if exists_in_students or exists_in_pending:
            return Response({"duplicate": True, "message": "ព័ត៌មានសិស្សនេះមានរួចហើយនៅក្នុងប្រព័ន្ធ!"})
        
        return Response({"duplicate": False})

class PendingStudentsViewSet(viewsets.ModelViewSet):
    queryset = PendingStudents.objects.all()
    serializer_class = PendingStudentsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        return queryset

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def approve(self, request, pk=None):
        pending = self.get_object()
        if pending.status == 'approved':
            return Response({'error': 'Already approved'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate student_code
        latest_student = Students.objects.order_by('-id').first()
        if latest_student:
            try:
                num = int(latest_student.student_code.replace('STU', '')) + 1
                new_code = f'STU{num:06d}'
            except:
                new_code = f'STU{latest_student.id + 1:06d}'
        else:
            new_code = 'STU000001'

        # Handle newly created dropdown items
        if pending.new_current_pagoda_name:
            new_pagoda, _ = Pagodas.objects.get_or_create(name=pending.new_current_pagoda_name.strip())
            pending.current_pagoda = new_pagoda
        if pending.new_birth_pagoda_name:
            new_birth_pagoda, _ = Pagodas.objects.get_or_create(name=pending.new_birth_pagoda_name.strip())
            pending.birth_pagoda = new_birth_pagoda
        if pending.new_kuti_name:
            new_kuti, _ = Kutis.objects.get_or_create(name=pending.new_kuti_name.strip())
            pending.kuti = new_kuti
        if pending.new_nationality_name:
            new_nat, _ = Nationalities.objects.get_or_create(name=pending.new_nationality_name.strip())
            pending.nationality = new_nat
        
        education_level_id = None
        if pending.education_level:
            try:
                edu_id = int(pending.education_level)
                education_level_id = edu_id
            except ValueError:
                new_edu, _ = EducationLevels.objects.get_or_create(name=pending.education_level.strip())
                education_level_id = new_edu.id

        # Create Student
        student = Students.objects.create(
            student_code=new_code,
            image_url=pending.image_url,
            first_name=pending.first_name,
            last_name=pending.last_name,
            latin_name=pending.latin_name,
            gender=pending.gender or 'ប្រុស',
            monk_status=pending.monk_status or 'គ្រហស្ថ',
            sanghatika_no=pending.sanghatika_no,
            chaya_name=pending.chaya_name,
            chaya_no=pending.chaya_no,
            ordination_date=pending.ordination_date,
            preceptor_name=pending.preceptor_name,
            nationality=pending.nationality,
            date_of_birth=pending.date_of_birth,
            birth_village_code=pending.birth_village_code,
            education_level_id=education_level_id,
            phone=pending.phone,
            current_pagoda=pending.current_pagoda,
            birth_pagoda=pending.birth_pagoda,
            kuti=pending.kuti,
            status='active'
        )

        pending.status = 'approved'
        pending.save()

        return Response({'status': 'approved', 'student_code': student.student_code})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        pending = self.get_object()
        if pending.status == 'approved':
            return Response({'error': 'Already approved'}, status=status.HTTP_400_BAD_REQUEST)

        reason = (request.data.get('reason') or '').strip()
        if not reason:
            return Response({'error': 'Rejection reason is required'}, status=status.HTTP_400_BAD_REQUEST)

        pending.delete()

        return Response({'status': 'rejected', 'reason': reason})


class StudentEducationViewSet(viewsets.ModelViewSet):
    queryset = StudentEducation.objects.all()
    serializer_class = StudentEducationSerializer

class EnrollmentsViewSet(viewsets.ModelViewSet):
    queryset = Enrollments.objects.all()
    serializer_class = EnrollmentsSerializer

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 200:
            enrollment = self.get_object()
            monitor_role = request.data.get('monitor_role')
            if monitor_role is not None:
                if monitor_role == '':
                    # Remove monitor role
                    ClassMonitors.objects.filter(
                        student_id=enrollment.student_id,
                        classroom_id=enrollment.classroom_id,
                        academic_year_id=enrollment.academic_year_id
                    ).delete()
                else:
                    # Update or create monitor role
                    cm, created = ClassMonitors.objects.update_or_create(
                        student_id=enrollment.student_id,
                        classroom_id=enrollment.classroom_id,
                        academic_year_id=enrollment.academic_year_id,
                        defaults={'role': monitor_role}
                    )
                    # Create or update user account for monitor
                    from users.models import Users
                    user = Users.objects.filter(student_id=enrollment.student_id).first()
                    if not user:
                        # create username based on student_code
                        base_code = enrollment.student.student_code.lower() if enrollment.student.student_code else str(enrollment.student_id)
                        username = f"monitor_{base_code}"
                        # In case username exists but without student_id
                        if Users.objects.filter(username=username).exists():
                            username = f"{username}_{enrollment.student_id}"
                        user = Users(
                            username=username,
                            student_id=enrollment.student_id,
                            role='monitor'
                        )
                        user.set_password('123456') # Default password for new monitors
                        user.save()
                    elif user.role != 'monitor':
                        user.role = 'monitor'
                        user.save()
        return response

    @action(detail=False, methods=['get'], url_path='students')
    def students(self, request):
        qs = Enrollments.objects.select_related('student', 'classroom', 'academic_year')
        ay = request.query_params.get('academic_year')
        cr = request.query_params.get('classroom')
        if ay:
            qs = qs.filter(academic_year_id=ay)
        if cr:
            qs = qs.filter(classroom_id=cr)
        serializer = EnrollmentStudentSerializer(qs, many=True)
        return Response(serializer.data)

class AwardsViewSet(viewsets.ModelViewSet):
    queryset = Awards.objects.all()
    serializer_class = AwardsSerializer

class StudentPayYearViewSet(viewsets.ModelViewSet):
    queryset = StudentPayYear.objects.all()
    serializer_class = StudentPayYearSerializer

class ClassMonitorsViewSet(viewsets.ModelViewSet):
    queryset = ClassMonitors.objects.all()
    serializer_class = ClassMonitorsSerializer

class MonkPermissionViewSet(viewsets.ModelViewSet):
    queryset = MonkPermission.objects.all()
    serializer_class = MonkPermissionSerializer

class MultiplePermissionViewSet(viewsets.ModelViewSet):
    queryset = MultiplePermission.objects.all()
    serializer_class = MultiplePermissionSerializer

class DropoutStudentViewSet(viewsets.ModelViewSet):
    queryset = DropoutStudent.objects.all()
    serializer_class = DropoutStudentSerializer


class PublicApplyView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):

        # Check active session
        today = datetime.date.today()
        active_session = RegistrationSession.objects.filter(is_active=True, end_date__gte=today, start_date__lte=today).first()
        if not active_session:
            return Response({'error': 'ការចុះឈ្មោះចូលរៀនត្រូវបានបិទ។ (The registration form is currently closed.)'}, status=status.HTTP_403_FORBIDDEN)

        tracking_code = request.query_params.get('tracking_code')
        phone = request.query_params.get('phone')
        if not tracking_code or not phone:
            return Response({'error': 'Missing tracking_code or phone'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            pending = PendingStudents.objects.get(tracking_code=tracking_code, phone=phone)
            serializer = PendingStudentsSerializer(pending)
            return Response(serializer.data)
        except PendingStudents.DoesNotExist:
            return Response({'error': 'Application not found. Please check your tracking code and phone number.'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):

        # Check active session
        today = datetime.date.today()
        active_session = RegistrationSession.objects.filter(is_active=True, end_date__gte=today, start_date__lte=today).first()
        if not active_session:
            return Response({'error': 'ការចុះឈ្មោះចូលរៀនត្រូវបានបិទ។ (The registration form is currently closed.)'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy() if hasattr(request.data, 'copy') else request.data
        tracking_code = data.get('tracking_code')
        phone = data.get('phone')

        if tracking_code:
            # Update existing
            try:
                pending = PendingStudents.objects.get(tracking_code=tracking_code, phone=phone)
                # Don't allow update if already approved
                if pending.status == 'approved':
                    return Response({'error': 'ពាក្យស្នើសុំនេះត្រូវបានសាលាពិនិត្យ និងអនុម័តរួចរាល់។'}, status=status.HTTP_400_BAD_REQUEST)
                
                serializer = PendingStudentsSerializer(pending, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except PendingStudents.DoesNotExist:
                return Response({'error': 'Invalid tracking code or phone.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Create new draft
            if phone:
                if Students.objects.filter(phone=phone).exists() or PendingStudents.objects.filter(phone=phone).exclude(status='rejected').exists():
                    return Response({'error': 'លេខទូរស័ព្ទនេះមានក្នុងប្រព័ន្ធរួចហើយ។ ប្រសិនបើលោកអ្នកធ្លាប់បានចុះឈ្មោះ សូមប្រើប្រាស់លេខកូដតាមដាន ៦ខ្ទង់ ដើម្បីបន្ត។'}, status=status.HTTP_400_BAD_REQUEST)

            code = get_random_string(6, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
            while PendingStudents.objects.filter(tracking_code=code).exists():
                code = get_random_string(6, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
            
            data['tracking_code'] = code
            data['status'] = 'draft'
            serializer = PendingStudentsSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationSessionViewSet(viewsets.ModelViewSet):
    queryset = RegistrationSession.objects.all().order_by('-created_at')
    serializer_class = RegistrationSessionSerializer

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def active(self, request):
        today = datetime.date.today()
        session = RegistrationSession.objects.filter(is_active=True, end_date__gte=today, start_date__lte=today).first()
        if session:
            return Response(RegistrationSessionSerializer(session).data)
        return Response({'message': 'No active session'}, status=status.HTTP_404_NOT_FOUND)
