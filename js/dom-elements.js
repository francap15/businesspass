// ===========================================
// js/dom-elements.js - Referencias a elementos del DOM (Estáticos)
// ===========================================

// Centraliza las referencias a los elementos del DOM que están
// ESTÁTICAMENTE presentes en el HTML principal (index.html, etc.).
// Estos elementos existen en el DOM desde el momento en que se carga la página.
export const DOM = {
    // Password Generator Elements
    lengthSlider: document.getElementById("length-slider"),
    lengthValueEl: document.getElementById("length-value"),
    generateBtn: document.getElementById("generate-btn"),
    passwordResultEl: document.getElementById("password-result"),
    copyBtn: document.getElementById("copy-btn"),
    strengthBar: document.getElementById("strength-bar"),

    // Regular Password Checkboxes
    uppercaseCheck: document.getElementById("uppercase"),
    lowercaseCheck: document.getElementById("lowercase"),
    numbersCheck: document.getElementById("numbers"),
    symbolsCheck: document.getElementById("symbols"),
    excludeAmbiguousCheck: document.getElementById("exclude-ambiguous"),

    // Passphrase Mode Elements
    passphraseModeCheck: document.getElementById("passphrase-mode"),
    passphraseControls: document.getElementById("passphrase-controls"),
    passphraseLength: document.getElementById("passphrase-length"),
    passphraseLengthValue: document.getElementById("passphrase-length-value"),
    passphraseSeparator: document.getElementById("passphrase-separator"),

    // Advanced Passphrase Options
    passphraseCapitalizeRandomlyCheck: document.getElementById("passphrase-capitalize-randomly"),
    passphraseIncludeNumbersCheck: document.getElementById("passphrase-include-numbers"),
    passphraseIncludeSymbolsCheck: document.getElementById("passphrase-include-symbols"),

    // Batch Mode Elements
    batchModeCheck: document.getElementById("batch-mode"),
    batchControlsEl: document.getElementById("batch-controls"),
    batchSizeInput: document.getElementById("batch-size"),
    downloadBtn: document.getElementById("download-btn"),

    // Visibility Control Elements
    regularPasswordOptionsDiv: document.getElementById("regular-password-options"),
    passphraseExplanationDiv: document.getElementById("passphrase-explanation"),

    // NOTA: Elementos como la navbar, modal de donaciones y banner de cookies
    // NO se incluyen aquí porque se cargan dinámicamente.
    // Sus referencias se obtendrán dentro de sus respectivas funciones de inicialización
    // (ej. `initNavbar`, `initDonationModal`) después de que se hayan insertado en el DOM.
};