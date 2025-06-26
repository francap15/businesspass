// ===========================================
// js/site-alerts.js - Lógica del banner de cookies
// ===========================================

import { DOM } from './dom-elements.js';

/**
 * Inicializa la lógica del banner de consentimiento de cookies.
 */
export function initCookieBanner() {
    // Asegurarse de que los elementos existan antes de añadir listeners
    if (DOM.alertPanel && DOM.panelConfirmBtn) {
        // Comprobar si el usuario ya aceptó las cookies
        const hasAcceptedCookies = localStorage.getItem('cookiesAccepted');

        if (!hasAcceptedCookies) {
            DOM.alertPanel.classList.add('show');
        }

        // Manejar el clic en el botón de aceptar
        DOM.panelConfirmBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            DOM.alertPanel.classList.remove('show');
        });
    } else {
        console.warn("Algunos elementos del banner de cookies no fueron encontrados. No se inicializó el banner.");
    }
}