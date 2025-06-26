// ===========================================
// js/batch-mode.js - Lógica de generación en lote y descarga
// ===========================================

// Importaciones necesarias para que batch-mode.js funcione de forma independiente si es necesario,
// PERO SEGUIMOS PASANDO LAS FUNCIONES Y DATOS DESDE MAIN.JS.
// La clave es USAR LOS PARÁMETROS RECIBIDOS, no estas importaciones si ya se pasan.

// Esto asegura que si se llama directamente con los datos, también funcione, pero la prioridad
// para esta implementación es usar los 'options' que vienen de main.js
// Si generatePassword y generatePassphrase son módulos, DEBERÍAN SER IMPORTADOS aquí.
// Asumo que generatePassword y generatePassphrase son funciones exportadas de sus propios módulos.
import { generatePassword } from './password-generator.js'; // Necesitas importar estas funciones aquí si son módulos separados
import { generatePassphrase } from './passphrase-generator.js'; // Necesitas importar estas funciones aquí si son módulos separados

// Las variables de datos como baseCharSets, ambiguousChars, wordListES
// DEBEN ser importadas aquí si se usan directamente y no se pasan como parámetros.
// Si se pasan como parámetros desde main.js, úsalas desde 'options'.
// Dado que las estás pasando, vamos a usarlas desde 'options'.

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
 * @param {Function} options.generatePassword - Referencia a la función de generación de contraseña (PASADA COMO PARÁMETRO).
 * @param {Function} options.generatePassphrase - Referencia a la función de generación de passphrase (PASADA COMO PARÁMETRO).
 * @param {Array<string>} options.wordListES - Lista de palabras para passphrase (PASADA COMO PARÁMETRO).
 * @param {object} options.baseCharSets - Conjuntos de caracteres base (PASADA COMO PARÁMETRO).
 * @param {string} options.ambiguousChars - Caracteres ambiguos (PASADA COMO PARÁMETRO).
 * @param {HTMLElement} options.downloadBtn - Botón de descarga (PASADO COMO PARÁMETRO).
 */
export function handleBatchGeneration(options) {
    // Desestructurar options para acceder fácilmente a todos los parámetros
    const {
        batchSize, isPassphraseMode, passphraseLength, passphraseSeparator,
        passphraseCapitalizeRandomly, passphraseIncludeNumbers, passphraseIncludeSymbols,
        regularPasswordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols,
        excludeAmbiguous, passwordResultEl, updateStrengthMeter,
        // Usar las funciones y datos pasados como parámetros directamente
        generatePassword: passedGeneratePassword, // Renombrar para evitar conflicto con importación si la tienes
        generatePassphrase: passedGeneratePassphrase, // Renombrar
        wordListES: passedWordListES, // Renombrar
        baseCharSets: passedBaseCharSets, // Renombrar
        ambiguousChars: passedAmbiguousChars, // Renombrar
        downloadBtn // El botón de descarga
    } = options;

    const count = parseInt(batchSize);
    if (isNaN(count) || count < 2 || count > 50) {
        passwordResultEl.innerHTML = "<div class='error-message'>Número de lote inválido (2-50).</div>"; // Añadir clase para estilo de error
        updateStrengthMeter("", isPassphraseMode, passphraseSeparator, null); // Limpiar barra
        return;
    }

    let passwordsHtml = "";
    let passwordsArray = [];

    // Limpiar el área de resultados antes de generar nuevas contraseñas
    passwordResultEl.innerHTML = ""; 

    for (let n = 0; n < count; n++) {
        let generatedItem;
        if (isPassphraseMode) {
            generatedItem = passedGeneratePassphrase({ // Usar la función pasada como parámetro
                length: parseInt(passphraseLength),
                separator: passphraseSeparator,
                capitalizeRandomly: passphraseCapitalizeRandomly,
                includeNumbers: passphraseIncludeNumbers,
                includeSymbols: passphraseIncludeSymbols,
                wordList: passedWordListES // Usar la lista pasada como parámetro
            });
        } else {
            // Validar si al menos un tipo de carácter está seleccionado para contraseñas regulares
            if (!(includeUppercase || includeLowercase || includeNumbers || includeSymbols)) {
                // Si ninguna opción está seleccionada, generar una contraseña por defecto o un mensaje de error
                generatedItem = "ERROR: Selecciona al menos un tipo de carácter para contraseña.";
            } else {
                generatedItem = passedGeneratePassword({ // Usar la función pasada como parámetro
                    length: parseInt(regularPasswordLength),
                    includeUppercase: includeUppercase,
                    includeLowercase: includeLowercase,
                    includeNumbers: includeNumbers,
                    includeSymbols: includeSymbols,
                    excludeAmbiguous: excludeAmbiguous,
                    baseCharSets: passedBaseCharSets, // Usar los charsets pasados
                    ambiguousChars: passedAmbiguousChars // Usar los caracteres ambiguos pasados
                });
            }
        }
        
        passwordsHtml += `<div>${generatedItem}</div>`;
        passwordsArray.push(generatedItem);
    }

    passwordResultEl.innerHTML = passwordsHtml;
    // La barra de fortaleza no tiene mucho sentido para un lote, así que la reseteamos o la dejamos vacía
    updateStrengthMeter("", isPassphraseMode, passphraseSeparator, null); // Pasamos null para strengthBarElement si no queremos que se actualice

    // Configurar el botón de descarga
    if (downloadBtn) {
        downloadBtn.style.display = "flex"; // Mostrar el botón de descarga
        downloadBtn.onclick = () => {
            downloadCSV(passwordsArray, isPassphraseMode);
        };
    } else {
        console.warn("El botón de descarga (downloadBtn) no fue encontrado.");
    }
}

/**
 * Función para descargar las contraseñas generadas en un archivo CSV.
 * (Esta función puede ser local dentro de batch-mode.js o exportada si la usas en otro lugar)
 * @param {Array<string>} passwords - Array de contraseñas a descargar.
 * @param {boolean} isPassphraseMode - Indica si las contraseñas son passphrases.
 */
function downloadCSV(passwords, isPassphraseMode) {
    const filename = `businesspass_${isPassphraseMode ? 'passphrases' : 'passwords'}_${new Date().toISOString().slice(0,10)}.csv`;
    const header = "Contraseña Generada\n";
    const csvContent = header + passwords.join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");

    if (link.download !== undefined) { // Feature detection para descargar
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log("Archivo CSV descargado.");
    } else {
        console.error("La descarga de archivos no es soportada en este navegador.");
        // Considerar un modal o mensaje en la UI en lugar de alert
        alert("Tu navegador no soporta la descarga automática. Por favor, copia las contraseñas manualmente.");
    }
}