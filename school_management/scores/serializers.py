from rest_framework import serializers
from .models import FinalScores, Scores

class FinalScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinalScores
        fields = '__all__'

class ScoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scores
        fields = '__all__'

