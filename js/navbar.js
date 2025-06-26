// ===========================================
// js/navbar.js - Lógica de la barra de navegación
// ===========================================

import { DOM } from './dom-elements.js'; // Importamos el objeto DOM

/**
 * Inicializa la lógica de la barra de navegación.
 * Maneja el comportamiento dinámico (ocultar/mostrar al hacer scroll) y el menú móvil.
 * Asume que los elementos de la navbar ya están presentes en el DOM.
 */
export function initNavbar() {
    // Las referencias a los elementos de la navbar ahora se obtienen desde DOM
    const nav = DOM.navBar; // Renombrado de .main-nav a .app-nav-bar
    const navToggle = DOM.navToggleBtn; // Renombrado de .nav-toggle a .nav-toggle-btn
    const navLinks = DOM.navList; // Renombrado de .nav-links a .nav-list
    let lastScrollY = window.scrollY;

    // Asegurarse de que los elementos existan antes de añadir listeners
    if (!nav || !navToggle || !navLinks) {
        console.warn("Navbar elements not found in the DOM. Skipping navbar initialization.");
        return;
    }

    // Control de scroll para ocultar/mostrar la barra de navegación
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        // Reset al llegar al top de la página
        if (currentScrollY <= 10) {
            nav.classList.remove("scrolled", "hidden");
            return;
        }

        // Ocultar la barra de navegación al hacer scroll hacia abajo
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add("hidden");
        }
        // Mostrar la barra de navegación y añadir clase 'scrolled' al hacer scroll hacia arriba
        else {
            nav.classList.remove("hidden");
            nav.classList.add("scrolled");
        }

        lastScrollY = currentScrollY;
    });

    // Menú móvil (toggle de navegación)
    navToggle.addEventListener("click", () => {
        navLinks.classList.toggle("open"); // Alterna la clase 'open' para mostrar/ocultar el menú
        navToggle.innerHTML = navLinks.classList.contains("open")
            ? '<i class="fas fa-times"></i>' // Icono de cerrar (X) cuando el menú está abierto
            : '<i class="fas fa-bars"></i>'; // Icono de hamburguesa cuando el menú está cerrado
    });

    // Cerrar menú móvil al hacer clic en un enlace de navegación
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open"); // Cierra el menú
            navToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Restaura el icono de hamburguesa
        });
    });
}
