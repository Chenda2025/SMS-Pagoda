from rest_framework import serializers
from .models import AcademicPeriods, AcademicYears, ClassSubjects, Classrooms, Communes, Districts, Documents, EducationLevels, Kutis, Nationalities, Pagodas, PaperHeaders, PayRates, PayrollRecords, MonthlyPayrolls, Provinces, ScheduleSubstitutions, SchoolCalendar, Subjects, TeachingSessions, TimeSlots, Timetable, Villages, YearbookEntries

class AcademicPeriodsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AcademicPeriods
        fields = '__all__'

class AcademicYearsSerializer(serializers.ModelSerializer):
    buddhist_era_year = serializers.ReadOnlyField()

    class Meta:
        model = AcademicYears
        fields = '__all__'

class ClassSubjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassSubjects
        fields = '__all__'

class ClassroomsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Classrooms
        fields = '__all__'

    def validate_class_name(self, value):
        queryset = Classrooms.objects.filter(class_name=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError('ថ្នាក់នេះមានហើយ')
        return value

class CommunesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Communes
        fields = '__all__'

class DistrictsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Districts
        fields = '__all__'

class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documents
        fields = '__all__'

class EducationLevelsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationLevels
        fields = '__all__'

class KutisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kutis
        fields = '__all__'

class NationalitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nationalities
        fields = '__all__'

class PagodasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pagodas
        fields = '__all__'

class PaperHeadersSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaperHeaders
        fields = '__all__'

class PayRatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayRates
        fields = '__all__'

class ProvincesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provinces
        fields = '__all__'

class ScheduleSubstitutionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleSubstitutions
        fields = '__all__'

class SchoolCalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolCalendar
        fields = '__all__'

class SubjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subjects
        fields = '__all__'

class TeachingSessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeachingSessions
        fields = '__all__'

class TimeSlotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlots
        fields = '__all__'

class TimetableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timetable
        fields = '__all__'

class VillagesSerializer(serializers.ModelSerializer):
    commune_name = serializers.SerializerMethodField()
    district_name = serializers.SerializerMethodField()
    province_name = serializers.SerializerMethodField()

    class Meta:
        model = Villages
        fields = '__all__'

    def get_commune_name(self, obj):
        return (obj.commune.name_kh or obj.commune.name_en) if obj.commune_id else None

    def get_district_name(self, obj):
        return (obj.commune.district.name_kh or obj.commune.district.name_en) if obj.commune_id else None

    def get_province_name(self, obj):
        return (obj.commune.district.province.name_kh or obj.commune.district.province.name_en) if obj.commune_id else None

class YearbookEntriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearbookEntries
        fields = '__all__'


class PayrollRecordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollRecords
        fields = '__all__'


class MonthlyPayrollsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyPayrolls
        fields = '__all__'



from .models import PayrollRates

class PayrollRatesSerializer(serializers.ModelSerializer):
    classroom_id = serializers.IntegerField(source='class_subject.classroom.id', read_only=True)
    teacher_id = serializers.IntegerField(source='class_subject.teacher.id', read_only=True)
    subject_id = serializers.IntegerField(source='class_subject.subject.id', read_only=True)
    total_hours = serializers.IntegerField(source='class_subject.subject.total_hours', read_only=True)
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = PayrollRates
        fields = ['id', 'class_subject', 'academic_period', 'rate_per_hour', 'total_teaching', 'note', 'created_at', 'updated_at', 'classroom_id', 'teacher_id', 'subject_id', 'total_hours', 'total_amount']
        read_only_fields = ('total_amount', 'created_at', 'updated_at')