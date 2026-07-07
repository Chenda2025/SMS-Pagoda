from rest_framework import serializers
from .models import (
    RegistrationSession, Students, PendingStudents, StudentEducation, Enrollments, 
    Awards, StudentPayYear, ClassMonitors, MonkPermission, MonkPermissionLogs,
    MultiplePermission, DropoutStudent
)

class StudentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Students
        fields = '__all__'
        extra_kwargs = {
            'student_code': {'required': False},
            'status': {'required': False},
        }

class PendingStudentsSerializer(serializers.ModelSerializer):
    nationality_name = serializers.SerializerMethodField()
    current_pagoda_name = serializers.SerializerMethodField()
    birth_pagoda_name = serializers.SerializerMethodField()
    kuti_name = serializers.SerializerMethodField()
    birth_village_name = serializers.SerializerMethodField()
    birth_commune_name = serializers.SerializerMethodField()
    birth_district_name = serializers.SerializerMethodField()
    birth_province_name = serializers.SerializerMethodField()

    class Meta:
        model = PendingStudents
        fields = '__all__'

    def get_nationality_name(self, obj):
        return obj.new_nationality_name or (obj.nationality.name if obj.nationality_id else None)

    def get_current_pagoda_name(self, obj):
        return obj.new_current_pagoda_name or (obj.current_pagoda.name if obj.current_pagoda_id else None)

    def get_birth_pagoda_name(self, obj):
        return obj.new_birth_pagoda_name or (obj.birth_pagoda.name if obj.birth_pagoda_id else None)

    def get_kuti_name(self, obj):
        return obj.new_kuti_name or (obj.kuti.kuti_name if obj.kuti_id else None)

    def get_birth_village_name(self, obj):
        village = obj.birth_village_code
        return (village.name_kh or village.name_en) if village else None

    def get_birth_commune_name(self, obj):
        commune = obj.birth_village_code.commune if obj.birth_village_code_id else None
        return (commune.name_kh or commune.name_en) if commune else None

    def get_birth_district_name(self, obj):
        district = obj.birth_village_code.commune.district if obj.birth_village_code_id else None
        return (district.name_kh or district.name_en) if district else None

    def get_birth_province_name(self, obj):
        province = obj.birth_village_code.commune.district.province if obj.birth_village_code_id else None
        return (province.name_kh or province.name_en) if province else None

class EnrollmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollments
        fields = '__all__'

class EnrollmentStudentSerializer(serializers.ModelSerializer):
    student_id = serializers.IntegerField(source='student.id')
    student_code = serializers.CharField(source='student.student_code')
    student_name = serializers.SerializerMethodField()
    gender = serializers.CharField(source='student.gender')
    date_of_birth = serializers.DateField(source='student.date_of_birth')
    image_url = serializers.CharField(source='student.image_url', allow_null=True)
    classroom_id = serializers.IntegerField(source='classroom.id')
    classroom_name = serializers.CharField(source='classroom.class_name')
    academic_year_id = serializers.IntegerField(source='academic_year.id')
    academic_year_name = serializers.CharField(source='academic_year.year_name')
    monitor_role = serializers.SerializerMethodField()

    class Meta:
        model = Enrollments
        fields = ['id', 'student_id', 'student_code', 'student_name', 'gender', 'date_of_birth',
                  'image_url', 'classroom_id', 'classroom_name', 'academic_year_id',
                  'academic_year_name', 'enrollment_date', 'desk_number', 'monitor_role']

    def get_student_name(self, obj):
        return f"{obj.student.last_name or ''} {obj.student.first_name or ''}".strip() or 'គ្មានឈ្មោះ'

    def get_monitor_role(self, obj):
        cm = ClassMonitors.objects.filter(
            student_id=obj.student_id,
            classroom_id=obj.classroom_id,
            academic_year_id=obj.academic_year_id
        ).first()
        return cm.role if cm else None

class AwardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Awards
        fields = '__all__'

class StudentPayYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentPayYear
        fields = '__all__'

class ClassMonitorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassMonitors
        fields = '__all__'

class MonkPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonkPermission
        fields = '__all__'

class StudentEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentEducation
        fields = '__all__'

class RegistrationSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationSession
        fields = '__all__'

class MultiplePermissionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    classroom_name = serializers.SerializerMethodField()
    pagoda_name = serializers.SerializerMethodField()
    kuti_name = serializers.SerializerMethodField()

    class Meta:
        model = MultiplePermission
        fields = '__all__'

    def get_student_name(self, obj):
        return f'{obj.student.last_name or ""} {obj.student.first_name or ""}'.strip() or '---'

    def get_classroom_name(self, obj):
        enrollment = Enrollments.objects.filter(student=obj.student).order_by('-academic_year__start_date').first()
        return enrollment.classroom.class_name if enrollment and enrollment.classroom else '---'

    def get_pagoda_name(self, obj):
        return obj.student.current_pagoda.name if obj.student.current_pagoda else '---'

    def get_kuti_name(self, obj):
        return obj.student.kuti.kuti_name if obj.student.kuti else '---'

class DropoutStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = DropoutStudent
        fields = '__all__'
