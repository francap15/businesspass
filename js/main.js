// ===========================================
// js/main.js - Archivo principal de coordinación
// ===========================================

// Pertenece a: Utils
import { getRandomIndex } from './utils.js';

// Pertenece a: DOM Elements
import { DOM } from './dom-elements.js';

// Pertenece a: Data
import { baseCharSets, ambiguousChars, wordListES } from './data.js';

// Pertenece a: Modules
import { initNavbar } from './navbar.js';
import { generatePassword } from './password-generator.js';
import { generatePassphrase } from './passphrase-generator.js';
import { updateStrengthMeter } from './strength-meter.js';
import { handleBatchGeneration } from './batch-mode.js';
import { initDonationModal } from './modal-handler.js';
import { initCookieBanner } from './site-alerts.js';
import { initUIEnhancements } from './ui-enhancements.js';


// Pertenece a: Core / Lógica Principal de Generación
/**
 * Función principal que coordina la generación de contraseñas o passphrases,
 * ya sea de forma individual o en lote.
 */
function handleGeneration() {
    // Restaurar el estado del botón de copiar
    DOM.copyBtn.disabled = false;
    // Asegurarse de que el ícono de Font Awesome esté correctamente renderizado en el botón
    DOM.copyBtn.innerHTML = '<i class="far fa-copy"></i> Copiar';

    // Determinar la longitud efectiva según el modo activo
    // Asegurarse de que los elementos existan antes de acceder a ellos
    const effectiveLength = DOM.passphraseModeCheck && DOM.passphraseModeCheck.checked ?
        parseInt(DOM.passphraseLength.value) :
        parseInt(DOM.lengthSlider.value);

    // Si el modo lote está activo, delegar la generación a la función de lote
    if (DOM.batchModeCheck && DOM.batchModeCheck.checked) {
        handleBatchGeneration({
            batchSize: DOM.batchSizeInput.value,
            isPassphraseMode: DOM.passphraseModeCheck.checked,
            passphraseLength: DOM.passphraseLength.value,
            passphraseSeparator: DOM.passphraseSeparator.value,
            passphraseCapitalizeRandomly: DOM.passphraseCapitalizeRandomlyCheck.checked,
            passphraseIncludeNumbers: DOM.passphraseIncludeNumbersCheck.checked,
            passphraseIncludeSymbols: DOM.passphraseIncludeSymbolsCheck.checked,
            regularPasswordLength: DOM.lengthSlider.value,
            includeUppercase: DOM.uppercaseCheck.checked,
            includeLowercase: DOM.lowercaseCheck.checked,
            includeNumbers: DOM.numbersCheck.checked,
            includeSymbols: DOM.symbolsCheck.checked,
            excludeAmbiguous: DOM.excludeAmbiguousCheck.checked,
            passwordResultEl: DOM.passwordResultEl, // Pass reference to result element
            updateStrengthMeter: updateStrengthMeter, // Pass strength update function
            generatePassword: generatePassword, // Pass password generation function
            generatePassphrase: generatePassphrase, // Pass passphrase generation function
            wordListES: wordListES, // Pass word list
            baseCharSets: baseCharSets, // Pass charsets
            ambiguousChars: ambiguousChars, // Pass ambiguous characters
            downloadBtn: DOM.downloadBtn // Asegúrate de pasar el downloadBtn
        });
        // Después de la generación en lote, mostrar un mensaje genérico
        DOM.passwordResultEl.innerHTML = 'Contraseñas generadas. Descarga el CSV.'; // Mensaje actualizado
        updateStrengthMeter("", DOM.passphraseModeCheck.checked, DOM.passphraseSeparator.value, DOM.strengthBar); // Clear strength bar for batch
        return;
    }

    let generatedResult = ""; // Variable to store the generation result

    if (DOM.passphraseModeCheck && DOM.passphraseModeCheck.checked) {
        // Logic for generating a single passphrase
        generatedResult = generatePassphrase({
            length: effectiveLength,
            separator: DOM.passphraseSeparator.value,
            capitalizeRandomly: DOM.passphraseCapitalizeRandomlyCheck.checked,
            includeNumbers: DOM.passphraseIncludeNumbersCheck.checked,
            includeSymbols: DOM.passphraseIncludeSymbolsCheck.checked,
            wordList: wordListES, // Pass word list
            getRandomIndex: getRandomIndex // Pass random index function
        });
    } else {
        // Logic for generating a single regular password
        const includeUppercase = DOM.uppercaseCheck.checked;
        const includeLowercase = DOM.lowercaseCheck.checked;
        const includeNumbers = DOM.numbersCheck.checked;
        const includeSymbols = DOM.symbolsCheck.checked;
        const excludeAmbiguous = DOM.excludeAmbiguousCheck.checked;

        // Validate that at least one character type is selected
        if (!(includeUppercase || includeLowercase || includeNumbers || includeSymbols)) {
            DOM.passwordResultEl.textContent = "Selecciona al menos un tipo de carácter";
            updateStrengthMeter("", DOM.passphraseModeCheck.checked, DOM.passphraseSeparator.value, DOM.strengthBar);
            return;
        }

        generatedResult = generatePassword({
            length: effectiveLength,
            includeUppercase: includeUppercase,
            includeLowercase: includeLowercase,
            includeNumbers: includeNumbers,
            includeSymbols: includeSymbols,
            excludeAmbiguous: excludeAmbiguous,
            baseCharSets: baseCharSets, // Pass charsets
            ambiguousChars: ambiguousChars // Pass ambiguous characters
        });
    }

    // Display result and update strength bar for individual generation
    DOM.passwordResultEl.textContent = generatedResult;
    updateStrengthMeter(generatedResult, DOM.passphraseModeCheck.checked, DOM.passphraseSeparator.value, DOM.strengthBar);
}


