// ===========================================
// js/modal-handler.js - Lógica del modal de donaciones
// ===========================================

// NO necesitamos importar DOM completo aquí, ya que los elementos del modal
// están ahora estáticamente en el HTML y se consultarán directamente.

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

    // Mostrar el modal de donaciones como un mensaje sutil, una vez por sesión
    const hasSeenDonationPrompt = sessionStorage.getItem("hasSeenDonationPrompt");
    if (!hasSeenDonationPrompt && donationModal) { // Solo mostrar si no se ha visto y el modal existe
        setTimeout(() => {
            if (donationModal.style.display !== "flex") { // Solo mostrar si no está ya abierto
                donationModal.style.display = "flex";
                document.body.style.overflow = 'hidden';
                sessionStorage.setItem("hasSeenDonationPrompt", "true");
            }
        }, 180000); // Mostrar después de 3 minutos (180000 ms)
    }
}