// ===========================================
// js/cookie-banner.js - Lógica del banner de cookies
// ===========================================

// NO necesitamos importar DOM completo aquí, ya que los elementos del banner
// están ahora estáticamente en el HTML y se consultarán directamente.

/**
 * Inicializa la lógica del banner de cookies.
 * Asume que el HTML del banner ya está presente en el DOM.
 */
export function initCookieBanner() {
    // Obtener referencias a los elementos del banner directamente del DOM
    const cookieBanner = document.getElementById("cookieBanner");
    const acceptCookies = document.getElementById("acceptCookies");

    if (cookieBanner) { // Asegurarse de que el elemento existe antes de interactuar con él
        if (!localStorage.getItem("cookiesAccepted")) {
            cookieBanner.style.display = "flex"; // Mostrar el banner si las cookies no han sido aceptadas
        }
    }

    if (acceptCookies && cookieBanner) { // Asegurarse de que el botón y el banner existen
        acceptCookies.addEventListener("click", () => {
            localStorage.setItem("cookiesAccepted", "true"); // Marcar cookies como aceptadas en localStorage
            cookieBanner.style.display = "none"; // Ocultar el banner
        });
    }
}