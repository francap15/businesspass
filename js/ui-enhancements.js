// ===========================================
// js/ui-enhancements.js - Mejoras de interfaz de usuario
// ===========================================

import { DOM } from './dom-elements.js'; // Importamos los elementos del DOM

/**
 * Inicializa mejoras visuales y de interacción de la interfaz de usuario.
 * @param {object} DOM - Objeto con las referencias a los elementos del DOM.
 */
export function initUIEnhancements() {
    // Mejor feedback táctil para botones y opciones
    document.querySelectorAll("button, .option").forEach((el) => {
        el.style.transition = "transform 0.1s, opacity 0.1s"; // Asegurar la transición CSS
        el.addEventListener("touchstart", () => {
            el.style.transform = "scale(0.98)";
            el.style.opacity = "0.9";
        });
        el.addEventListener("touchend", () => {
            el.style.transform = "";
            el.style.opacity = "";
        });
    });

    // Evitar zoom en inputs en iOS al enfocar
    document.querySelectorAll("input, textarea, select").forEach((input) => {
        input.addEventListener("focus", () => {
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0");
            }
        });
        input.addEventListener("blur", () => {
            const viewportMeta = document.querySelector('meta[name="viewport"]');
            if (viewportMeta) {
                viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=5.0");
            }
        });
    });
}