// Pertenece a: Event Listeners / Coordinación Inicial
/**
 * Se ejecuta una vez que todo el DOM ha sido cargado.
 * Ahora que los componentes son estáticos, simplemente inicializa la lógica
 * de todos los módulos.
 */
document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar la lógica de los módulos de componentes comunes (navbar, modal, cookies)
    // Estos módulos deben manejar internamente la existencia de sus elementos.
    initNavbar();
    initDonationModal();
    initCookieBanner();
    initUIEnhancements();

    // Solo inicializar la lógica específica del generador de contraseñas
    // si sus elementos principales existen en la página.
    if (DOM.lengthSlider && DOM.generateBtn) { // Verifica si los elementos clave del generador existen
        // Configuración inicial de la interfaz del generador (texto de sliders, etc.)
        DOM.lengthValueEl.textContent = DOM.lengthSlider.value;

        // Solo intentar actualizar el valor de la passphrase si el control existe
        if (DOM.passphraseLengthValue && DOM.passphraseLength) {
            DOM.passphraseLengthValue.textContent = DOM.passphraseLength.value;
        }

        // Inicializa la barra de fuerza (puede ser llamada con string vacío si no hay password)
        updateStrengthMeter("", DOM.passphraseModeCheck?.checked || false, DOM.passphraseSeparator?.value || "", DOM.strengthBar);


        // ===============================================
        // Configuración de Event Listeners Centrales del Generador
        // ===============================================

        // Belongs to: Event Listeners / Password Generator (Length Slider)
        DOM.lengthSlider.addEventListener("input", () => {
            DOM.lengthValueEl.textContent = DOM.lengthSlider.value;
            if (
                DOM.passwordResultEl.textContent !== 'Presiona "Generar..."' &&
                DOM.passwordResultEl.textContent !== "Selecciona al menos un tipo de carácter" &&
                DOM.passwordResultEl.textContent !== 'Contraseñas generadas. Descarga el CSV.' // Añadido para no regenerar en modo lote
            ) {
                handleGeneration();
            }
        });

        // Belongs to: Event Listeners / Batch Mode (Checkbox)
        if (DOM.batchModeCheck) { // Check if batchModeCheck exists
            DOM.batchModeCheck.addEventListener("change", () => {
                DOM.batchControlsEl.classList.toggle("show", DOM.batchModeCheck.checked);
                // El botón de descarga ahora se muestra/oculta en el CSS, pero el JS maneja el display para flexibilidad
                DOM.downloadBtn.style.display = DOM.batchModeCheck.checked ? "flex" : "none";

                // Ajustar texto del botón según los modos activos
                if (DOM.batchModeCheck.checked) {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
                } else if (DOM.passphraseModeCheck && DOM.passphraseModeCheck.checked) {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase';
                } else {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
                }

                DOM.passwordResultEl.innerHTML = 'Presiona "Generar..."'; // Reset result area
                updateStrengthMeter("", DOM.passphraseModeCheck?.checked || false, DOM.passphraseSeparator?.value || "", DOM.strengthBar); // Reset strength bar
            });
        }

        // Belongs to: Event Listeners / Generate Button
        DOM.generateBtn.addEventListener("click", handleGeneration);

        // Belongs to: Event Listeners / Copy Button
        DOM.copyBtn.addEventListener("click", () => {
            // Se usa textContent para obtener el texto plano, lo cual es útil si hay HTML dentro (como en el modo lote)
            let textToCopy;
            if (DOM.batchModeCheck && DOM.batchModeCheck.checked) {
                // Si es modo lote, extraer el texto de cada div y unirlos por nueva línea
                const passwords = Array.from(DOM.passwordResultEl.children).map(div => div.textContent);
                textToCopy = passwords.join('\n');
            } else {
                textToCopy = DOM.passwordResultEl.textContent;
            }


            if (
                textToCopy &&
                textToCopy !== 'Presiona "Generar..."' &&
                textToCopy !== "Selecciona al menos un tipo de carácter" &&
                textToCopy !== 'Contraseñas generadas. Descarga el CSV.' // Ignorar este mensaje
            ) {
                navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => {
                        const originalIcon = DOM.copyBtn.innerHTML;
                        DOM.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                        DOM.copyBtn.classList.add("copied");
                        DOM.copyBtn.disabled = true;
                        setTimeout(() => {
                            DOM.copyBtn.innerHTML = originalIcon;
                            DOM.copyBtn.classList.remove("copied");
                            DOM.copyBtn.disabled = false;
                        }, 2000);
                    })
                    .catch((err) => {
                        console.error("Error al copiar: ", err);
                        // No usar alert(), muestra un mensaje en la UI si es posible
                        DOM.passwordResultEl.textContent = "Error al copiar. Por favor, copia manualmente.";
                    });
            }
        });

        // Belongs to: Event Listeners / Regular Password Checkboxes
        [
            DOM.uppercaseCheck,
            DOM.lowercaseCheck,
            DOM.numbersCheck,
            DOM.symbolsCheck,
            DOM.excludeAmbiguousCheck
        ].forEach((checkbox) => {
            if (checkbox) { // Asegurarse de que el checkbox existe
                checkbox.addEventListener("change", () => {
                    // Solo regenerar si no estamos en modo lote y el contenido no es un mensaje inicial/error
                    if (
                        !(DOM.batchModeCheck && DOM.batchModeCheck.checked) &&
                        DOM.passwordResultEl.textContent !== 'Presiona "Generar..."' &&
                        DOM.passwordResultEl.textContent !== "Selecciona al menos un tipo de carácter"
                    ) {
                        handleGeneration();
                    }
                });
            }
        });

        // Belongs to: Event Listeners / Passphrase Mode (Checkbox)
        if (DOM.passphraseModeCheck) { // Check if passphraseModeCheck exists
            DOM.passphraseModeCheck.addEventListener("change", (e) => {
                const isPassphraseMode = e.target.checked;

                DOM.passphraseControls.classList.toggle("show", isPassphraseMode);

                DOM.regularPasswordOptionsDiv.style.display = isPassphraseMode ? "none" : "grid";
                DOM.passphraseExplanationDiv.style.display = isPassphraseMode ? "block" : "none";

                // Ajustar min/max/current values of length slider based on mode
                if (isPassphraseMode) {
                    DOM.lengthSlider.min = 3;
                    DOM.lengthSlider.max = 10;
                    if (DOM.passphraseLength) { // Check before accessing
                        DOM.lengthSlider.value = DOM.passphraseLength.value; // Sync with passphrase length slider
                    }
                } else {
                    DOM.lengthSlider.min = 8;
                    DOM.lengthSlider.max = 64;
                    DOM.lengthSlider.value = 16; // Reset to default password length
                }
                DOM.lengthValueEl.textContent = DOM.lengthSlider.value; // Update length display

                // Ajustar controles de lote y texto del botón de generar
                if (DOM.batchModeCheck.checked) {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
                } else if (isPassphraseMode) {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase';
                } else {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
                }

                DOM.passwordResultEl.innerHTML = 'Presiona "Generar..."'; // Reset result area
                updateStrengthMeter("", isPassphraseMode, DOM.passphraseSeparator?.value || "", DOM.strengthBar); // Reset strength bar

                if (isPassphraseMode) {
                    handleGeneration(); // Generate a passphrase immediately when mode is activated
                }
            });
        }

        // Belongs to: Event Listeners / Passphrase Controls (Length Slider)
        if (DOM.passphraseLength) { // Check if passphraseLength exists
            DOM.passphraseLength.addEventListener("input", (e) => {
                DOM.passphraseLengthValue.textContent = e.target.value;
                DOM.lengthSlider.value = e.target.value; // Keep main length slider synced
                DOM.lengthValueEl.textContent = e.target.value; // Update main length display
                if (DOM.passphraseModeCheck.checked) {
                    handleGeneration();
                }
            });
        }

        // Belongs to: Event Listeners / Passphrase Controls (Separator)
        if (DOM.passphraseSeparator) { // Check if passphraseSeparator exists
            DOM.passphraseSeparator.addEventListener("change", () => {
                if (DOM.passphraseModeCheck.checked) {
                    handleGeneration();
                }
            });
        }

        // Belongs to: Event Listeners / Advanced Passphrase Options (Checkboxes)
        [
            DOM.passphraseCapitalizeRandomlyCheck,
            DOM.passphraseIncludeNumbersCheck,
            DOM.passphraseIncludeSymbolsCheck
        ].forEach((checkbox) => {
            if (checkbox) { // Asegurarse de que el checkbox existe
                checkbox.addEventListener("change", () => {
                    if (DOM.passphraseModeCheck.checked) { // Solo regenerar si estamos en modo passphrase
                        handleGeneration();
                    }
                });
            }
        });

    }

});
