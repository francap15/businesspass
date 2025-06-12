// ===========================================
// js/modal-handler.js - Lógica del modal de donaciones
// ===========================================

/**
 * Inicializa la lógica del modal de donaciones.
 * Asume que el HTML del modal ya está presente en el DOM.
 */
export function initDonationModal() {
    // Obtener referencias a los elementos del modal directamente del DOM
    const donationModal = document.getElementById("donationModal");
    const supportLink = document.getElementById("support-link");
    const closeButton = document.querySelector("#donationModal .close-button");

    // Abrir modal al hacer clic en el enlace "Apoya el Proyecto"
    if (supportLink && donationModal) { // Asegurarse de que ambos elementos existen
        supportLink.addEventListener("click", (e) => {
            e.preventDefault(); // Prevenir el comportamiento por defecto del enlace
            donationModal.style.display = "flex"; // Mostrar el modal (usando flex para centrado)
            document.body.style.overflow = 'hidden'; // Evitar scroll en el body mientras el modal está abierto
        });
    }

    // Cerrar modal al hacer clic en el botón 'x'
    if (closeButton && donationModal) { // Asegurarse de que ambos elementos existen
        closeButton.addEventListener("click", () => {
            donationModal.style.display = "none";
            document.body.style.overflow = ''; // Restaurar scroll del body
        });
    }

    // Cerrar modal al hacer clic fuera de él
    window.addEventListener("click", (event) => {
        if (event.target === donationModal && donationModal) { // Asegurarse de que donationModal existe
            donationModal.style.display = "none";
            document.body.style.overflow = ''; // Restaurar scroll del body
        }
    });

    // === INICIO DE CAMBIO ===
    // Se ha eliminado la lógica de mostrar el modal automáticamente
    // a través de sessionStorage y setTimeout.
    // Ahora, el modal solo se abrirá cuando el usuario haga clic
    // en el enlace "Apoya el Proyecto".
    // === FIN DE CAMBIO ===
}