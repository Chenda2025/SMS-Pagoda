from django.contrib import admin
from django.apps import apps
from django.http import JsonResponse
from django.urls import path

from .models import Communes, Districts, Pagodas, Subjects, Villages

app = apps.get_app_config(__package__)

for model_name, model in app.models.items():
    if model.__name__ == 'Pagodas':
        continue
    elif model.__name__ == 'Subjects':
        class SubjectsAdmin(admin.ModelAdmin):
            readonly_fields = ('subject_code',)
            list_display = ('subject_code', 'subject_name', 'coefficient', 'total_hours', 'total_score', 'total_homework', 'total_time_exam')
        try:
            admin.site.register(model, SubjectsAdmin)
        except admin.sites.AlreadyRegistered:
            pass
    else:
        try:
            admin.site.register(model)
        except admin.sites.AlreadyRegistered:
            pass

class PagodasAdmin(admin.ModelAdmin):
    fields = ('name', 'abbot_name', 'province', 'district', 'commune', 'village', 'phone')

    class Media:
        js = ('core/admin/pagoda_geo.js',)

    def get_urls(self):
        custom_urls = [
            path('ajax/districts/', self.admin_site.admin_view(self.ajax_districts), name='core_pagodas_ajax_districts'),
            path('ajax/communes/', self.admin_site.admin_view(self.ajax_communes), name='core_pagodas_ajax_communes'),
            path('ajax/villages/', self.admin_site.admin_view(self.ajax_villages), name='core_pagodas_ajax_villages'),
        ]
        return custom_urls + super().get_urls()

    def ajax_districts(self, request):
        province_code = request.GET.get('province_code')
        qs = Districts.objects.filter(province_id=province_code) if province_code else Districts.objects.none()
        return JsonResponse([{'code': d.district_code, 'name': str(d)} for d in qs], safe=False)

    def ajax_communes(self, request):
        district_code = request.GET.get('district_code')
        qs = Communes.objects.filter(district_id=district_code) if district_code else Communes.objects.none()
        return JsonResponse([{'code': c.commune_code, 'name': str(c)} for c in qs], safe=False)

    def ajax_villages(self, request):
        commune_code = request.GET.get('commune_code')
        qs = Villages.objects.filter(commune_id=commune_code) if commune_code else Villages.objects.none()
        return JsonResponse([{'code': v.village_code, 'name': str(v)} for v in qs], safe=False)

admin.site.register(Pagodas, PagodasAdmin)
