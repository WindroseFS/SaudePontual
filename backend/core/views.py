from rest_framework import viewsets
from .models import Doctor, Appointment
from .serializers import DoctorSerializer, AppointmentSerializer
from django.shortcuts import render

def frontend(request):
    return render(request, "core/index.html")

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
