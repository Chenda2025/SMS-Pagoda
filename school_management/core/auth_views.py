from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from users.models import Users
from students.models import ClassMonitors, Enrollments


def _build_monitor_info(user, request):
    if user.role != 'monitor' or not user.student_id:
        return None

    student = user.student
    student_name = f"{student.last_name or ''} {student.first_name or ''}".strip() or 'មិនមានឈ្មោះ' if student else 'មិនមានឈ្មោះ'
    
    # image_url is an ImageField, we can just cast it to string to get relative path if it exists
    student_image = None
    if student and student.image_url and hasattr(student.image_url, 'url'):
        try:
            student_image = student.image_url.url
        except ValueError:
            pass
    elif student and student.image_url:
        student_image = str(student.image_url)
        if student_image and not student_image.startswith('/'):
            student_image = '/media/' + student_image

    if student_image:
        student_image = request.build_absolute_uri(student_image)

    cm = (ClassMonitors.objects
          .filter(student_id=user.student_id, academic_year__is_current=True)
          .select_related('classroom', 'academic_year')
          .first()) or (ClassMonitors.objects
          .filter(student_id=user.student_id)
          .select_related('classroom', 'academic_year')
          .order_by('-academic_year__start_date')
          .first())
    if cm:
        return {
            'student_id': cm.student_id,
            'student_name': student_name,
            'student_image': student_image,
            'classroom_id': cm.classroom_id,
            'classroom_name': cm.classroom.class_name,
            'academic_year_id': cm.academic_year_id,
            'academic_year_name': cm.academic_year.year_name,
            'role': cm.role,
        }

    # Not (yet) recorded as an official class monitor -- fall back to their
    # current enrollment so the account can still open the attendance page.
    enrollment = (Enrollments.objects
                  .filter(student_id=user.student_id, academic_year__is_current=True)
                  .select_related('classroom', 'academic_year')
                  .first())
    if enrollment:
        return {
            'student_id': user.student_id,
            'student_name': student_name,
            'student_image': student_image,
            'classroom_id': enrollment.classroom_id,
            'classroom_name': enrollment.classroom.class_name,
            'academic_year_id': enrollment.academic_year_id,
            'academic_year_name': enrollment.academic_year.year_name,
            'role': None,
        }
    return None


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = Users.objects.get(username=username, is_active=True)
        except Users.DoesNotExist:
            return Response({'error': 'Invalid username or password.'}, status=401)

        if not user.check_password(password):
            return Response({'error': 'Invalid username or password.'}, status=401)

        token, _ = Token.objects.get_or_create(user=user)
        response_user = {
            'id': user.id,
            'username': user.username,
            'role': user.role,
            'teacher_id': user.teacher_id,
            'student_id': user.student_id,
        }
        monitor_info = _build_monitor_info(user, request)
        if monitor_info:
            response_user['monitorInfo'] = monitor_info

        return Response({
            'token': token.key,
            'user': response_user,
        })
