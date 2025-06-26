// ===========================================
// js/strength-meter.js - Lógica de la barra de fortaleza
// ===========================================

/**
 * Actualiza la barra de fortaleza de la contraseña o passphrase.
 * @param {string} generatedPassword - La contraseña o passphrase para evaluar.
 * @param {boolean} isPassphraseMode - Indica si estamos en modo passphrase.
 * @param {string} passphraseSeparator - El separador usado en la passphrase (necesario para dividir palabras).
 * @param {HTMLElement} strengthBarElement - La referencia al elemento de la barra de fortaleza.
 */
export function updateStrengthMeter(generatedPassword, isPassphraseMode, passphraseSeparator, strengthBarElement) {
    // IMPORTANTE: Verificar si strengthBarElement existe antes de intentar manipularlo.
    // Si es null o undefined, simplemente salimos de la función para evitar el error.
    if (!strengthBarElement) {
        console.warn("strengthBarElement no fue proporcionado a updateStrengthMeter. La barra de fuerza no se actualizará.");
        return;
    }

    let strength = 0;

    if (!generatedPassword) {
        strengthBarElement.style.width = "0%";
        strengthBarElement.style.backgroundColor = "var(--strength-weak)";
        return;
    }

    if (isPassphraseMode) {
        const words = generatedPassword.split(passphraseSeparator).filter(word => word.length > 0);
        const wordCount = words.length;

        // Evaluación de fortaleza para passphrases
        if (wordCount >= 6) strength = 100;
        else if (wordCount === 5) strength = 90;
        else if (wordCount === 4) strength = 80;
        else if (wordCount === 3) strength = 60;
        else strength = 30; // Menos de 3 palabras es muy débil
    } else {
        // Evaluación de fortaleza para contraseñas regulares
        const hasUppercase = /[A-Z]/.test(generatedPassword);
        const hasLowercase = /[a-z]/.test(generatedPassword);
        const hasNumbers = /[0-9]/.test(generatedPassword);
        const hasSymbols = /[^A-Za-z0-9]/.test(generatedPassword);

        let charTypes = 0;
        if (hasUppercase) charTypes++;
        if (hasLowercase) charTypes++;
        if (hasNumbers) charTypes++;
        if (hasSymbols) charTypes++;

        const length = generatedPassword.length;

        // Puntuación basada en longitud
        if (length >= 16) strength += 40;
        else if (length >= 12) strength += 25;
        else if (length >= 8) strength += 10;

        // Puntuación basada en tipos de caracteres
        if (charTypes === 4) strength += 40;
        else if (charTypes === 3) strength += 25;
        else if (charTypes === 2) strength += 10;

        // Bonificaciones por combinaciones y longitud
        if (length >= 12 && charTypes >= 3) strength += 10;
        if (length >= 16 && charTypes === 4) strength += 10;
    }

    strength = Math.min(strength, 100); // Asegurar que no exceda el 100%
    strengthBarElement.style.width = `${strength}%`;

    if (strength < 40) {
        strengthBarElement.style.backgroundColor = "var(--strength-weak)";
    } else if (strength < 75) {
        strengthBarElement.style.backgroundColor = "var(--strength-medium)";
    } else {
        strengthBarElement.style.backgroundColor = "var(--strength-strong)";
    }
}