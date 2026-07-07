from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import AcademicPeriods, AcademicYears, ClassSubjects, Classrooms, Communes, Districts, Documents, EducationLevels, Kutis, Nationalities, Pagodas, PaperHeaders, PayRates, PayrollRecords, MonthlyPayrolls, Provinces, ScheduleSubstitutions, SchoolCalendar, Subjects, TeachingSessions, TimeSlots, Timetable, Villages, YearbookEntries
from .serializers import AcademicPeriodsSerializer, AcademicYearsSerializer, ClassSubjectsSerializer, ClassroomsSerializer, CommunesSerializer, DistrictsSerializer, DocumentsSerializer, EducationLevelsSerializer, KutisSerializer, NationalitiesSerializer, PagodasSerializer, PaperHeadersSerializer, PayRatesSerializer, PayrollRecordsSerializer, MonthlyPayrollsSerializer, ProvincesSerializer, ScheduleSubstitutionsSerializer, SchoolCalendarSerializer, SubjectsSerializer, TeachingSessionsSerializer, TimeSlotsSerializer, TimetableSerializer, VillagesSerializer, YearbookEntriesSerializer

class AcademicPeriodsViewSet(viewsets.ModelViewSet):
    queryset = AcademicPeriods.objects.all().order_by('period_number')
    serializer_class = AcademicPeriodsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        academic_year = self.request.query_params.get('academic_year')
        if academic_year:
            queryset = queryset.filter(academic_year_id=academic_year)
        return queryset

    @action(detail=False, methods=['post'])
    def bulk(self, request):
        periods_data = request.data.get('periods', [])
        if not periods_data:
            return Response({'error': 'No periods provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=periods_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AcademicYearsViewSet(viewsets.ModelViewSet):
    queryset = AcademicYears.objects.all()
    serializer_class = AcademicYearsSerializer

    @action(detail=False, methods=['post'])
    def bulk(self, request):
        years_data = request.data.get('years', [])
        if not years_data:
            return Response({'error': 'No years provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(data=years_data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.utils import timezone
from django.db import transaction

class ClassSubjectsViewSet(viewsets.ModelViewSet):
    queryset = ClassSubjects.objects.all()
    serializer_class = ClassSubjectsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        classroom = self.request.query_params.get('classroom')
        if classroom:
            queryset = queryset.filter(classroom_id=classroom)
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_at=timezone.now())

    @action(detail=False, methods=['post'])
    def upsert(self, request):
        """
        Creates or updates a class-subject row with an explicit subject and
        teacher. If the target subject is already assigned to a different
        row in the same classroom, that other row is removed entirely
        (rather than failing the (classroom, subject) unique constraint).
        """
        row_id = request.data.get('id')
        subject_id = request.data.get('subject')
        teacher_id = request.data.get('teacher')

        row = None
        if row_id:
            try:
                row = ClassSubjects.objects.get(id=row_id)
            except ClassSubjects.DoesNotExist:
                return Response({'error': 'Class-subject row not found.'}, status=status.HTTP_404_NOT_FOUND)
            classroom_id = row.classroom_id
        else:
            classroom_id = request.data.get('classroom')
            if not classroom_id:
                return Response({'error': 'classroom is required.'}, status=status.HTTP_400_BAD_REQUEST)

        conflict_qs = ClassSubjects.objects.filter(classroom_id=classroom_id, subject_id=subject_id)
        if row is not None:
            conflict_qs = conflict_qs.exclude(id=row.id)
        conflict = conflict_qs.first()

        with transaction.atomic():
            if conflict is not None:
                conflict.delete()
            if row is not None:
                row.subject_id = subject_id
                row.teacher_id = teacher_id
                row.save()
            else:
                row = ClassSubjects.objects.create(classroom_id=classroom_id, subject_id=subject_id, teacher_id=teacher_id, created_at=timezone.now())

        return Response(ClassSubjectsSerializer(row).data)

    @action(detail=False, methods=['post'])
    def update_orders(self, request):
        """
        Updates the 'order' field for a list of class-subject IDs.
        Expected payload: {"ordered_ids": [id1, id2, id3, ...]}
        """
        ordered_ids = request.data.get('ordered_ids', [])
        if not ordered_ids or not isinstance(ordered_ids, list):
            return Response({'error': 'ordered_ids must be a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            for index, cs_id in enumerate(ordered_ids):
                ClassSubjects.objects.filter(id=cs_id).update(order=index)
                
        return Response({'status': 'Orders updated successfully'})

class ClassroomsViewSet(viewsets.ModelViewSet):
    queryset = Classrooms.objects.all()
    serializer_class = ClassroomsSerializer

class CommunesViewSet(viewsets.ModelViewSet):
    queryset = Communes.objects.all()
    serializer_class = CommunesSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        district_code = self.request.query_params.get('district_code')
        if district_code:
            queryset = queryset.filter(district_id=district_code)
        return queryset

class DistrictsViewSet(viewsets.ModelViewSet):
    queryset = Districts.objects.all()
    serializer_class = DistrictsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        province_code = self.request.query_params.get('province_code')
        if province_code:
            queryset = queryset.filter(province_id=province_code)
        return queryset

class DocumentsViewSet(viewsets.ModelViewSet):
    queryset = Documents.objects.all()
    serializer_class = DocumentsSerializer

class EducationLevelsViewSet(viewsets.ModelViewSet):
    queryset = EducationLevels.objects.all()
    serializer_class = EducationLevelsSerializer

class KutisViewSet(viewsets.ModelViewSet):
    queryset = Kutis.objects.all()
    serializer_class = KutisSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        pagoda = self.request.query_params.get('pagoda')
        if pagoda:
            queryset = queryset.filter(pagoda_id=pagoda)
        return queryset

class NationalitiesViewSet(viewsets.ModelViewSet):
    queryset = Nationalities.objects.all()
    serializer_class = NationalitiesSerializer

class PagodasViewSet(viewsets.ModelViewSet):
    queryset = Pagodas.objects.all()
    serializer_class = PagodasSerializer

class PaperHeadersViewSet(viewsets.ModelViewSet):
    queryset = PaperHeaders.objects.all()
    serializer_class = PaperHeadersSerializer

class PayRatesViewSet(viewsets.ModelViewSet):
    queryset = PayRates.objects.all()
    serializer_class = PayRatesSerializer

class ProvincesViewSet(viewsets.ModelViewSet):
    queryset = Provinces.objects.all()
    serializer_class = ProvincesSerializer

class ScheduleSubstitutionsViewSet(viewsets.ModelViewSet):
    queryset = ScheduleSubstitutions.objects.all()
    serializer_class = ScheduleSubstitutionsSerializer

    @action(detail=False, methods=['post', 'get'])
    def substitute(self, request):
        if request.method == 'GET':
            classroom_name = request.query_params.get('classroom_name')
            date_str = request.query_params.get('date')
            if not classroom_name or not date_str:
                return Response({'error': 'Missing parameters'}, status=400)
            
            subs = self.queryset.filter(
                classroom__class_name=classroom_name,
                change_date=date_str
            )
            res = []
            for sub in subs:
                res.append({
                    'id': sub.id,
                    'time_slot': f"{sub.time_slot.session}_{sub.time_slot.slot_no}",
                    'original_subject': sub.original_subject.subject_name if sub.original_subject else '',
                    'new_subject': sub.new_subject.subject_name if sub.new_subject else '',
                    'new_teacher': f"{sub.new_teacher.last_name} {sub.new_teacher.first_name}".strip() if sub.new_teacher else ''
                })
            return Response(res)
        
        elif request.method == 'POST':
            classroom_name = request.data.get('classroom')
            date_str = request.data.get('date')
            session_key = request.data.get('session') # 'morning' or 'afternoon'
            slot_index = request.data.get('slot_index') # 0, 1, 2...
            original_subj_name = request.data.get('original_subject')
            new_subj_name = request.data.get('new_subject')
            bulk_type = request.data.get('bulk_session_type') # 'single' or 'session'
            
            is_reset = request.data.get('is_reset') == True
            
            if not all([classroom_name, date_str, session_key, new_subj_name]):
                return Response({'error': 'Missing required fields'}, status=400)
            
            try:
                classroom = Classrooms.objects.get(class_name=classroom_name)
            except Classrooms.DoesNotExist:
                return Response({'error': 'Classroom not found'}, status=404)
                
            # Handle "No Teacher"
            is_no_teacher = new_subj_name == 'គ្មានគ្រូបង្រៀន'
            
            new_subject = None
            if not is_no_teacher and not is_reset:
                try:
                    new_subject = Subjects.objects.get(subject_name=new_subj_name)
                except Subjects.DoesNotExist:
                    return Response({'error': f'Subject {new_subj_name} not found'}, status=404)
                    
            orig_subject = None
            if original_subj_name:
                orig_subject = Subjects.objects.filter(subject_name=original_subj_name).first()
                
            # Find new teacher
            new_teacher = None
            if new_subject:
                # try to find teacher for this subject in this classroom
                cs = ClassSubjects.objects.filter(classroom=classroom, subject=new_subject).first()
                if cs and cs.teacher:
                    new_teacher = cs.teacher
                    
            slots_to_update = []
            if bulk_type == 'session':
                # find all slots for this session
                slots_to_update = TimeSlots.objects.filter(session=session_key)
            else:
                try:
                    slot = TimeSlots.objects.get(session=session_key, slot_no=int(slot_index) + 1)
                    slots_to_update = [slot]
                except TimeSlots.DoesNotExist:
                    return Response({'error': 'TimeSlot not found'}, status=404)
                    
            import datetime
            try:
                change_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
                
            for ts in slots_to_update:
                # Delete existing substitution for this slot if exists
                ScheduleSubstitutions.objects.filter(
                    classroom=classroom,
                    change_date=change_date,
                    time_slot=ts
                ).delete()
                
                if is_reset:
                    continue

                # If they chose a valid new subject or "No Teacher"
                if is_no_teacher:
                    new_subject, _ = Subjects.objects.get_or_create(
                        subject_name='គ្មានគ្រូបង្រៀន',
                        defaults={'subject_code': 'NONE', 'coefficient': 1, 'total_score': 0, 'total_hours': 0}
                    )
                
                ScheduleSubstitutions.objects.create(
                    classroom=classroom,
                    change_date=change_date,
                    time_slot=ts,
                    original_subject=orig_subject or new_subject, # fallback
                    new_subject=new_subject,
                    new_teacher=new_teacher
                )
                
            return Response({'message': 'Success'})

class SchoolCalendarViewSet(viewsets.ModelViewSet):
    queryset = SchoolCalendar.objects.all()
    serializer_class = SchoolCalendarSerializer

class SubjectsViewSet(viewsets.ModelViewSet):
    queryset = Subjects.objects.all()
    serializer_class = SubjectsSerializer

class TeachingSessionsViewSet(viewsets.ModelViewSet):
    queryset = TeachingSessions.objects.all()
    serializer_class = TeachingSessionsSerializer

class TimeSlotsViewSet(viewsets.ModelViewSet):
    queryset = TimeSlots.objects.all()
    serializer_class = TimeSlotsSerializer

class TimetableViewSet(viewsets.ModelViewSet):
    queryset = Timetable.objects.all()
    serializer_class = TimetableSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        classroom = self.request.query_params.get('classroom')
        if classroom:
            queryset = queryset.filter(classroom_id=classroom)
        return queryset

class VillagesViewSet(viewsets.ModelViewSet):
    queryset = Villages.objects.all()
    serializer_class = VillagesSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        commune_code = self.request.query_params.get('commune_code')
        if commune_code:
            queryset = queryset.filter(commune_id=commune_code)
        return queryset

class YearbookEntriesViewSet(viewsets.ModelViewSet):
    queryset = YearbookEntries.objects.all()
    serializer_class = YearbookEntriesSerializer


class PayrollRecordsViewSet(viewsets.ModelViewSet):
    queryset = PayrollRecords.objects.all().order_by('-month_year', 'teacher')
    serializer_class = PayrollRecordsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        month_year = self.request.query_params.get('month_year')
        if month_year:
            queryset = queryset.filter(month_year=month_year)
        return queryset


class MonthlyPayrollsViewSet(viewsets.ModelViewSet):
    queryset = MonthlyPayrolls.objects.all().order_by('-academic_period', 'teacher')
    serializer_class = MonthlyPayrollsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        academic_period_id = self.request.query_params.get('academic_period_id')
        if academic_period_id:
            queryset = queryset.filter(academic_period_id=academic_period_id)
        return queryset

    def perform_create(self, serializer):
        # total_amount is a PostgreSQL GENERATED ALWAYS column; raw SQL avoids Django
        # including it in the INSERT (which PostgreSQL rejects even for DEFAULT).
        from django.db import connection
        d = serializer.validated_data
        with connection.cursor() as cur:
            cur.execute(
                """INSERT INTO monthly_payrolls
                     (teacher_id, subject_id, academic_period_id,
                      total_hours, total_teaching, rate_per_hour)
                   VALUES (%s, %s, %s, %s, %s, %s)
                   RETURNING id""",
                [d['teacher'].id, d['subject'].id, d['academic_period'].id,
                 d.get('total_hours', 0), d['total_teaching'], d['rate_per_hour']],
            )
            pk = cur.fetchone()[0]
        serializer.instance = MonthlyPayrolls.objects.get(pk=pk)

    def perform_update(self, serializer):
        from django.db import connection
        d = serializer.validated_data
        pk = serializer.instance.pk
        with connection.cursor() as cur:
            cur.execute(
                """UPDATE monthly_payrolls
                      SET teacher_id=%s, subject_id=%s, academic_period_id=%s,
                          total_hours=%s, total_teaching=%s, rate_per_hour=%s
                    WHERE id=%s""",
                [d.get('teacher', serializer.instance.teacher).id,
                 d.get('subject', serializer.instance.subject).id,
                 d.get('academic_period', serializer.instance.academic_period).id,
                 d.get('total_hours', serializer.instance.total_hours),
                 d.get('total_teaching', serializer.instance.total_teaching),
                 d.get('rate_per_hour', serializer.instance.rate_per_hour),
                 pk],
            )
        serializer.instance = MonthlyPayrolls.objects.get(pk=pk)

from .models import PayrollRates
from .serializers import PayrollRatesSerializer

class PayrollRatesViewSet(viewsets.ModelViewSet):
    serializer_class = PayrollRatesSerializer

    def get_queryset(self):
        qs = PayrollRates.objects.all()
        period_id = self.request.query_params.get('academic_period_id')
        if period_id:
            qs = qs.filter(academic_period_id=period_id)
        return qs
