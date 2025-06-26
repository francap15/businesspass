// ===========================================
// js/dom-elements.js - Referencias a elementos del DOM (Estáticos)
// ===========================================

// Centraliza las referencias a los elementos del DOM que están
// ESTÁTICAMENTE presentes en el HTML principal (index.html, etc.).
// Estos elementos existen en el DOM desde el momento en que se carga la página.
export const DOM = {
    // Password Generator Elements (estos IDs no cambian en esta iteración)
    lengthSlider: document.getElementById("length-slider"),
    lengthValueEl: document.getElementById("length-value"),
    generateBtn: document.getElementById("generate-btn"),
    passwordResultEl: document.getElementById("password-result"),
    copyBtn: document.getElementById("copy-btn"),
    strengthBar: document.getElementById("strength-bar"),

    // Regular Password Checkboxes (estos IDs no cambian en esta iteración)
    uppercaseCheck: document.getElementById("uppercase"),
    lowercaseCheck: document.getElementById("lowercase"),
    numbersCheck: document.getElementById("numbers"),
    symbolsCheck: document.getElementById("symbols"),
    excludeAmbiguousCheck: document.getElementById("exclude-ambiguous"),

    // Passphrase Mode Elements (estos IDs no cambian en esta iteración)
    passphraseModeCheck: document.getElementById("passphrase-mode"),
    passphraseControls: document.getElementById("passphrase-controls"),
    passphraseLength: document.getElementById("passphrase-length"),
    passphraseLengthValue: document.getElementById("passphrase-length-value"),
    passphraseSeparator: document.getElementById("passphrase-separator"),

    // Advanced Passphrase Options (estos IDs no cambian en esta iteración)
    passphraseCapitalizeRandomlyCheck: document.getElementById("passphrase-capitalize-randomly"),
    passphraseIncludeNumbersCheck: document.getElementById("passphrase-include-numbers"),
    passphraseIncludeSymbolsCheck: document.getElementById("passphrase-include-symbols"),

    // Batch Mode Elements (estos IDs no cambian en esta iteración)
    batchModeCheck: document.getElementById("batch-mode"),
    batchControlsEl: document.getElementById("batch-controls"),
    batchSizeInput: document.getElementById("batch-size"),
    downloadBtn: document.getElementById("download-btn"),

    // Visibility Control Elements (estos IDs no cambian en esta iteración)
    regularPasswordOptionsDiv: document.getElementById("regular-password-options"),
    passphraseExplanationDiv: document.getElementById("passphrase-explanation"),

    // Navbar Elements (se acceden directamente ya que son estáticos y relevantes para el JS de la navbar)
    navBar: document.querySelector(".app-nav-bar"),
    navToggleBtn: document.querySelector(".nav-toggle-btn"),
    navList: document.querySelector(".nav-list"),

    // Donation Modal Elements (IDs renombrados)
    // Cambiado de "donationModal" a "support-dialog-box"
    supportDialog: document.getElementById("support-dialog-box"), 
    // Cambiado de "support-link" a "support-project-link" (ya lo tenías así, se mantiene)
    supportLink: document.getElementById("support-project-link"), 
    modalCloseButton: document.querySelector(".modal-close-button"),

    // Cookie Banner Elements (IDs renombrados)
    // Cambiado de "cookieBanner" a "app-alert-panel"
    alertPanel: document.getElementById("app-alert-panel"), 
    // Cambiado de "acceptCookies" a "panel-confirm-btn"
    panelConfirmBtn: document.getElementById("panel-confirm-btn"), 
};
