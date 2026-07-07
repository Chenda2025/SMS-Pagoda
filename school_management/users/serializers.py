from rest_framework import serializers
from .models import ActivityLogs, PendingTeachers, Positions, StaffPositions, TeacherEducation, TeacherRegistrationSession, TeacherSalaries, Teachers, Users

class ActivityLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLogs
        fields = '__all__'

class PositionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Positions
        fields = '__all__'

class StaffPositionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffPositions
        fields = '__all__'

class TeacherEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherEducation
        fields = '__all__'

class TeacherSalariesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherSalaries
        fields = '__all__'

class TeachersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teachers
        fields = '__all__'

class PendingTeachersSerializer(serializers.ModelSerializer):
    class Meta:
        model = PendingTeachers
        fields = '__all__'

class TeacherRegistrationSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherRegistrationSession
        fields = '__all__'

class UsersSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    related_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Users
        fields = ['id', 'username', 'role', 'teacher', 'student', 'is_active',
                  'created_at', 'updated_at', 'password', 'related_id']

    def _apply_related_id(self, validated_data):
        related_id = validated_data.pop('related_id', None)
        role = validated_data.get('role', getattr(self.instance, 'role', None))
        validated_data['teacher_id'] = related_id if role == 'teacher' else None
        validated_data['student_id'] = related_id if role == 'monitor' else None
        return validated_data

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        validated_data = self._apply_related_id(validated_data)
        user = Users(**validated_data)
        user.set_password(password or '')
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data = self._apply_related_id(validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

