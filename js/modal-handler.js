// ===========================================
// js/modal-handler.js - Lógica del modal de apoyo al proyecto
// ===========================================

import { DOM } from './dom-elements.js';

/**
 * Inicializa la lógica del modal de apoyo al proyecto.
 * Esto incluye abrirlo y cerrarlo.
 */
export function initProjectSupportModal() {
    console.log("initProjectSupportModal: Iniciando..."); // Debugging
    console.log("initProjectSupportModal: DOM.projectSupportLink es", DOM.projectSupportLink);
    console.log("initProjectSupportModal: DOM.supportDialog es", DOM.supportDialog);
    console.log("initProjectSupportModal: DOM.modalCloseButton es", DOM.modalCloseButton);


    // Asegurarse de que los elementos existan antes de añadir listeners
    if (DOM.projectSupportLink && DOM.supportDialog && DOM.modalCloseButton) {
        console.log("initProjectSupportModal: Todos los elementos del modal de apoyo encontrados. Adjuntando listeners."); // Debugging
        
        // Abre el modal
        DOM.projectSupportLink.addEventListener('click', (e) => {
            e.preventDefault(); // Evitar el comportamiento predeterminado del enlace
            console.log("Click en 'Apoya el Proyecto'. Abriendo modal."); // Debugging
            DOM.supportDialog.classList.add('show');
            DOM.supportDialog.setAttribute('aria-hidden', 'false'); // Accesibilidad
        });

        // Cierra el modal al hacer clic en la 'x'
        DOM.modalCloseButton.addEventListener('click', () => {
            console.log("Click en botón de cerrar modal. Cerrando modal."); // Debugging
            DOM.supportDialog.classList.remove('show');
            DOM.supportDialog.setAttribute('aria-hidden', 'true'); // Accesibilidad
        });

        // Cierra el modal al hacer clic fuera de él
        DOM.supportDialog.addEventListener('click', (e) => {
            if (e.target === DOM.supportDialog) {
                console.log("Click fuera del contenido del modal. Cerrando modal."); // Debugging
                DOM.supportDialog.classList.remove('show');
                DOM.supportDialog.setAttribute('aria-hidden', 'true'); // Accesibilidad
            }
        });

        // Cierra el modal al presionar la tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.supportDialog.classList.contains('show')) {
                console.log("Tecla ESC presionada. Cerrando modal."); // Debugging
                DOM.supportDialog.classList.remove('show');
                DOM.supportDialog.setAttribute('aria-hidden', 'true');
            }
        });
    } else {
        console.warn("Algunos elementos del modal de apoyo no fueron encontrados. No se inicializó el modal. (Esto es esperado si DOM.projectSupportLink es null)."); // Debugging
    }
}