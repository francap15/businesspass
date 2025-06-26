// ===========================================
// js/modal-handler.js - Lógica del modal de donaciones
// ===========================================

import { DOM } from './dom-elements.js'; // Importamos el objeto DOM

/**
 * Inicializa la lógica del modal de donaciones.
 * Asume que el HTML del modal ya está presente en el DOM.
 */
export function initDonationModal() {
    // Obtener referencias a los elementos del modal desde DOM
    const donationModal = DOM.supportDialog; // Renombrado de DOM.donationModal a DOM.supportDialog
    const supportLink = DOM.supportLink; // ID se mantuvo como 'support-project-link'
    const closeButton = DOM.modalCloseButton; // ID se mantuvo como '.modal-close-button'

    // Abrir modal al hacer clic en el enlace "Apoya el Proyecto"
    if (supportLink && donationModal) {
        supportLink.addEventListener("click", (e) => {
            e.preventDefault();
            donationModal.style.display = "flex";
            document.body.style.overflow = 'hidden';
        });
    }

    // Cerrar modal al hacer clic en el botón 'x'
    if (closeButton && donationModal) {
        closeButton.addEventListener("click", () => {
            donationModal.style.display = "none";
            document.body.style.overflow = '';
        });
    }

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener("click", (event) => {
        if (event.target === donationModal && donationModal) {
            donationModal.style.display = "none";
            document.body.style.overflow = '';
        }
    });

    // === INICIO DE CAMBIO ===
    // Se ha eliminado la lógica de mostrar el modal automáticamente
    // a través de sessionStorage y setTimeout.
    // Ahora, el modal solo se abrirá cuando el usuario haga clic
    // en el enlace "Apoya el Proyecto".
    // === FIN DE CAMBIO ===
}
