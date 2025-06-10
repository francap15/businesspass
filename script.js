document.addEventListener("DOMContentLoaded", () => {
  // ===== NAVBAR DINÁMICO =====
  const nav = document.querySelector(".main-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  let lastScrollY = window.scrollY;

  // Control de scroll
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // Reset al llegar al top
    if (currentScrollY <= 10) {
      nav.classList.remove("scrolled", "hidden");
      return;
    }

    // Scroll hacia abajo
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      nav.classList.add("hidden");
    }
    // Scroll hacia arriba
    else {
      nav.classList.remove("hidden");
      nav.classList.add("scrolled");
    }

    lastScrollY = currentScrollY;
  });

  // Menú móvil
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.innerHTML = navLinks.classList.contains("open")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Cerrar menú al hacer clic en un link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // --- DOM Elements ---
    const lengthSlider = document.getElementById("length-slider");
    const lengthValueEl = document.getElementById("length-value");
    const generateBtn = document.getElementById("generate-btn");
    const passwordResultEl = document.getElementById("password-result");
    const copyBtn = document.getElementById("copy-btn");
    const strengthBar = document.getElementById("strength-bar");

    const uppercaseCheck = document.getElementById("uppercase");
    const lowercaseCheck = document.getElementById("lowercase");
    const numbersCheck = document.getElementById("numbers");
    const symbolsCheck = document.getElementById("symbols");
    const excludeAmbiguousCheck = document.getElementById("exclude-ambiguous");
    const passphraseModeCheck = document.getElementById("passphrase-mode");

    const batchModeCheck = document.getElementById("batch-mode");
    const batchControlsEl = document.getElementById("batch-controls");
    const batchSizeInput = document.getElementById("batch-size");
    const downloadBtn = document.getElementById("download-btn");

    const passphraseControls = document.getElementById("passphrase-controls");
    const passphraseLength = document.getElementById("passphrase-length");
    const passphraseLengthValue = document.getElementById("passphrase-length-value");
    const passphraseSeparator = document.getElementById("passphrase-separator");

    // UPDATED ELEMENTS FOR OPTION 1
    const regularPasswordOptionsDiv = document.getElementById("regular-password-options"); // This is the new div for character options
    const passphraseExplanationDiv = document.getElementById("passphrase-explanation");


    // --- Character Sets ---
    const baseCharSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>/?",
    };
    const ambiguousChars = /[l1O0]/g;

    // Lista de palabras para passphrases
    const wordListES = [
        "SolBrillante", "CaminoSecreto", "NubeAzul", "PuertaOculta", "LuzDelBosque",
        "CorazonFuerte", "RíoEterno", "MontañaLejana", "VientoDelNorte", "LlaveMaestra",
        "FuegoInterior", "MenteÁgil", "SombraDanzante", "EstrellaFugaz", "SilencioNocturno",
        "ArenaCaliente", "CuevaMisteriosa", "BrisaSuave", "CieloRojo", "TormentaLejana",
        "MurallaSegura", "HojaQueCae", "EspadaValiente", "LagoProfundo", "SenderoClaro",
        "ÁrbolAntiguo", "PalabraClave", "NidoSeguro", "CaféOscuro", "PuenteRoto",
        "RelojDeArena", "TroncoHueco", "PasajeSecreto", "VueloLibre", "MensajeOculto",
        "FortalezaAlta", "TiempoEscaso", "LuzEnLaNoche", "CódigodeHonor", "SonidoDelMar"
    ];

    // --- Event Listeners ---
    lengthSlider.addEventListener("input", () => {
        lengthValueEl.textContent = lengthSlider.value;
        if (
            passwordResultEl.textContent !== 'Presiona "Generar..."' &&
            passwordResultEl.textContent !== "Selecciona al menos un tipo de carácter"
        ) {
            handleGeneration();
        }
    });

    batchModeCheck.addEventListener("change", () => {
        batchControlsEl.classList.toggle("show", batchModeCheck.checked);
        downloadBtn.style.display = batchModeCheck.checked ? "flex" : "none";

        // Adjust button text based on both modes
        if (batchModeCheck.checked) {
            generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
        } else if (passphraseModeCheck.checked) {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase';
        } else {
            generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
        }

        passwordResultEl.innerHTML = 'Presiona "Generar..."';
        updateStrengthMeter("");
    });

    generateBtn.addEventListener("click", handleGeneration);

    copyBtn.addEventListener("click", () => {
        const textToCopy = passwordResultEl.innerText;
        if (
            textToCopy &&
            textToCopy !== 'Presiona "Generar..."' &&
            textToCopy !== "Selecciona al menos un tipo de carácter"
        ) {
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    const originalIcon = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado';
                    copyBtn.classList.add("copied");
                    copyBtn.disabled = true;
                    setTimeout(() => {
                        copyBtn.innerHTML = originalIcon;
                        copyBtn.classList.remove("copied");
                        copyBtn.disabled = false;
                    }, 2000);
                })
                .catch((err) => {
                    console.error("Error al copiar: ", err);
                    passwordResultEl.textContent = "Error al copiar.";
                });
        }
    });

    // Listeners para checkboxes
    [
        uppercaseCheck,
        lowercaseCheck,
        numbersCheck,
        symbolsCheck,
        excludeAmbiguousCheck
    ].forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            if (
                passwordResultEl.textContent !== 'Presiona "Generar..."' &&
                passwordResultEl.textContent !== "Selecciona al menos un tipo de carácter"
            ) {
                handleGeneration();
            }
        });
    });

    // Passphrase controls
    passphraseModeCheck.addEventListener("change", (e) => {
        const isPassphraseMode = e.target.checked;

        passphraseControls.classList.toggle("show", isPassphraseMode);

        // Toggle visibility of character options vs. passphrase explanation
        regularPasswordOptionsDiv.style.display = isPassphraseMode ? "none" : "grid"; // Hide character options
        passphraseExplanationDiv.style.display = isPassphraseMode ? "block" : "none"; // Show explanation

        // Adjust length slider min/max/value based on mode
        if (isPassphraseMode) {
            lengthSlider.min = 3; // Minimum 3 words for passphrase
            lengthSlider.max = 10; // Max 10 words for passphrase
            lengthSlider.value = passphraseLength.value; // Sync with passphraseLength slider
        } else {
            lengthSlider.min = 8; // Original min for password length
            lengthSlider.max = 64; // Original max for password length
            lengthSlider.value = 16; // Reset to default password length
        }
        lengthValueEl.textContent = lengthSlider.value; // Update display

        // Also adjust batch controls and button text
        if (isPassphraseMode && batchModeCheck.checked) {
            generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote'; // Batch text for passphrases
        } else if (isPassphraseMode && !batchModeCheck.checked) {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase'; // Specific text for single passphrase
        } else if (!isPassphraseMode && !batchModeCheck.checked) {
            generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
        } else { // !isPassphraseMode && batchModeCheck.checked
            generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
        }

        passwordResultEl.innerHTML = 'Presiona "Generar..."';
        updateStrengthMeter("");

        if (isPassphraseMode) {
            handleGeneration(); // Generate a passphrase immediately when mode is activated
        }
    });

    passphraseLength.addEventListener("input", (e) => {
        passphraseLengthValue.textContent = e.target.value;
        lengthSlider.value = e.target.value; // Keep the main length slider in sync
        lengthValueEl.textContent = e.target.value; // Update main length display
        if (passphraseModeCheck.checked) {
            handleGeneration();
        }
    });

    passphraseSeparator.addEventListener("change", () => {
        if (passphraseModeCheck.checked) {
            handleGeneration();
        }
    });

    // --- Functions ---
    function handleGeneration() {
        const effectiveLength = passphraseModeCheck.checked ? parseInt(passphraseLength.value) : parseInt(lengthSlider.value);

        if (passphraseModeCheck.checked) {
            if (batchModeCheck.checked) {
                generateBatchPassphrases();
            } else {
                passwordResultEl.textContent = generatePassphrase(effectiveLength);
                updateStrengthMeter(passwordResultEl.textContent);
            }
            return;
        }

        const length = effectiveLength;
        let currentCharset = "";

        if (uppercaseCheck.checked) currentCharset += baseCharSets.uppercase;
        if (lowercaseCheck.checked) currentCharset += baseCharSets.lowercase;
        if (numbersCheck.checked) currentCharset += baseCharSets.numbers;
        if (symbolsCheck.checked) currentCharset += baseCharSets.symbols;

        if (excludeAmbiguousCheck.checked) {
            currentCharset = currentCharset.replace(ambiguousChars, "");
        }

        if (currentCharset === "") {
            passwordResultEl.textContent = "Selecciona al menos un tipo de carácter";
            updateStrengthMeter("");
            return;
        }

        if (batchModeCheck.checked) {
            generateBatchPasswords(currentCharset, length);
        } else {
            generateSinglePassword(currentCharset, length);
        }
    }

    function generateSinglePassword(charset, length) {
        let password = "";
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            password += charset[randomValues[i] % charset.length];
        }
        passwordResultEl.textContent = password;
        updateStrengthMeter(password);
    }

    function generateBatchPasswords(charset, length) {
        const count = parseInt(batchSizeInput.value);
        if (isNaN(count) || count < 2 || count > 50) {
            passwordResultEl.innerHTML = "<div>Número de lote inválido (2-50).</div>";
            updateStrengthMeter("");
            return;
        }
        let passwordsHtml = "";
        let passwordsArray = [];

        for (let n = 0; n < count; n++) {
            let password = "";
            const randomValues = new Uint32Array(length);
            window.crypto.getRandomValues(randomValues);
            for (let i = 0; i < length; i++) {
                password += charset[randomValues[i] % charset.length];
            }
            passwordsHtml += `<div>${password}</div>`;
            passwordsArray.push(password);
        }
        passwordResultEl.innerHTML = passwordsHtml;
        updateStrengthMeter(passwordsArray[0] || "");

        downloadBtn.onclick = () => {
            const csvContent = "data:text/csv;charset=utf-8," + passwordsArray.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `businesspass_${passwordsArray.length}_passwords.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }

    function generatePassphrase(length) {
        const separator = passphraseSeparator.value;
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        return Array.from(randomValues)
            .map(value => wordListES[value % wordListES.length])
            .join(separator);
    }

    function generateBatchPassphrases() {
        const count = parseInt(batchSizeInput.value);
        const length = parseInt(passphraseLength.value);

        if (isNaN(count) || count < 2 || count > 50) {
            passwordResultEl.innerHTML = "<div>Número de lote inválido (2-50).</div>";
            updateStrengthMeter("");
            return;
        }
        let passwordsHtml = "";
        let passwordsArray = [];

        for (let n = 0; n < count; n++) {
            let passphrase = generatePassphrase(length);
            passwordsHtml += `<div>${passphrase}</div>`;
            passwordsArray.push(passphrase);
        }
        passwordResultEl.innerHTML = passwordsHtml;
        updateStrengthMeter(passwordsArray[0] || "");

        downloadBtn.onclick = () => {
            const csvContent = "data:text/csv;charset=utf-8," + passwordsArray.join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `businesspass_${passwordsArray.length}_passphrases.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }

    function updateStrengthMeter(password) {
        let strength = 0;

        if (!password) {
            strengthBar.style.width = "0%";
            strengthBar.style.backgroundColor = "var(--strength-weak)";
            return;
        }

        if (passphraseModeCheck.checked) {
            const words = password.split(passphraseSeparator.value);
            const wordCount = words.length;

            if (wordCount >= 5) strength = 100;
            else if (wordCount === 4) strength = 85;
            else if (wordCount === 3) strength = 65;
            else strength = 40;
        } else {
            if (password.length >= 8) strength += 25;
            if (password.length >= 12) strength += 25;
            if (password.length >= 16) strength += 15;

            let charTypes = 0;
            if (/[A-Z]/.test(password) && uppercaseCheck.checked) charTypes++;
            if (/[a-z]/.test(password) && lowercaseCheck.checked) charTypes++;
            if (/[0-9]/.test(password) && numbersCheck.checked) charTypes++;
            if (/[^A-Za-z0-9]/.test(password) && symbolsCheck.checked) charTypes++;

            if (charTypes >= 3) strength += 35;
            else if (charTypes === 2) strength += 20;
            else if (charTypes === 1) strength += 10;
        }

        strength = Math.min(strength, 100);
        strengthBar.style.width = `${strength}%`;

        if (strength < 40) {
            strengthBar.style.backgroundColor = "var(--strength-weak)";
        } else if (strength < 75) {
            strengthBar.style.backgroundColor = "var(--strength-medium)";
        } else {
            strengthBar.style.backgroundColor = "var(--strength-strong)";
        }
    }

    // --- Initial Setup ---
    lengthValueEl.textContent = lengthSlider.value;
    passphraseLengthValue.textContent = passphraseLength.value;
    updateStrengthMeter("");

    // Mejor feedback táctil
    document.querySelectorAll("button, .option").forEach((el) => {
        el.style.transition = "transform 0.1s, opacity 0.1s";
        el.addEventListener("touchstart", () => {
            el.style.transform = "scale(0.98)";
            el.style.opacity = "0.9";
        });
        el.addEventListener("touchend", () => {
            el.style.transform = "";
            el.style.opacity = "";
        });
    });

    // Evitar zoom en inputs (iOS)
    document.querySelectorAll("input, textarea, select").forEach((input) => {
        input.addEventListener("focus", () => {
            document.querySelector('meta[name="viewport"]')
                .setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0");
        });
        input.addEventListener("blur", () => {
            document.querySelector('meta[name="viewport"]')
                .setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=5.0");
        });
    });
});

