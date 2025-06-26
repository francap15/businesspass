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
import { initProjectSupportModal } from './modal-handler.js';
import { initCookieBanner } from './site-alerts.js';
import { initUIEnhancements } from './ui-enhancements.js';


// Pertenece a: Core / Lógica Principal de Generación
/**
 * Función principal que coordina la generación de contraseñas o passphrases,
 * ya sea de forma individual o en lote.
 */
function handleGeneration() {
    console.log("handleGeneration ejecutada."); // Debugging
    // Restaurar el estado del botón de copiar
    DOM.copyBtn.disabled = false;
    DOM.copyBtn.innerHTML = '<i class="far fa-copy"></i> Copiar';

    // Determinar la longitud efectiva según el modo activo
    const effectiveLength = DOM.passphraseModeCheck && DOM.passphraseModeCheck.checked ?
        parseInt(DOM.passphraseLength.value) :
        parseInt(DOM.lengthSlider.value);

    // Si el modo lote está activo, delegar la generación a la función de lote
    if (DOM.batchModeCheck && DOM.batchModeCheck.checked) {
        console.log("Modo Lote activado. Llamando a handleBatchGeneration."); // Debugging
        
        // El handleBatchGeneration ya limpia el passwordResultEl, así que no es necesario aquí.
        // DOM.passwordResultEl.innerHTML = ''; // Eliminada, ya la maneja batch-mode.js
        
        handleBatchGeneration({
            batchSize: DOM.batchSizeInput.value,
            isPassphraseMode: DOM.passphraseModeCheck.checked,
            passphraseLength: DOM.passphraseLength?.value,
            passphraseSeparator: DOM.passphraseSeparator?.value,
            passphraseCapitalizeRandomly: DOM.passphraseCapitalizeRandomlyCheck?.checked,
            passphraseIncludeNumbers: DOM.passphraseIncludeNumbersCheck?.checked,
            passphraseIncludeSymbols: DOM.passphraseIncludeSymbolsCheck?.checked,
            regularPasswordLength: DOM.lengthSlider.value,
            includeUppercase: DOM.uppercaseCheck?.checked,
            includeLowercase: DOM.lowercaseCheck?.checked,
            includeNumbers: DOM.numbersCheck?.checked,
            includeSymbols: DOM.symbolsCheck?.checked,
            excludeAmbiguous: DOM.excludeAmbiguousCheck?.checked,
            passwordResultEl: DOM.passwordResultEl,
            updateStrengthMeter: updateStrengthMeter,
            generatePassword: generatePassword,
            generatePassphrase: generatePassphrase,
            wordListES: wordListES,
            baseCharSets: baseCharSets,
            ambiguousChars: ambiguousChars,
            downloadBtn: DOM.downloadBtn
        });
        
        // Después de la generación en lote, mostrar un mensaje informativo en el output
        // (ya que handleBatchGeneration llena el passwordResultEl con las contraseñas)
        // Puedes cambiar este mensaje a algo más descriptivo si lo necesitas.
        // Si ya estás mostrando las contraseñas en batchMode, este mensaje podría ser redundante
        // o mejorarlo para que indique que se han generado y se pueden descargar.
        DOM.passwordResultEl.innerHTML += '<p class="small-info-text text-center mt-3">¡Lote generado! Desplázate para ver y haz clic en "Descargar CSV".</p>';
        updateStrengthMeter("", DOM.passphraseModeCheck?.checked || false, DOM.passphraseSeparator?.value || "", DOM.strengthBar); // Limpiar barra de fuerza para lote
        return;
    }

    let generatedResult = ""; // Variable para almacenar el resultado de la generación

    if (DOM.passphraseModeCheck && DOM.passphraseModeCheck.checked) {
        console.log("Modo Passphrase activado. Generando una sola passphrase."); // Debugging
        // Lógica para generar una sola passphrase
        generatedResult = generatePassphrase({
            length: effectiveLength,
            separator: DOM.passphraseSeparator?.value,
            capitalizeRandomly: DOM.passphraseCapitalizeRandomlyCheck?.checked,
            includeNumbers: DOM.passphraseIncludeNumbersCheck?.checked,
            includeSymbols: DOM.passphraseIncludeSymbolsCheck?.checked,
            wordList: wordListES,
            getRandomIndex: getRandomIndex
        });
        // Si no es modo lote, asegúrate de que el resultado se muestre y el botón de descarga se oculte.
        DOM.passwordResultEl.textContent = generatedResult;
        DOM.downloadBtn.style.display = "none";

    } else {
        console.log("Modo Contraseña regular activado. Generando una sola contraseña."); // Debugging
        // Lógica para generar una sola contraseña regular
        const includeUppercase = DOM.uppercaseCheck?.checked;
        const includeLowercase = DOM.lowercaseCheck?.checked;
        const includeNumbers = DOM.numbersCheck?.checked;
        const includeSymbols = DOM.symbolsCheck?.checked;
        const excludeAmbiguous = DOM.excludeAmbiguousCheck?.checked;

        // Validar que al menos un tipo de carácter esté seleccionado
        if (!(includeUppercase || includeLowercase || includeNumbers || includeSymbols)) {
            DOM.passwordResultEl.textContent = "Selecciona al menos un tipo de carácter";
            updateStrengthMeter("", DOM.passphraseModeCheck?.checked || false, DOM.passphraseSeparator?.value || "", DOM.strengthBar);
            return;
        }

        generatedResult = generatePassword({
            length: effectiveLength,
            includeUppercase: includeUppercase,
            includeLowercase: includeLowercase,
            includeNumbers: includeNumbers,
            includeSymbols: includeSymbols,
            excludeAmbiguous: excludeAmbiguous,
            baseCharSets: baseCharSets,
            ambiguousChars: ambiguousChars
        });
        // Si no es modo lote, asegúrate de que el resultado se muestre y el botón de descarga se oculte.
        DOM.passwordResultEl.textContent = generatedResult;
        DOM.downloadBtn.style.display = "none";
    }

    // Mostrar el resultado y actualizar la barra de fuerza para la generación individual
    // Estas líneas se han movido dentro de los bloques if/else para asegurar que el DOM.passwordResultEl.textContent
    // no se sobreescriba incorrectamente si estamos en modo lote, donde passwordResultEl.innerHTML ya es manipulado.
    // updateStrengthMeter(generatedResult, DOM.passphraseModeCheck?.checked || false, DOM.passphraseSeparator?.value || "", DOM.strengthBar);
    
    // updateStrengthMeter SIEMPRE debe recibir DOM.strengthBar, no null, si queremos que funcione.
    updateStrengthMeter(generatedResult, DOM.passphraseModeCheck?.checked || false, DOM.passphraseSeparator?.value || "", DOM.strengthBar);

    // Ocultar el botón de descarga si no estamos en modo lote y se generó una sola contraseña
    // Esta línea también se ha movido dentro de los bloques if/else para mayor claridad.
    // if (!(DOM.batchModeCheck && DOM.batchModeCheck.checked)) {
    //     DOM.downloadBtn.style.display = "none";
    // }
}


