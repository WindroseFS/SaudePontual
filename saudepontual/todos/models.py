from django.db import models

# Create your models here.
class Doctor(models.Model):
    SPECIALITIES = [
        ("Cardiologia", "cardiologia"),
        ("Dermatologia", 'dermatologia'),
        ("Ortopedia", 'dermatologia'),
    ]

    name = models.CharField(max_length=100)
    speciality = models.CharField(max_length=50, choices=SPECIALITIES)

    def _str_(self):
        return f"{self.name} ({self.speciality})"

class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    time = models.TimeField()
    pacient_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['doctor', 'time']
        ordering = ['time']

    def _str_(self):
        return f"{self.pacient_name} com {self.doctor.name} às {self.time}"