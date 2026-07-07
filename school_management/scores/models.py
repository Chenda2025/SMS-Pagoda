from django.db import models

class FinalScores(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='សិស្ស')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, verbose_name='មុខវិជ្ជា')
    period = models.ForeignKey('core.AcademicPeriods', models.DO_NOTHING, verbose_name='រយៈពេលសិក្សា')
    attendance_score = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='ពិន្ទុវត្តមាន')
    homework_score = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='ពិន្ទុការងារផ្ទះ')
    exercise_score = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='ពិន្ទុលំហាត់')
    exam_score = models.DecimalField(max_digits=6, decimal_places=2, verbose_name='ពិន្ទុប្រឡង')
    total_activity = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, verbose_name='ពិន្ទុសកម្មភាពសរុប')
    final_score = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True, verbose_name='ពិន្ទុចុងក្រោយ')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'final_scores'
        unique_together = (('student', 'subject', 'period'),)
        verbose_name = 'ពិន្ទុចុងក្រោយ'
        verbose_name_plural = 'ពិន្ទុចុងក្រោយ'

    def __str__(self):
        return f'{self.student} - {self.subject} - {self.period}'


class Scores(models.Model):
    student = models.ForeignKey('students.Students', models.DO_NOTHING, verbose_name='សិស្ស')
    subject = models.ForeignKey('core.Subjects', models.DO_NOTHING, verbose_name='មុខវិជ្ជា')
    period = models.ForeignKey('core.AcademicPeriods', models.DO_NOTHING, verbose_name='រយៈពេលសិក្សា')
    score_type = models.CharField(max_length=30, verbose_name='ប្រភេទពិន្ទុ')
    raw_score = models.DecimalField(max_digits=6, decimal_places=2, verbose_name='ពិន្ទុដើម')
    exam_date = models.DateField(blank=True, null=True, verbose_name='ថ្ងៃប្រឡង')
    created_at = models.DateTimeField(blank=True, null=True, verbose_name='កាលបរិច្ឆេទបង្កើត')

    class Meta:
        managed = True
        db_table = 'scores'
        unique_together = (('student', 'subject', 'period', 'score_type'),)
        verbose_name = 'ពិន្ទុ'
        verbose_name_plural = 'ពិន្ទុ'

    def __str__(self):
        return f'{self.student} - {self.subject} - {self.score_type}'

