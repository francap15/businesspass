// ===========================================
// js/dom-elements.js - Referencias a elementos del DOM
// ===========================================

// Este módulo centraliza todas las referencias a los elementos del DOM
// para evitar repeticiones y hacer el código más mantenible.

export const DOM = {
    // Navbar
    navbarToggler: document.querySelector('.nav-toggle-btn'),
    navbarMenu: document.querySelector('.nav-list'),

    // Generador de Contraseñas (Controles Principales)
    lengthSlider: document.getElementById('length-slider'),
    lengthValueEl: document.getElementById('length-value'),
    generateBtn: document.getElementById('generate-btn'),
    passwordResultEl: document.getElementById('password-result'), 
    strengthBar: document.getElementById('strength-bar'),
    copyBtn: document.getElementById('copy-btn'),
    downloadBtn: document.getElementById('download-btn'),

    // Opciones de Contraseña Regular
    regularPasswordOptionsDiv: document.getElementById('regular-password-options'), 
    uppercaseCheck: document.getElementById('uppercase'),
    lowercaseCheck: document.getElementById('lowercase'),
    numbersCheck: document.getElementById('numbers'),
    symbolsCheck: document.getElementById('symbols'),
    excludeAmbiguousCheck: document.getElementById('exclude-ambiguous'),

    // Modo Passphrase
    passphraseModeCheck: document.getElementById('passphrase-mode'), 
    passphraseControls: document.getElementById('passphrase-controls'), 
    passphraseExplanationDiv: document.getElementById('passphrase-explanation'), 
    passphraseLength: document.getElementById('passphrase-length'), 
    passphraseLengthValue: document.getElementById('passphrase-length-value'), 
    passphraseSeparator: document.getElementById('passphrase-separator'), 
    passphraseCapitalizeRandomlyCheck: document.getElementById('passphrase-capitalize-randomly'),
    passphraseIncludeNumbersCheck: document.getElementById('passphrase-include-numbers'),
    passphraseIncludeSymbolsCheck: document.getElementById('passphrase-include-symbols'),

    // Modo Lote (Batch Mode)
    batchModeCheck: document.getElementById('batch-mode'),
    batchControlsEl: document.getElementById('batch-controls'), 
    batchSizeInput: document.getElementById('batch-size'), 

    // Modal de Apoyo al Proyecto
    projectSupportLink: document.getElementById('support-project-link'), 
    supportDialog: document.getElementById('support-dialog-box'), 
    modalCloseButton: document.querySelector('.modal-close-button'), 

    // Banner de Cookies
    alertPanel: document.getElementById('site-info-panel'), 
    panelConfirmBtn: document.getElementById('panel-confirm-btn'), 
};

// DEBUGGING: Imprimir el valor de projectSupportLink después de la asignación
console.log("DOM.projectSupportLink en dom-elements.js:", DOM.projectSupportLink);