// ===========================================
// js/main.js - Archivo principal de coordinación
// ===========================================

// Pertenece a: Utils
// Mantén getRandomIndex, ya que es una utilidad general.
import { getRandomIndex } from './utils.js';

// Pertenece a: DOM Elements
// Importamos la colección de elementos del DOM estáticos de la página principal.
import { DOM } from './dom-elements.js';

// Pertenece a: Data
// Importamos los conjuntos de datos (listas de palabras, charsets).
import { baseCharSets, ambiguousChars, wordListES } from './data.js';

// Pertenece a: Modules
// Importamos las funciones de inicialización y lógica de cada módulo.
import { initNavbar } from './navbar.js';
import { generatePassword } from './password-generator.js';
import { generatePassphrase } from './passphrase-generator.js';
import { updateStrengthMeter } from './strength-meter.js';
import { handleBatchGeneration } from './batch-mode.js';
import { initDonationModal } from './modal-handler.js';
import { initCookieBanner } from './cookie-banner.js';
import { initUIEnhancements } from './ui-enhancements.js';


// Pertenece a: Core / Lógica Principal de Generación
/**
 * Función principal que coordina la generación de contraseñas o passphrases,
 * ya sea de forma individual o en lote.
 */
function handleGeneration() {
    // Restore copy button state
    DOM.copyBtn.disabled = false;
    DOM.copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar';

    // Determine the effective length based on the active mode
    const effectiveLength = DOM.passphraseModeCheck.checked ?
        parseInt(DOM.passphraseLength.value) :
        parseInt(DOM.lengthSlider.value);

    // If batch mode is active, delegate generation to the batch function
    if (DOM.batchModeCheck.checked) {
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
            ambiguousChars: ambiguousChars // Pass ambiguous characters
        });
        // After batch generation, display a generic message
        DOM.passwordResultEl.innerHTML = 'Contraseñas generadas en archivo.';
        updateStrengthMeter("", DOM.passphraseModeCheck.checked, DOM.passphraseSeparator.value, DOM.strengthBar); // Clear strength bar for batch
        return;
    }

    let generatedResult = ""; // Variable to store the generation result

    if (DOM.passphraseModeCheck.checked) {
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
    // Ya no cargamos componentes HTML dinámicamente aquí, se asume que están en el HTML.
    // remove loadHTMLComponent import and the Promise.all for loading components

    // Inicializar la lógica de cada módulo
    // Estas funciones ahora asumirán que sus elementos DOM ya existen en el HTML.
    initNavbar();
    initDonationModal();
    initCookieBanner();
    initUIEnhancements();

    // Initial UI setup (slider text, etc.)
    DOM.lengthValueEl.textContent = DOM.lengthSlider.value;
    DOM.passphraseLengthValue.textContent = DOM.passphraseLength.value;
    updateStrengthMeter("", DOM.passphraseModeCheck.checked, DOM.passphraseSeparator.value, DOM.strengthBar); // Initialize strength bar

    // ===============================================
    // Central Event Listeners Configuration
    // ===============================================

    // Belongs to: Event Listeners / Password Generator (Length Slider)
    DOM.lengthSlider.addEventListener("input", () => {
        DOM.lengthValueEl.textContent = DOM.lengthSlider.value;
        if (
            DOM.passwordResultEl.textContent !== 'Presiona "Generar..."' &&
            DOM.passwordResultEl.textContent !== "Selecciona al menos un tipo de carácter"
        ) {
            handleGeneration();
        }
    });

    // Belongs to: Event Listeners / Batch Mode (Checkbox)
    DOM.batchModeCheck.addEventListener("change", () => {
        DOM.batchControlsEl.classList.toggle("show", DOM.batchModeCheck.checked);
        DOM.downloadBtn.style.display = DOM.batchModeCheck.checked ? "flex" : "none";

        // Adjust button text based on active modes
        if (DOM.batchModeCheck.checked) {
            DOM.generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
        } else if (DOM.passphraseModeCheck.checked) {
            DOM.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase';
        } else {
            DOM.generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
        }

        DOM.passwordResultEl.innerHTML = 'Presiona "Generar..."'; // Reset result area
        updateStrengthMeter("", DOM.passphraseModeCheck.checked, DOM.passphraseSeparator.value, DOM.strengthBar); // Reset strength bar
    });

    // Belongs to: Event Listeners / Generate Button
    DOM.generateBtn.addEventListener("click", handleGeneration);

    // Belongs to: Event Listeners / Copy Button
    DOM.copyBtn.addEventListener("click", () => {
        const textToCopy = DOM.passwordResultEl.innerText;
        if (
            textToCopy &&
            textToCopy !== 'Presiona "Generar..."' &&
            textToCopy !== "Selecciona al menos un tipo de carácter"
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
                    DOM.passwordResultEl.textContent = "Error al copiar.";
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
        checkbox.addEventListener("change", () => {
            if (
                DOM.passwordResultEl.textContent !== 'Presiona "Generar..."' &&
                DOM.passwordResultEl.textContent !== "Selecciona al menos un tipo de carácter"
            ) {
                handleGeneration();
            }
        });
    });

    // Belongs to: Event Listeners / Passphrase Mode (Checkbox)
    DOM.passphraseModeCheck.addEventListener("change", (e) => {
        const isPassphraseMode = e.target.checked;

        DOM.passphraseControls.classList.toggle("show", isPassphraseMode);

        DOM.regularPasswordOptionsDiv.style.display = isPassphraseMode ? "none" : "grid";
        DOM.passphraseExplanationDiv.style.display = isPassphraseMode ? "block" : "none";

        // Adjust min/max/current values of length slider based on mode
        if (isPassphraseMode) {
            DOM.lengthSlider.min = 3;
            DOM.lengthSlider.max = 10;
            DOM.lengthSlider.value = DOM.passphraseLength.value; // Sync with passphrase length slider
        } else {
            DOM.lengthSlider.min = 8;
            DOM.lengthSlider.max = 64;
            DOM.lengthSlider.value = 16; // Reset to default password length
        }
        DOM.lengthValueEl.textContent = DOM.lengthSlider.value; // Update length display

        // Adjust batch controls and generate button text
        if (DOM.batchModeCheck.checked) {
            DOM.generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
        } else if (isPassphraseMode) {
            DOM.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase';
        } else {
            DOM.generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
        }

        DOM.passwordResultEl.innerHTML = 'Presiona "Generar..."'; // Reset result area
        updateStrengthMeter("", isPassphraseMode, DOM.passphraseSeparator.value, DOM.strengthBar); // Reset strength bar

        if (isPassphraseMode) {
            handleGeneration(); // Generate a passphrase immediately when mode is activated
        }
    });

    // Belongs to: Event Listeners / Passphrase Controls (Length Slider)
    DOM.passphraseLength.addEventListener("input", (e) => {
        DOM.passphraseLengthValue.textContent = e.target.value;
        DOM.lengthSlider.value = e.target.value; // Keep main length slider synced
        DOM.lengthValueEl.textContent = e.target.value; // Update main length display
        if (DOM.passphraseModeCheck.checked) {
            handleGeneration();
        }
    });

    // Belongs to: Event Listeners / Passphrase Controls (Separator)
    DOM.passphraseSeparator.addEventListener("change", () => {
        if (DOM.passphraseModeCheck.checked) {
            handleGeneration();
        }
    });

    // Belongs to: Event Listeners / Advanced Passphrase Options (Checkboxes)
    [
        DOM.passphraseCapitalizeRandomlyCheck,
        DOM.passphraseIncludeNumbersCheck,
        DOM.passphraseIncludeSymbolsCheck
    ].forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            if (DOM.passphraseModeCheck.checked) { // Only regenerate if in passphrase mode
                handleGeneration();
            }
        });
    });
});