// ===== DONATION MODAL LOGIC =====
const donationModal = document.getElementById("donationModal");
const supportLink = document.getElementById("support-link");
const closeButton = document.querySelector("#donationModal .close-button");

// Open modal when "Apoya el Proyecto" link is clicked
if (supportLink) {
    supportLink.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link behavior
        donationModal.style.display = "flex"; // Show the modal
        // Add a class to body to prevent scrolling while modal is open (optional, but good practice)
        document.body.style.overflow = 'hidden';
    });
}

// Close modal when 'x' is clicked
if (closeButton) {
    closeButton.addEventListener("click", () => {
        donationModal.style.display = "none";
        document.body.style.overflow = ''; // Restore body scroll
    });
}

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
    if (event.target === donationModal) {
        donationModal.style.display = "none";
        document.body.style.overflow = ''; // Restore body scroll
    }
});

// Show modal as a subtle prompt after a delay, only once per session
const hasSeenDonationPrompt = sessionStorage.getItem("hasSeenDonationPrompt");
if (!hasSeenDonationPrompt) {
    setTimeout(() => {
        if (donationModal.style.display !== "flex") { // Only show if not already open
            donationModal.style.display = "flex";
            document.body.style.overflow = 'hidden';
            sessionStorage.setItem("hasSeenDonationPrompt", "true");
        }
    }, 120000); // Show after 10 seconds (adjust as needed)
}

// Cookie Banner
const cookieBanner = document.getElementById("cookieBanner");
const acceptCookies = document.getElementById("acceptCookies");

if (!localStorage.getItem("cookiesAccepted")) {
    cookieBanner.style.display = "flex";
}

acceptCookies.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.style.display = "none";
});