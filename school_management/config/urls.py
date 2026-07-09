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
from django.urls import re_path
from django.views.static import serve as serve_static

# django.conf.urls.static.static() silently no-ops when DEBUG=False, but
# Render (DEBUG=False in production) has no other server for MEDIA_URL --
# WhiteNoise only covers STATIC_ROOT. Wire the view directly so uploads are
# reachable in production too.
urlpatterns += [
    re_path(r'^%s(?P<path>.*)$' % settings.MEDIA_URL.lstrip('/'), serve_static, {
        'document_root': settings.MEDIA_ROOT,
    }),
]
