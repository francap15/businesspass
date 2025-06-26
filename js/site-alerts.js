// ===========================================
// js/cookie-banner.js - Lógica del banner de cookies
// ===========================================

import { DOM } from './dom-elements.js'; // Importamos el objeto DOM

/**
 * Inicializa la lógica del banner de cookies.
 * Asume que el HTML del banner ya está presente en el DOM.
 */
export function initCookieBanner() {
    // Obtener referencias a los elementos del banner desde DOM
    const alertPanel = DOM.alertPanel; // Renombrado de cookieBanner
    const confirmButton = DOM.panelConfirmBtn; // Renombrado de acceptCookiesBtn

    if (alertPanel) { // Asegurarse de que el elemento existe antes de interactuar con él
        if (!localStorage.getItem("cookiesAccepted")) {
            // Se usa la clase 'privacy-consent-banner' en CSS para controlar el display.
            // Aquí se setea el estilo directamente para mayor control.
            alertPanel.style.display = "flex"; // Mostrar el banner si las cookies no han sido aceptadas
        }
    }

    if (confirmButton && alertPanel) { // Asegurarse de que el botón y el banner existen
        confirmButton.addEventListener("click", () => {
            localStorage.setItem("cookiesAccepted", "true"); // Marcar cookies como aceptadas en localStorage
            alertPanel.style.display = "none"; // Ocultar el banner
        });
    }
}
