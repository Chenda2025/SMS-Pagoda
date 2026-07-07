from django.contrib import admin
from django.apps import apps

app = apps.get_app_config(__package__)

for model_name, model in app.models.items():
    if model.__name__ == 'Teachers':
        class TeachersAdmin(admin.ModelAdmin):
            readonly_fields = ('teacher_code',)
        try:
            admin.site.register(model, TeachersAdmin)
        except admin.sites.AlreadyRegistered:
            pass
    else:
        try:
            admin.site.register(model)
        except admin.sites.AlreadyRegistered:
            pass
