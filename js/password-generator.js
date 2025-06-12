// ===========================================
// js/password-generator.js - Lógica de generación de contraseñas regulares
// ===========================================

import { getRandomIndex } from './utils.js'; // Importamos la función de utilidad
import { baseCharSets, ambiguousChars } from './data.js'; // Importamos los conjuntos de caracteres

/**
 * Genera una contraseña segura, asegurando que al menos un carácter de cada tipo seleccionado esté presente.
 * Los caracteres obligatorios se insertan primero y luego la contraseña se mezcla.
 * @param {object} options - Objeto con todas las opciones necesarias para la generación:
 * @param {number} options.length - La longitud deseada de la contraseña.
 * @param {boolean} options.includeUppercase - Si se deben incluir letras mayúsculas.
 * @param {boolean} options.includeLowercase - Si se deben incluir letras minúsculas.
 * @param {boolean} options.includeNumbers - Si se deben incluir números.
 * @param {boolean} options.includeSymbols - Si se deben incluir símbolos.
 * @param {boolean} options.excludeAmbiguous - Si se deben excluir caracteres ambiguos.
 * @returns {string} La contraseña generada.
 */
export function generatePassword(options) {
    let currentCharset = "";
    if (options.includeUppercase) currentCharset += baseCharSets.uppercase;
    if (options.includeLowercase) currentCharset += baseCharSets.lowercase;
    if (options.includeNumbers) currentCharset += baseCharSets.numbers;
    if (options.includeSymbols) currentCharset += baseCharSets.symbols;

    if (options.excludeAmbiguous) {
        currentCharset = currentCharset.replace(ambiguousChars, "");
    }

    if (currentCharset === "") {
        return ""; // Devolver vacío si no hay tipos seleccionados (el main.js ya lo valida)
    }

    let passwordArray = [];
    const mustInclude = [];

    // Identificar y asegurar la inclusión de al menos un carácter de cada tipo marcado
    if (options.includeUppercase && baseCharSets.uppercase.split('').some(char => currentCharset.includes(char))) {
        mustInclude.push(baseCharSets.uppercase.charAt(getRandomIndex(baseCharSets.uppercase.length)));
    }
    if (options.includeLowercase && baseCharSets.lowercase.split('').some(char => currentCharset.includes(char))) {
        mustInclude.push(baseCharSets.lowercase.charAt(getRandomIndex(baseCharSets.lowercase.length)));
    }
    if (options.includeNumbers && baseCharSets.numbers.split('').some(char => currentCharset.includes(char))) {
        mustInclude.push(baseCharSets.numbers.charAt(getRandomIndex(baseCharSets.numbers.length)));
    }
    if (options.includeSymbols && baseCharSets.symbols.split('').some(char => currentCharset.includes(char))) {
        mustInclude.push(baseCharSets.symbols.charAt(getRandomIndex(baseCharSets.symbols.length)));
    }

    // Si la longitud es menor que el número de tipos obligatorios, ajustar la longitud.
    let actualLength = options.length;
    if (actualLength < mustInclude.length) {
        console.warn("La longitud de la contraseña es menor que la cantidad de tipos de caracteres seleccionados. Se ajustará la longitud para incluir todos los tipos.");
        actualLength = mustInclude.length;
    }

    // Añadir los caracteres obligatorios
    passwordArray.push(...mustInclude);

    // Rellenar el resto de la contraseña
    const remainingLength = actualLength - passwordArray.length;

    // Solo generar si la longitud restante es positiva
    if (remainingLength > 0) {
        const randomValues = new Uint32Array(remainingLength);
        window.crypto.getRandomValues(randomValues); // Obtener valores aleatorios seguros

        for (let i = 0; i < remainingLength; i++) {
            passwordArray.push(currentCharset[randomValues[i] % currentCharset.length]);
        }
    }

    // Mezclar la contraseña para asegurar la aleatoriedad de la posición de los caracteres obligatorios
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = getRandomIndex(i + 1);
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }
    return passwordArray.join('');
}