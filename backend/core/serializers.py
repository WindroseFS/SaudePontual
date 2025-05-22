from rest_framework import serializers
from .models import Doctor, Appointment

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

    def validate(self, data):
        if Appointment.objects.filter(doctor=data['doctor'], time=data['time']).exists():
            raise serializers.ValidationError("Este horário já está reservado para este médico.")
        return data
