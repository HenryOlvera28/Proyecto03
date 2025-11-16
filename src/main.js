import './style.css'

// Variables globales
let appointments = [];

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('🐾 Iniciando Lis-Vet...');
    initializeApp();
});

function initializeApp() {
    // Configurar navegación
    setupNavigation();
    
    // Configurar formulario de contacto
    setupContactForm();
    
    // Cargar datos con fetch (GET)
    fetchWeatherData();
    fetchQuoteData();
    
    // Cargar citas guardadas
    loadAppointments();
    
    console.log('✅ App inicializada correctamente');
}

// ========== NAVEGACIÓN ==========
function setupNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.getElementById('navbar');
    
    if (!mobileMenuBtn || !mobileMenu || !navbar) {
        console.error('Elementos de navegación no encontrados');
        return;
    }
    
    // Toggle menú móvil
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Smooth scroll para todos los enlaces
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efecto de scroll en navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    console.log('✅ Navegación configurada');
}

// ========== FETCH - HTTP GET ==========
function fetchWeatherData() {
    const weatherWidget = document.getElementById('weather-widget');
    
    if (!weatherWidget) {
        console.error('Widget del clima no encontrado');
        return;
    }
    
    console.log('🌤️ Obteniendo datos del clima...');
    
    // API de Open-Meteo para Guayaquil (sin necesidad de API key)
    const weatherURL = 'https://api.open-meteo.com/v1/forecast?latitude=-2.1894&longitude=-79.8886&current=temperature_2m,weather_code&timezone=America/Guayaquil';
    
    fetch(weatherURL)
        .then(response => {
            console.log('Respuesta del clima recibida:', response.status);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API del clima');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos del clima:', data);
            const temperature = data.current.temperature_2m;
            const weatherCode = data.current.weather_code;
            const weatherEmoji = getWeatherEmoji(weatherCode);
            
            weatherWidget.innerHTML = `
                <p class="text-sm text-gray-700">
                    ${weatherEmoji} Clima actual en Guayaquil: <span class="font-bold">${temperature}°C</span>
                </p>
            `;
            console.log('✅ Clima actualizado correctamente');
        })
        .catch(error => {
            console.error('❌ Error al obtener datos del clima:', error);
            weatherWidget.innerHTML = `
                <p class="text-sm text-gray-700">
                    🌤️ Clima en Guayaquil: <span class="font-bold">25°C</span> (estimado)
                </p>
            `;
        });
}

function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '☁️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code <= 82) return '🌦️';
    return '🌤️';
}

function fetchQuoteData() {
    const quoteWidget = document.getElementById('quote-widget');
    
    if (!quoteWidget) {
        console.error('Widget de citas no encontrado');
        return;
    }
    
    console.log('💬 Obteniendo cita inspiracional...');
    
    // API de citas inspiracionales (sin necesidad de API key)
    const quoteURL = 'https://api.quotable.io/random?tags=inspirational';
    
    fetch(quoteURL)
        .then(response => {
            console.log('Respuesta de cita recibida:', response.status);
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API de citas');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de cita:', data);
            quoteWidget.innerHTML = `
                <p class="text-gray-700 italic mb-2">"${data.content}"</p>
                <p class="text-sm text-gray-500">— ${data.author}</p>
            `;
            console.log('✅ Cita actualizada correctamente');
        })
        .catch(error => {
            console.error('❌ Error al obtener cita inspiracional:', error);
            quoteWidget.innerHTML = `
                <p class="text-gray-700 italic mb-2">"El amor por todas las criaturas vivientes es el atributo más noble del hombre."</p>
                <p class="text-sm text-gray-500">— Charles Darwin</p>
            `;
        });
}

// ========== FORMULARIO DE CONTACTO ==========
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Formulario enviado');
        handleFormSubmit();
    });
    
    console.log('✅ Formulario configurado');
}

