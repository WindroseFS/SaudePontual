from django.shortcuts import render
from django.http import HttpResponse
from .models import Paciente
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView

class PacienteListView(ListView):
    model = Paciente

class PacienteCreateView(CreateView):
    model = Paciente
    fields = ['title','deadline']
    success_url = reverse_lazy('paciente_list')

# Create your views here.

def paciente_list_old(request):
    nome = 'Angel'
    pacientes = ['1. Jucelino', '2. Ana', '3. Rogério']
    return render(request, "saudepontual/paciente_list.html", {"nome": nome, "lista_Pacientes": pacientes})

def paciente_list(request):
    pacientes = Paciente.objects.all()
    return render(request, "saudepontual/paciente_list.html", {"pacientes": pacientes})