// Pertenece a: Event Listeners / Coordinación Inicial
/**
 * Se ejecuta una vez que todo el DOM ha sido cargado.
 * Ahora que los componentes son estáticos, simplemente inicializa la lógica
 * de todos los módulos.
 */
document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded: Inicializando BusinessPass."); // Debugging
    // Inicializar la lógica de los módulos de componentes comunes (navbar, modal, cookies)
    initNavbar();
    initProjectSupportModal();
    initCookieBanner();
    initUIEnhancements();

    // Solo inicializar la lógica específica del generador de contraseñas
    // si sus elementos principales existen en la página.
    if (DOM.lengthSlider && DOM.generateBtn) {
        console.log("Elementos del generador encontrados. Configurando UI inicial."); // Debugging
        // Configuración inicial de la interfaz del generador (texto de sliders, etc.)
        DOM.lengthValueEl.textContent = DOM.lengthSlider.value;

        // Solo intentar actualizar el valor de la passphrase si el control existe
        if (DOM.passphraseLengthValue && DOM.passphraseLength) {
            DOM.passphraseLengthValue.textContent = DOM.passphraseLength.value;
        }

        // Inicializa la barra de fuerza (puede ser llamada con string vacío si no hay password)
        updateStrengthMeter("", DOM.passphraseModeCheck?.checked || false, DOM.passphraseSeparator?.value || "", DOM.strengthBar);

        // Ocultar el botón de descarga al cargar la página si no está en modo lote
        DOM.downloadBtn.style.display = "none";
        
        // ===============================================
        // Configuración de Event Listeners Centrales del Generador
        // ===============================================

        // Belongs to: Event Listeners / Password Generator (Length Slider)
        DOM.lengthSlider.addEventListener("input", () => {
            DOM.lengthValueEl.textContent = DOM.lengthSlider.value;
            // Solo regenerar si no estamos en modo lote y el contenido no es un mensaje inicial/error
            // Añadido para no regenerar en modo lote o si hay mensaje informativo.
            if (
                !(DOM.batchModeCheck && DOM.batchModeCheck.checked) &&
                DOM.passwordResultEl.textContent !== 'Presiona "Generar..."' &&
                DOM.passwordResultEl.textContent !== "Selecciona al menos un tipo de carácter" &&
                DOM.passwordResultEl.textContent.indexOf('¡Lote generado!') === -1 // Evitar regenerar en modo lote
            ) {
                handleGeneration();
            }
        });

        // Belongs to: Event Listeners / Batch Mode (Checkbox)
        if (DOM.batchModeCheck) {
            DOM.batchModeCheck.addEventListener("change", () => {
                console.log("Modo Lote checkbox cambiado. checked:", DOM.batchModeCheck.checked); // Debugging
                DOM.batchControlsEl.classList.toggle("show", DOM.batchModeCheck.checked);
                // El botón de descarga ahora se muestra/oculta aquí de forma explícita
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
                textToCopy.indexOf('¡Lote generado!') === -1 // Ignorar este mensaje para copiar si es el mensaje del lote
            ) {
                // Usar execCommand('copy') como fallback para entornos como iframes donde navigator.clipboard puede fallar
                try {
                    const tempTextArea = document.createElement('textarea');
                    tempTextArea.value = textToCopy;
                    document.body.appendChild(tempTextArea);
                    tempTextArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempTextArea);

                    const originalIcon = DOM.copyBtn.innerHTML;
                    DOM.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                    DOM.copyBtn.classList.add("copied");
                    DOM.copyBtn.disabled = true;
                    setTimeout(() => {
                        DOM.copyBtn.innerHTML = originalIcon;
                        DOM.copyBtn.classList.remove("copied");
                        DOM.copyBtn.disabled = false;
                    }, 2000);
                } catch (err) {
                    console.error("Error al copiar usando execCommand: ", err);
                    if (navigator.clipboard) {
                        navigator.clipboard.writeText(textToCopy)
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
                            .catch((clipErr) => {
                                console.error("Error al copiar usando navigator.clipboard: ", clipErr);
                                DOM.passwordResultEl.textContent = "Error al copiar. Por favor, copia manualmente.";
                            });
                    } else {
                        DOM.passwordResultEl.textContent = "Error al copiar. Tu navegador no soporta la copia automática. Por favor, copia manualmente.";
                    }
                }
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
            if (checkbox) {
                checkbox.addEventListener("change", () => {
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
        if (DOM.passphraseModeCheck) {
            DOM.passphraseModeCheck.addEventListener("change", (e) => {
                console.log("Modo Passphrase checkbox cambiado. checked:", e.target.checked); // Debugging
                const isPassphraseMode = e.target.checked;

                DOM.passphraseControls.classList.toggle("show", isPassphraseMode);

                DOM.regularPasswordOptionsDiv.style.display = isPassphraseMode ? "none" : "grid";
                DOM.passphraseExplanationDiv.style.display = isPassphraseMode ? "block" : "none";

                // Ajustar min/max/current values of length slider based on mode
                if (isPassphraseMode) {
                    DOM.lengthSlider.min = 3;
                    DOM.lengthSlider.max = 10;
                    if (DOM.passphraseLength) {
                        DOM.lengthSlider.value = DOM.passphraseLength.value;
                    }
                } else {
                    DOM.lengthSlider.min = 8;
                    DOM.lengthSlider.max = 64;
                    DOM.lengthSlider.value = 16;
                }
                DOM.lengthValueEl.textContent = DOM.lengthSlider.value;

                // Ajustar controles de lote y texto del botón de generar
                if (DOM.batchModeCheck?.checked) {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
                } else if (isPassphraseMode) {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase';
                } else {
                    DOM.generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
                }

                DOM.passwordResultEl.innerHTML = 'Presiona "Generar..."';
                updateStrengthMeter("", isPassphraseMode, DOM.passphraseSeparator?.value || "", DOM.strengthBar);

                if (isPassphraseMode && !(DOM.batchModeCheck?.checked)) {
                    handleGeneration();
                }
            });
        }

        // Belongs to: Event Listeners / Passphrase Controls (Length Slider)
        if (DOM.passphraseLength) {
            DOM.passphraseLength.addEventListener("input", (e) => {
                DOM.passphraseLengthValue.textContent = e.target.value;
                DOM.lengthSlider.value = e.target.value;
                DOM.lengthValueEl.textContent = e.target.value;
                if (DOM.passphraseModeCheck?.checked && !(DOM.batchModeCheck && DOM.batchModeCheck.checked)) {
                    handleGeneration();
                }
            });
        }

        // Belongs to: Event Listeners / Passphrase Controls (Separator)
        if (DOM.passphraseSeparator) {
            DOM.passphraseSeparator.addEventListener("change", () => {
                if (DOM.passphraseModeCheck?.checked && !(DOM.batchModeCheck && DOM.batchModeCheck.checked)) {
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
            if (checkbox) {
                checkbox.addEventListener("change", () => {
                    if (DOM.passphraseModeCheck?.checked && !(DOM.batchModeCheck && DOM.batchModeCheck.checked)) {
                        handleGeneration();
                    }
                });
            }
        });

    }

});