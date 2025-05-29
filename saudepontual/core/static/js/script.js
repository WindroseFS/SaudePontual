const API_BASE = "/api/";

const imagens = [
    "/static/imagens/banner_saude_pontual.png",
    "/static/imagens/gelzin.jpg",
    "/static/imagens/banner_entre_contato_saudepontual.png"
];

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

async function initApp(imagens) {
    doctors = await fetchDoctors();
    initCarousel(imagens);
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

function initCarousel(imagens) {
    const carousel = document.getElementById("carousel");

    // Limpa conteúdo anterior
    carousel.innerHTML = "";

    // Cria inner
    const inner = document.createElement("div");
    inner.className = "carousel-inner";

    imagens.forEach((src, index) => {
        const item = document.createElement("div");
        item.className = "carousel-item";
        if (index === 0) item.classList.add("active");
        item.innerHTML = `<img src="${src}" alt="Banner ${index + 1}">`;
        inner.appendChild(item);
    });

    carousel.appendChild(inner);

    // Cria controles
    const prevBtn = document.createElement("button");
    prevBtn.className = "carousel-control prev";
    prevBtn.innerHTML = "&#10094;";
    carousel.appendChild(prevBtn);

    const nextBtn = document.createElement("button");
    nextBtn.className = "carousel-control next";
    nextBtn.innerHTML = "&#10095;";
    carousel.appendChild(nextBtn);

    // Cria indicadores
    const indicators = document.createElement("div");
    indicators.className = "carousel-indicators";
    imagens.forEach((_, i) => {
        const indicator = document.createElement("span");
        indicator.className = "indicator";
        if (i === 0) indicator.classList.add("active");
        indicator.dataset.slideTo = i;
        indicators.appendChild(indicator);
    });
    carousel.appendChild(indicators);

    let currentIndex = 0;

    function goToSlide(index) {
        const items = inner.querySelectorAll(".carousel-item");
        const dots = indicators.querySelectorAll(".indicator");

        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;

        items.forEach((item, i) => {
            item.classList.toggle("active", i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentIndex = index;
    }

    // Troca automática a cada 5 segundos
    let autoSlideInterval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    prevBtn.addEventListener("click", () => {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
    });

    indicators.querySelectorAll(".indicator").forEach(dot => {
        dot.addEventListener("click", () => {
            goToSlide(parseInt(dot.dataset.slideTo));
            resetAutoSlide();
        });
    });
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

document.addEventListener("DOMContentLoaded", () => initApp(imagens));
