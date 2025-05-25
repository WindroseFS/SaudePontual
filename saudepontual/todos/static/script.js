const doctors = [
    { id: 1, name: "Dr. João Silva", specialty: "Cardiologia", availableTimes: ["09:00", "10:00", "14:00"] },
    { id: 2, name: "Dra. Maria Oliveira", specialty: "Dermatologia", availableTimes: ["11:00", "15:00"] },
    { id: 3, name: "Dr. Pedro Santos", specialty: "Ortopedia", availableTimes: ["08:00", "13:00", "16:00"] },
];

const carouselImages = [
    "imagens/banner_saude_pontual.png",
    "imagens/Logo_Saude_Pontual.png",
    "imagens/banner_entre_contato_saudepontual.png",
];
let currentSlide = 0;

function initCarousel() {
    const carousel = document.getElementById("carousel");
    if (!carousel) {
        console.error("Elemento com id 'carousel' não encontrado. Verifique index.html.");
        return;
    }

    console.log("Inicializando carrossel com imagens:", carouselImages);
    carouselImages.forEach((img, index) => {
        console.log(`Imagem ${index + 1}: ${img}`);
    });

    carousel.innerHTML = `
        <div class="carousel-inner">
            ${carouselImages.map((img, index) => `
                <div class="carousel-item">
                    <img src="${img}" alt="Slide ${index + 1}" onerror="this.parentElement.innerHTML='Erro ao carregar imagem ${index + 1}. Verifique se o arquivo existe em: C:\\Users\\netoc\\Desktop\\saudepontual\\imagens\\${img.split('/')[1] || img}'">
                </div>
            `).join('')}
        </div>
        <button class="carousel-control prev" onclick="changeSlide(-1)">‹</button>
        <button class="carousel-control next" onclick="changeSlide(1)">›</button>
        <div class="carousel-indicators">
            ${carouselImages.map((_, index) => `
                <span class="indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></span>
            `).join('')}
        </div>
    `;

    console.log("Carrossel inicializado com sucesso.");
    console.log("Configurando troca automática de slides a cada 5 segundos.");

    setInterval(() => {
        console.log("Troca automática de slide acionada.");
        changeSlide(1);
    }, 5000);

    const items = document.querySelectorAll(".carousel-item");
    console.log(`Total de slides encontrados: ${items.length}`);
    items.forEach((item, index) => {
        console.log(`Slide ${index}: ${item.classList.contains('active') ? 'Ativo' : 'Inativo'}`);
    });

    updateCarouselTransform();
}

function updateCarouselTransform() {
    const carouselInner = document.querySelector(".carousel-inner");
    if (carouselInner) {
        carouselInner.style.transform = `translateX(-${currentSlide * 25}%)`;
        console.log(`Aplicando transform: translateX(-${currentSlide * 25}%)`);
    } else {
        console.error("Elemento .carousel-inner não encontrado.");
    }
}

function changeSlide(direction) {
    const items = document.querySelectorAll(".carousel-item");
    const indicators = document.querySelectorAll(".carousel-indicators .indicator");
    if (items.length === 0) {
        console.error("Nenhum item de carrossel encontrado.");
        return;
    }

    console.log(`Mudando slide: de ${currentSlide} para ${currentSlide + direction}`);
    items[currentSlide].classList.remove("active");
    indicators[currentSlide].classList.remove("active");

    currentSlide = (currentSlide + direction + carouselImages.length) % carouselImages.length;

    console.log(`Novo slide ativo: ${currentSlide}, Imagem: ${carouselImages[currentSlide]}`);
    items[currentSlide].classList.add("active");
    indicators[currentSlide].classList.add("active");

    updateCarouselTransform();

    items.forEach((item, index) => {
        console.log(`Slide ${index}: ${item.classList.contains('active') ? 'Ativo' : 'Inativo'}`);
    });
}

function goToSlide(index) {
    console.log(`Indo para o slide ${index}: ${carouselImages[index]}`);
    currentSlide = index;
    const items = document.querySelectorAll(".carousel-item");
    const indicators = document.querySelectorAll(".carousel-indicators .indicator");
    if (items.length === 0) {
        console.error("Nenhum item de carrossel encontrado.");
        return;
    }

    items.forEach(item => item.classList.remove("active"));
    indicators.forEach(ind => ind.classList.remove("active"));
    items[currentSlide].classList.add("active");
    indicators[currentSlide].classList.add("active");

    updateCarouselTransform();

    items.forEach((item, index) => {
        console.log(`Slide ${index}: ${item.classList.contains('active') ? 'Ativo' : 'Inativo'}`);
    });
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

    times.innerHTML = `
        <h3>Horários disponíveis - ${doctor.name}</h3>
        ${doctor.availableTimes.length > 0
            ? doctor.availableTimes.map(time => `
                <button class="time-button" onclick="bookAppointment('${doctor.name}', '${time}', ${doctor.id})">${time}</button>
            `).join('')
            : "<p>Nenhum horário disponível.</p>"}
    `;
    confirmation.classList.add("hidden");
}

function bookAppointment(doctorName, time, doctorId) {
    const confirmation = document.getElementById("confirmation");
    confirmation.innerHTML = `
        <p>Confirmar consulta com ${doctorName} às ${time}?</p>
        <button onclick="confirmAppointment('${doctorName}', '${time}', ${doctorId})">Confirmar</button>
        <button onclick="filterDoctors()">Cancelar</button>
    `;
    confirmation.classList.remove("hidden");

    document.querySelectorAll(".time-button").forEach(btn => {
        btn.classList.toggle("selected", btn.textContent === time);
    });
}

function confirmAppointment(doctorName, time, doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
        doctor.availableTimes = doctor.availableTimes.filter(t => t !== time);
    }

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

document.addEventListener("DOMContentLoaded", () => {
    console.log("Página carregada, iniciando carrossel, filtro de médicos e navegação suave.");
    initCarousel();
    filterDoctors();
    initSmoothScrolling();
});