from rest_framework import viewsets
from .models import FinalScores, Scores
from .serializers import FinalScoresSerializer, ScoresSerializer

class FinalScoresViewSet(viewsets.ModelViewSet):
    queryset = FinalScores.objects.all()
    serializer_class = FinalScoresSerializer

class ScoresViewSet(viewsets.ModelViewSet):
    queryset = Scores.objects.all()
    serializer_class = ScoresSerializer

