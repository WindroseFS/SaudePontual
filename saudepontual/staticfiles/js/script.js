
const API_BASE = "/api/";

async function fetchDoctors() {
    const response = await fetch(API_BASE + "doctors/");
    return await response.json();
}

async function postAppointment(data) {
    const response = await fetch(API_BASE + "appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const err = await response.json();
        alert("Erro ao agendar: " + (err.detail || JSON.stringify(err)));
        return;
    }

    return await response.json();
}

let doctors = [];

async function initApp() {
    doctors = await fetchDoctors();
    initCarousel();
    filterDoctors();
    initSmoothScrolling();
}

function filterDoctors() {
    const specialty = document.getElementById("specialty").value;
    const doctorsList = document.getElementById("doctors-list");
    const times = document.getElementById("times");
    const confirmation = document.getElementById("confirmation");

    times.innerHTML = "";
    confirmation.classList.add("hidden");

    const filteredDoctors = specialty === "Todas"
        ? doctors
        : doctors.filter(doctor => doctor.specialty === specialty);

    doctorsList.innerHTML = filteredDoctors.length > 0
        ? filteredDoctors.map(doctor => `
            <div class="doctor-card" onclick="showTimes(${doctor.id})">
                <h3>${doctor.name}</h3>
                <p>${doctor.specialty}</p>
            </div>
        `).join('')
        : "<p>Nenhum médico disponível para esta especialidade.</p>";
}

function showTimes(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    const times = document.getElementById("times");
    const confirmation = document.getElementById("confirmation");

    const horarios = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

    times.innerHTML = `
        <h3>Horários disponíveis - ${doctor.name}</h3>
        ${horarios.map(time => `
            <button class="time-button" onclick="bookAppointment('${doctor.name}', '${time}', ${doctor.id})">${time}</button>
        `).join('')}
    `;
    confirmation.classList.add("hidden");
}

function bookAppointment(doctorName, time, doctorId) {
    const confirmation = document.getElementById("confirmation");
    confirmation.innerHTML = `
        <p>Confirmar consulta com ${doctorName} às ${time}?</p>
        <input type="text" id="patient-name" placeholder="Seu nome" />
        <button onclick="confirmAppointment('${doctorName}', '${time}', ${doctorId})">Confirmar</button>
        <button onclick="filterDoctors()">Cancelar</button>
    `;
    confirmation.classList.remove("hidden");
}

async function confirmAppointment(doctorName, time, doctorId) {
    const nameInput = document.getElementById("patient-name");
    if (!nameInput.value) {
        alert("Por favor, informe seu nome.");
        return;
    }

    const data = {
        doctor: doctorId,
        time,
        patient_name: nameInput.value
    };

    await postAppointment(data);

    const confirmation = document.getElementById("confirmation");
    confirmation.innerHTML = `
        <p>Consulta agendada com ${doctorName} às ${time}!</p>
        <button onclick="filterDoctors()">Novo agendamento</button>
    `;
    confirmation.classList.remove("hidden");

    document.querySelectorAll(".time-button").forEach(btn => {
        btn.classList.remove("selected");
    });
}

function initCarousel() {
    console.log("Inicializando carrossel...");
}

function initSmoothScrolling() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", initApp);
