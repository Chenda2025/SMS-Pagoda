from rest_framework import serializers
from .models import Attendance, AttendanceWarning, Notifications, ReportDaily
from students.models import Enrollments

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'

class AttendanceWarningSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    classroom_name = serializers.SerializerMethodField()
    pagoda_name = serializers.SerializerMethodField()
    kuti_name = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceWarning
        fields = '__all__'

    def get_student_name(self, obj):
        return f'{obj.student.last_name or ""} {obj.student.first_name or ""}'.strip() or '---'

    def get_classroom_name(self, obj):
        enrollment = (Enrollments.objects
                      .filter(student=obj.student, academic_year=obj.academic_year)
                      .select_related('classroom').first())
        return enrollment.classroom.class_name if enrollment and enrollment.classroom else '---'

    def get_pagoda_name(self, obj):
        return obj.student.current_pagoda.name if obj.student.current_pagoda else '---'

    def get_kuti_name(self, obj):
        return obj.student.kuti.kuti_name if obj.student.kuti else '---'

class NotificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notifications
        fields = '__all__'

class ReportDailySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportDaily
        fields = '__all__'