// ========== FETCH - HTTP POST ==========
function handleFormSubmit() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formStatus = document.getElementById('form-status');
    
    console.log('🔄 Procesando formulario...');
    
    // Obtener datos del formulario
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        mascota: document.getElementById('mascota').value.trim(),
        servicio: document.getElementById('servicio').value,
        mensaje: document.getElementById('mensaje').value.trim()
    };
    
    console.log('Datos del formulario:', formData);
    
    // Validar campos requeridos
    if (!formData.nombre || !formData.email || !formData.telefono || 
        !formData.mascota || !formData.servicio) {
        console.warn('⚠️ Campos incompletos');
        showFormStatus('error', 'Por favor completa todos los campos requeridos.');
        return;
    }
    
    // Deshabilitar botón y mostrar estado de carga
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    console.log('📤 Enviando POST request...');
    
    // Simular envío con POST a JSONPlaceholder (API de prueba pública)
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: `Cita para ${formData.nombre}`,
            body: `Servicio: ${formData.servicio}, Mascota: ${formData.mascota}`,
            userId: 1
        })
    })
    .then(response => {
        console.log('Respuesta POST recibida:', response.status);
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ POST exitoso:', data);
        
        // Éxito - Agregar cita
        const appointment = {
            id: data.id || Date.now(),
            ...formData,
            fecha: new Date().toLocaleDateString('es-EC', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        
        console.log('📋 Agregando cita:', appointment);
        addAppointment(appointment);
        
        // Limpiar formulario
        form.reset();
        
        // Mostrar mensaje de éxito
        showFormStatus('success', '¡Cita agendada exitosamente! Nos pondremos en contacto contigo pronto.');
        
        // Scroll a la sección de citas después de 1.5 segundos
        setTimeout(() => {
            const citasSection = document.getElementById('citas');
            if (citasSection) {
                citasSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1500);
    })
    .catch(error => {
        console.error('❌ Error al enviar el formulario:', error);
        showFormStatus('error', 'Hubo un error al agendar tu cita. Por favor intenta nuevamente.');
    })
    .finally(() => {
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Agendar Cita';
        console.log('✅ Proceso completado');
    });
}

function showFormStatus(type, message) {
    const formStatus = document.getElementById('form-status');
    
    if (!formStatus) {
        console.error('❌ Elemento form-status no encontrado');
        alert(message); // Fallback a alert
        return;
    }
    
    formStatus.classList.remove('hidden', 'form-status-success', 'form-status-error');
    
    if (type === 'success') {
        formStatus.classList.add('form-status-success');
        console.log('✅ Mostrando mensaje de éxito');
    } else {
        formStatus.classList.add('form-status-error');
        console.log('⚠️ Mostrando mensaje de error');
    }
    
    formStatus.textContent = message;
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 5000);
}

// ========== GESTIÓN DE CITAS ==========
function addAppointment(appointment) {
    console.log('➕ Agregando cita:', appointment);
    appointments.push(appointment);
    saveAppointments();
    renderAppointments();
    console.log('✅ Cita agregada. Total citas:', appointments.length);
}

// Hacer la función global para que funcione desde el HTML
window.deleteAppointment = function(id) {
    console.log('🗑️ Intentando eliminar cita ID:', id);
    
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
        appointments = appointments.filter(apt => apt.id !== id);
        saveAppointments();
        renderAppointments();
        console.log('✅ Cita eliminada. Total citas:', appointments.length);
    } else {
        console.log('❌ Eliminación cancelada');
    }
}

function saveAppointments() {
    try {
        const data = JSON.stringify(appointments);
        localStorage.setItem('lisvet_appointments', data);
        console.log('💾 Citas guardadas en localStorage:', appointments.length);
    } catch (error) {
        console.error('❌ Error al guardar citas:', error);
        alert('No se pudieron guardar las citas. Verifica los permisos del navegador.');
    }
}

function loadAppointments() {
    try {
        const saved = localStorage.getItem('lisvet_appointments');
        if (saved) {
            appointments = JSON.parse(saved);
            console.log('📂 Citas cargadas desde localStorage:', appointments.length);
            renderAppointments();
        } else {
            console.log('📂 No hay citas guardadas');
        }
    } catch (error) {
        console.error('❌ Error al cargar citas:', error);
        appointments = [];
    }
}

function renderAppointments() {
    const noAppointments = document.getElementById('no-appointments');
    const appointmentsList = document.getElementById('appointments-list');
    
    if (!noAppointments || !appointmentsList) {
        console.error('❌ Elementos de citas no encontrados');
        return;
    }
    
    console.log('🎨 Renderizando citas. Total:', appointments.length);
    
    if (appointments.length === 0) {
        noAppointments.classList.remove('hidden');
        appointmentsList.classList.add('hidden');
        appointmentsList.innerHTML = '';
        console.log('📭 No hay citas para mostrar');
    } else {
        noAppointments.classList.add('hidden');
        appointmentsList.classList.remove('hidden');
        
        appointmentsList.innerHTML = appointments.map(apt => {
            const appointmentHtml = `
            <div class="appointment-card">
                <div class="appointment-header">
                    <div class="appointment-icon-container">
                        <div class="appointment-icon">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <div class="appointment-info">
                            <h3>${escapeHtml(apt.nombre)}</h3>
                            <p>${escapeHtml(apt.fecha)}</p>
                        </div>
                    </div>
                    <button onclick="window.deleteAppointment(${apt.id})" class="btn-delete" type="button" title="Eliminar cita">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
                
                <div class="appointment-details">
                    <div class="appointment-detail-item">
                        <div class="appointment-detail-icon">
                            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                        </div>
                        <div class="appointment-detail-text">
                            <strong>Mascota</strong>
                            <span>${escapeHtml(apt.mascota)}</span>
                        </div>
                    </div>
                    
                    <div class="appointment-detail-item">
                        <div class="appointment-detail-icon">
                            <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                            </svg>
                        </div>
                        <div class="appointment-detail-text">
                            <strong>Servicio</strong>
                            <span>${escapeHtml(getServiceName(apt.servicio))}</span>
                        </div>
                    </div>
                    
                    <div class="appointment-detail-item">
                        <div class="appointment-detail-icon">
                            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                            </svg>
                        </div>
                        <div class="appointment-detail-text">
                            <strong>Teléfono</strong>
                            <span>${escapeHtml(apt.telefono)}</span>
                        </div>
                    </div>
                    
                    <div class="appointment-detail-item">
                        <div class="appointment-detail-icon">
                            <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                        </div>
                        <div class="appointment-detail-text">
                            <strong>Email</strong>
                            <span class="text-sm">${escapeHtml(apt.email)}</span>
                        </div>
                    </div>
                </div>
                
                ${apt.mensaje ? `
                    <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p class="text-sm text-gray-600"><strong>Mensaje:</strong> ${escapeHtml(apt.mensaje)}</p>
                    </div>
                ` : ''}
            </div>
            `;
            return appointmentHtml;
        }).join('');
        
        console.log('✅ Citas renderizadas exitosamente');
    }
}

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getServiceName(serviceCode) {
    const services = {
        'consulta': 'Consulta General',
        'vacunacion': 'Vacunación',
        'cirugia': 'Cirugía',
        'emergencia': 'Emergencia',
        'control': 'Control de Salud',
        'estetica': 'Estética y Baño'
    };
    return services[serviceCode] || serviceCode;
}

// ========== ANIMACIONES AL SCROLL ==========
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Inicializar animaciones
setTimeout(observeElements, 100);

// ========== UTILIDADES ==========

// Prevenir envío accidental del formulario con Enter
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'submit') {
            e.preventDefault();
        }
    });
});

// Log para debugging
console.log('🐾 Lis-Vet - Sistema de gestión de citas veterinarias');
console.log('✅ Funcionalidades disponibles:');
console.log('   - Navegación responsive');
console.log('   - Formulario de contacto con validación');
console.log('   - Fetch API (GET) para clima y citas');
console.log('   - Fetch API (POST) para agendar citas');
console.log('   - Gestión de citas con LocalStorage');
console.log('   - Animaciones y efectos visuales');
console.log('📊 Para ver logs detallados, mantén abierta la consola');