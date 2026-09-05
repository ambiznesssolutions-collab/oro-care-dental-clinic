
// Preloader
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 800);
});

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false,
  offset: 50
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('scrollProgress').style.width = scrolled + '%';
});

// Navbar scroll effect + active link
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('shadow-sm');
  } else {
    navbar.classList.remove('shadow-sm');
  }

  // Active nav highlighting
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === current) {
      link.classList.add('active');
    }
  });

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

// Mobile Menu
function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.querySelector('.hamburger');
  menu.classList.add('open');
  overlay.classList.remove('hidden');
  hamburger.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const hamburger = document.querySelector('.hamburger');
  menu.classList.remove('open');
  overlay.classList.add('hidden');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if (menu.classList.contains('open')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

// Smooth scroll for ALL internal nav links (desktop + mobile)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return; // skip logo home link

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      // Close mobile menu if open
      closeMobileMenu();
      // Small delay to let menu close animation finish
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  });
});

// Initialize Leaflet Map
let map, marker;

// 118/1 North Purbachal Road, Kalitala (Near Tarke Bridge), Haltu, Kolkata - 700078
// NOTE: To fine-tune the pin, open Google Maps, right-click the exact clinic
// building, copy the coordinates, then replace the two values below.
const clinicLat = 22.50701450599265;
const clinicLng = 88.39686998959031;
const clinicAddress = "118/1 North Purbachal Road, Kalitala (Near Tarke Bridge), Haltu, Kolkata - 700078";
const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=" + clinicLat + "," + clinicLng;

function initMap() {
  const mapEl = document.getElementById('locationMap');
  if (!mapEl || typeof L === 'undefined') return; // guard: Leaflet CDN failed or element missing

  if (map) { map.remove(); map = null; } // prevent "Map container is already initialized" error

  map = L.map('locationMap', { scrollWheelZoom: false }).setView([clinicLat, clinicLng], 16);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19
}).addTo(map);

  const tealIcon = L.divIcon({
    className: 'custom-marker',
    html: '<i class="fas fa-tooth" style="color: white; font-size: 18px; background: #46b80d; padding: 10px; border-radius: 50%; box-shadow: 0 4px 12px rgba(70,184,13,0.40);"></i>',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  marker = L.marker([clinicLat, clinicLng], { icon: tealIcon }).addTo(map);
  marker.bindPopup(
    "<b>ORO-Care Dental Clinic</b><br>" + clinicAddress + "<br>" +
    '<a href="' + directionsUrl + '" target="_blank" rel="noopener noreferrer" style="color:#3a990b;font-weight:600;">Get Directions on Google Maps ↗</a>'
  ).openPopup();

  // Fix grey/tileless map if the container size changed after initialization
  setTimeout(function () { if (map) map.invalidateSize(); }, 300);
}

// Initialize only after ALL resources (images, fonts, preloader) are done
window.addEventListener('load', function () {
  initMap();
});

// Re-fit tiles on window resize (debounced)
let mapResizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(mapResizeTimer);
  mapResizeTimer = setTimeout(function () { if (map) map.invalidateSize(); }, 200);
});

// Lightbox
function openLightbox(src) {
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

// Google Reviews Modal
function showAllGoogleReviews() {
  document.getElementById('googleReviewModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGoogleReviews(e) {
  document.getElementById('googleReviewModal').classList.remove('active');
  document.body.style.overflow = '';
}

// FAQ Accordion
function toggleFaq(element) {
  const item = element.parentElement;
  const wasActive = item.classList.contains('active');

  // Close all
  document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));

  // Open clicked if it wasnt active
  if (!wasActive) {
    item.classList.add('active');
  }
}

// Counter Animation
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = Number(counter.dataset.target);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const increment = target / 60;

    const update = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + suffix;
      }
    };
    update();
  });
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      counterObserver.disconnect();
    }
  });
});

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// Cookie Consent
setTimeout(() => {
  if (!localStorage.getItem('cookiesAccepted')) {
    document.getElementById('cookieConsent').classList.add('show');
  }
}, 3000);

function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true');
  document.getElementById('cookieConsent').classList.remove('show');
}

// Contact form -> WhatsApp appointment request
function submitAppointmentForm(event) {
  event.preventDefault();
  const form = document.getElementById('appointmentForm');
  const data = new FormData(form);
  const name = data.get('name') || '';
  const phone = data.get('phone') || '';
  const email = data.get('email') || '';
  const treatment = data.get('treatment') || 'General Consultation';
  const message = data.get('message') || '';

  const text = `Hi, I would like to book an appointment at ORO-Care Dental Clinic.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AEmail: ${encodeURIComponent(email)}%0ATreatment: ${encodeURIComponent(treatment)}%0AMessage: ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/9831211850?text=${text}`, '_blank');
}

// Escape key for modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeLightbox();
    closeGoogleReviews();
  }
});
