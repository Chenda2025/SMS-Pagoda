from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FinalScoresViewSet, ScoresViewSet

router = DefaultRouter()
router.register(r'final-scores', FinalScoresViewSet, basename='final-scores')
router.register(r'scores', ScoresViewSet, basename='scores')

urlpatterns = [
    path('', include(router.urls)),
]
