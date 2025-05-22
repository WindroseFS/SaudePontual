from django.db import models

class Doctor(models.Model):
    SPECIALTIES = [
        ("Cardiologia", "Cardiologia"),
        ("Dermatologia", "Dermatologia"),
        ("Ortopedia", "Ortopedia"),
    ]

    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=50, choices=SPECIALTIES)

    def __str__(self):
        return f"{self.name} ({self.specialty})"

class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    time = models.TimeField()
    patient_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['doctor', 'time']
        ordering = ['time']

    def __str__(self):
        return f"{self.patient_name} com {self.doctor.name} às {self.time}"
