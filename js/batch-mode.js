// ===========================================
// js/batch-mode.js - Lógica de generación en lote y descarga
// ===========================================

import { generatePassword } from './password-generator.js';
import { generatePassphrase } from './passphrase-generator.js';
import { updateStrengthMeter } from './strength-meter.js';
import { baseCharSets, ambiguousChars, wordListES } from './data.js'; // Necesitamos datos para los generadores

/**
 * Maneja la generación de contraseñas o passphrases en lote.
 * @param {object} options - Objeto con todas las opciones necesarias para la generación en lote.
 * @param {number} options.batchSize - Cantidad de contraseñas/passphrases a generar.
 * @param {boolean} options.isPassphraseMode - Si se están generando passphrases.
 * @param {number} options.passphraseLength - Longitud de las passphrases (número de palabras).
 * @param {string} options.passphraseSeparator - Separador para las passphrases.
 * @param {boolean} options.passphraseCapitalizeRandomly - Opción de capitalización aleatoria.
 * @param {boolean} options.passphraseIncludeNumbers - Opción de incluir números en passphrases.
 * @param {boolean} options.passphraseIncludeSymbols - Opción de incluir símbolos en passphrases.
 * @param {number} options.regularPasswordLength - Longitud de las contraseñas regulares.
 * @param {boolean} options.includeUppercase - Opción de incluir mayúsculas.
 * @param {boolean} options.includeLowercase - Opción de incluir minúsculas.
 * @param {boolean} options.includeNumbers - Opción de incluir números (para contraseñas regulares).
 * @param {boolean} options.includeSymbols - Opción de incluir símbolos (para contraseñas regulares).
 * @param {boolean} options.excludeAmbiguous - Opción de excluir caracteres ambiguos.
 * @param {HTMLElement} options.passwordResultEl - Elemento del DOM donde se muestra el resultado.
 * @param {Function} options.updateStrengthMeter - Función para actualizar la barra de fortaleza.
 * @param {Function} options.generatePassword - Referencia a la función de generación de contraseña.
 * @param {Function} options.generatePassphrase - Referencia a la función de generación de passphrase.
 */
export function handleBatchGeneration(options) {
    const count = parseInt(options.batchSize);
    if (isNaN(count) || count < 2 || count > 50) {
        options.passwordResultEl.innerHTML = "<div>Número de lote inválido (2-50).</div>";
        options.updateStrengthMeter("");
        return;
    }

    let passwordsHtml = "";
    let passwordsArray = [];

    for (let n = 0; n < count; n++) {
        let generatedItem;
        if (options.isPassphraseMode) {
            generatedItem = generatePassphrase({
                length: options.passphraseLength,
                separator: options.passphraseSeparator,
                capitalizeRandomly: options.passphraseCapitalizeRandomly,
                includeNumbers: options.passphraseIncludeNumbers,
                includeSymbols: options.passphraseIncludeSymbols,
                wordList: wordListES // Se pasa la lista de palabras
            });
        } else {
            // Validar si al menos un tipo de carácter está seleccionado para contraseñas regulares
            if (!(options.includeUppercase || options.includeLowercase || options.includeNumbers || options.includeSymbols)) {
                generatedItem = "Selecciona al menos un tipo de carácter"; // Esto podría ser un error o una cadena vacía
                // Considerar cómo manejar esto en el lote si el resultado de una es un error
            } else {
                 generatedItem = generatePassword({
                    length: options.regularPasswordLength,
                    includeUppercase: options.includeUppercase,
                    includeLowercase: options.includeLowercase,
                    includeNumbers: options.includeNumbers,
                    includeSymbols: options.includeSymbols,
                    excludeAmbiguous: options.excludeAmbiguous,
                    baseCharSets: baseCharSets, // Se pasan los charsets
                    ambiguousChars: ambiguousChars // Se pasan los caracteres ambiguos
                });
            }
        }
        passwordsHtml += `<div>${generatedItem}</div>`;
        passwordsArray.push(generatedItem);
    }

    options.passwordResultEl.innerHTML = passwordsHtml;
    // La barra de fortaleza no tiene mucho sentido para un lote, pero actualizamos con la primera si existe.
    options.updateStrengthMeter(passwordsArray[0] || "", options.isPassphraseMode, options.passphraseSeparator, options.passwordResultEl);


    options.downloadBtn.onclick = () => {
        const fileExtension = options.isPassphraseMode ? "passphrases" : "passwords";
        const csvContent = "data:text/csv;charset=utf-8," + passwordsArray.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `businesspass_${passwordsArray.length}_${fileExtension}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
}