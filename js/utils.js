// ===========================================
// js/utils.js - Funciones de utilidad comunes
// ===========================================

/**
 * Carga un componente HTML desde una ruta de archivo y lo inserta en un elemento del DOM.
 * @param {string} selector - Selector CSS del elemento donde se insertará el HTML.
 * @param {string} filePath - Ruta al archivo HTML del componente.
 */
export async function loadHTMLComponent(selector, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status} al cargar ${filePath}`);
        }
        const html = await response.text();
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = html;
        } else {
            console.warn(`Element with selector "${selector}" not found. Cannot load component from ${filePath}.`);
        }
    } catch (error) {
        console.error(`Error loading HTML component from ${filePath}:`, error);
    }
}

/**
 * Genera un índice aleatorio criptográficamente seguro dentro de un rango dado.
 * Utiliza `window.crypto.getRandomValues` para mayor seguridad.
 * @param {number} max - El límite superior exclusivo para el índice aleatorio (e.g., length of an array).
 * @returns {number} Un índice aleatorio entre 0 (inclusive) y `max` (exclusivo).
 */
export const getRandomIndex = (max) => {
    if (max <= 0) {
        console.error("getRandomIndex: 'max' debe ser mayor que 0.");
        return 0;
    }
    // Uint32Array(1) crea un array de un elemento de 32 bits sin signo
    // window.crypto.getRandomValues lo llena con un valor aleatorio seguro.
    // El operador módulo (%) asegura que el valor esté dentro del rango [0, max-1].
    return window.crypto.getRandomValues(new Uint32Array(1))[0] % max;
};