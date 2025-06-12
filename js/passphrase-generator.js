// ===========================================
// js/passphrase-generator.js - Lógica de generación de passphrases
// ===========================================

// Importamos la función de utilidad getRandomIndex.
import { getRandomIndex } from './utils.js';

/**
 * Genera una passphrase a partir de la lista de palabras extendida.
 *
 * @param {object} options - Objeto con todas las opciones necesarias para la generación:
 * @param {number} options.length - El número de palabras a generar.
 * @param {string} options.separator - El separador entre palabras.
 * @param {boolean} options.capitalizeRandomly - Si se deben capitalizar aleatoriamente palabras.
 * @param {boolean} options.includeNumbers - Si se deben insertar números aleatorios.
 * @param {boolean} options.includeSymbols - Si se deben insertar símbolos aleatorios.
 * @param {string[]} options.wordList - La lista de palabras a usar (ej. `wordListES` de `data.js`).
 * @returns {string} La passphrase generada.
 */
export function generatePassphrase(options) {
    let finalPassphraseWords = [];

    // Generar palabras aleatorias de la lista extensa
    for (let i = 0; i < options.length; i++) {
        const word = options.wordList[getRandomIndex(options.wordList.length)];
        finalPassphraseWords.push(word);
    }

    // Unir todas las palabras con el separador principal
    let passphrase = finalPassphraseWords.filter(word => word !== "").join(options.separator);

    // --- Aplicar transformaciones post-generación ---

    // Capitalizar la primera letra de la primera palabra de la passphrase (por defecto)
    if (passphrase.length > 0) {
        passphrase = passphrase.charAt(0).toUpperCase() + passphrase.slice(1);
    }

    // Capitalización aleatoria de otras palabras (si la opción está activa)
    if (options.capitalizeRandomly) {
        let parts = passphrase.split(options.separator);
        let capitalizedParts = parts.map((part, index) => {
            // La primera palabra ya fue capitalizada arriba.
            // Solo capitalizar aleatoriamente si no es la primera palabra y la condición se cumple.
            if (index === 0) return part; // Ya capitalizada si passphrase.length > 0
            return Math.random() < 0.25 ? part.charAt(0).toUpperCase() + part.slice(1) : part;
        });
        passphrase = capitalizedParts.join(options.separator);
    }

    // Inclusión de números aleatorios (si la opción está activa)
    if (options.includeNumbers) {
        const numCount = getRandomIndex(2) + 1; // Inserta 1 o 2 números
        for (let i = 0; i < numCount; i++) {
            const randomNumber = getRandomIndex(100); // Números de 0 a 99
            const insertIndex = getRandomIndex(passphrase.length + 1); // Posición aleatoria en la passphrase
            passphrase = passphrase.slice(0, insertIndex) + randomNumber + passphrase.slice(insertIndex);
        }
    }

    // Inclusión de símbolos aleatorios (si la opción está activa)
    if (options.includeSymbols) {
        const symbols = "!@#$%^&*()-_+=[]{}|;:,.<>?";
        const symbolCount = getRandomIndex(2) + 1; // Inserta 1 o 2 símbolos
        for (let i = 0; i < symbolCount; i++) {
            const randomSymbol = symbols[getRandomIndex(symbols.length)];
            const insertIndex = getRandomIndex(passphrase.length + 1); // Posición aleatoria en la passphrase
            passphrase = passphrase.slice(0, insertIndex) + randomSymbol + passphrase.slice(insertIndex);
        }
    }

    return passphrase;
}