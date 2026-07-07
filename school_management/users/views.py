import datetime
from django.utils import timezone
from django.utils.crypto import get_random_string
from rest_framework import status, views, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import ActivityLogs, PendingTeachers, Positions, StaffPositions, TeacherEducation, TeacherRegistrationSession, TeacherSalaries, Teachers, Users
from .serializers import ActivityLogsSerializer, PendingTeachersSerializer, PositionsSerializer, StaffPositionsSerializer, TeacherEducationSerializer, TeacherRegistrationSessionSerializer, TeacherSalariesSerializer, TeachersSerializer, UsersSerializer

class ActivityLogsViewSet(viewsets.ModelViewSet):
    queryset = ActivityLogs.objects.all()
    serializer_class = ActivityLogsSerializer

class PositionsViewSet(viewsets.ModelViewSet):
    queryset = Positions.objects.all()
    serializer_class = PositionsSerializer

class StaffPositionsViewSet(viewsets.ModelViewSet):
    queryset = StaffPositions.objects.all()
    serializer_class = StaffPositionsSerializer

class TeacherEducationViewSet(viewsets.ModelViewSet):
    queryset = TeacherEducation.objects.all()
    serializer_class = TeacherEducationSerializer

class TeacherSalariesViewSet(viewsets.ModelViewSet):
    queryset = TeacherSalaries.objects.all()
    serializer_class = TeacherSalariesSerializer

class TeachersViewSet(viewsets.ModelViewSet):
    queryset = Teachers.objects.all()
    serializer_class = TeachersSerializer

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


class PendingTeachersViewSet(viewsets.ModelViewSet):
    queryset = PendingTeachers.objects.all()
    serializer_class = PendingTeachersSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        pending = self.get_object()
        if pending.status == 'approved':
            return Response({'error': 'Already approved'}, status=status.HTTP_400_BAD_REQUEST)

        teacher = Teachers.objects.create(
            image_url=pending.image_url,
            first_name=pending.first_name,
            last_name=pending.last_name,
            latin_name=pending.latin_name,
            gender=pending.gender or 'ប្រុស',
            monk_status=pending.monk_status or 'គ្រហស្ថ',
            phone=pending.phone,
            start_date=pending.start_date,
            status='active',
        )

        pending.status = 'approved'
        pending.reviewed_by = request.user if request.user.is_authenticated else None
        pending.reviewed_at = timezone.now()
        pending.save()

        return Response({'status': 'approved', 'teacher_code': teacher.teacher_code})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        pending = self.get_object()
        if pending.status == 'approved':
            return Response({'error': 'Already approved'}, status=status.HTTP_400_BAD_REQUEST)

        reason = (request.data.get('reason') or '').strip()
        if not reason:
            return Response({'error': 'Rejection reason is required'}, status=status.HTTP_400_BAD_REQUEST)

        pending.status = 'rejected'
        pending.note = reason
        pending.reviewed_by = request.user if request.user.is_authenticated else None
        pending.reviewed_at = timezone.now()
        pending.save()

        return Response({'status': 'rejected', 'reason': reason})


class TeacherRegistrationSessionViewSet(viewsets.ModelViewSet):
    queryset = TeacherRegistrationSession.objects.all().order_by('-created_at')
    serializer_class = TeacherRegistrationSessionSerializer

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def active(self, request):
        today = datetime.date.today()
        session = TeacherRegistrationSession.objects.filter(is_active=True, end_date__gte=today, start_date__lte=today).first()
        if session:
            return Response(TeacherRegistrationSessionSerializer(session).data)
        return Response({'message': 'No active session'}, status=status.HTTP_404_NOT_FOUND)


class PublicTeacherApplyView(views.APIView):
    authentication_classes = []
    permission_classes = []

    def _active_session(self):
        today = datetime.date.today()
        return TeacherRegistrationSession.objects.filter(is_active=True, end_date__gte=today, start_date__lte=today).first()

    def get(self, request):
        if not self._active_session():
            return Response({'error': 'ការដាក់ពាក្យសុំធ្វើគ្រូបង្រៀនត្រូវបានបិទ។ (The application link is currently closed.)'}, status=status.HTTP_403_FORBIDDEN)

        tracking_code = request.query_params.get('tracking_code')
        phone = request.query_params.get('phone')
        if not tracking_code or not phone:
            return Response({'error': 'Missing tracking_code or phone'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            pending = PendingTeachers.objects.get(tracking_code=tracking_code, phone=phone)
            return Response(PendingTeachersSerializer(pending).data)
        except PendingTeachers.DoesNotExist:
            return Response({'error': 'Application not found. Please check your tracking code and phone number.'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        if not self._active_session():
            return Response({'error': 'ការដាក់ពាក្យសុំធ្វើគ្រូបង្រៀនត្រូវបានបិទ។ (The application link is currently closed.)'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy() if hasattr(request.data, 'copy') else request.data
        tracking_code = data.get('tracking_code')
        phone = data.get('phone')

        if tracking_code:
            try:
                pending = PendingTeachers.objects.get(tracking_code=tracking_code, phone=phone)
                if pending.status == 'approved':
                    return Response({'error': 'ពាក្យស្នើសុំនេះត្រូវបានសាលាពិនិត្យ និងអនុម័តរួចរាល់។'}, status=status.HTTP_400_BAD_REQUEST)

                serializer = PendingTeachersSerializer(pending, data=data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except PendingTeachers.DoesNotExist:
                return Response({'error': 'Invalid tracking code or phone.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            if phone:
                if Teachers.objects.filter(phone=phone).exists() or PendingTeachers.objects.filter(phone=phone).exclude(status='rejected').exists():
                    return Response({'error': 'លេខទូរស័ព្ទនេះមានក្នុងប្រព័ន្ធរួចហើយ។ ប្រសិនបើលោកអ្នកធ្លាប់បានដាក់ពាក្យ សូមប្រើប្រាស់លេខកូដតាមដាន ៦ខ្ទង់ ដើម្បីបន្ត។'}, status=status.HTTP_400_BAD_REQUEST)

            code = get_random_string(6, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
            while PendingTeachers.objects.filter(tracking_code=code).exists():
                code = get_random_string(6, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')

            data['tracking_code'] = code
            data['status'] = 'draft'
            serializer = PendingTeachersSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

