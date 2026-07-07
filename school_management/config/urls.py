from django.contrib import admin
from django.urls import path, include

from core.auth_views import LoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login', LoginView.as_view(), name='login'),
    path('api/login/', LoginView.as_view(), name='login-slash'),
    path('api/core/', include('core.urls')),
    path('api/users/', include('users.urls')),
    path('api/students/', include('students.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/scores/', include('scores.urls')),
    path('api/permissions/', include('permissions.urls')),
    path('api/', include('core.urls')),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
