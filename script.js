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

  const batchModeCheck = document.getElementById("batch-mode");
  const batchControlsEl = document.getElementById("batch-controls");
  const batchSizeInput = document.getElementById("batch-size");
  const downloadBtn = document.getElementById("download-btn");

  // --- Character Sets ---
  const baseCharSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>/?",
  };
  const ambiguousChars = /[l1O0]/g;

  // --- Event Listeners ---
  lengthSlider.addEventListener("input", () => {
    lengthValueEl.textContent = lengthSlider.value;
    if (
      passwordResultEl.textContent !== 'Presiona "Generar..."' &&
      passwordResultEl.textContent !== "Selecciona al menos un tipo de carácter"
    ) {
      handleGeneration(); // Actualizar contraseña si ya hay una
    }
  });

  batchModeCheck.addEventListener("change", () => {
    batchControlsEl.classList.toggle("show", batchModeCheck.checked);
    downloadBtn.style.display = batchModeCheck.checked ? "flex" : "none"; // Usar flex para alinear ícono
    generateBtn.innerHTML = batchModeCheck.checked
      ? '<i class="fas fa-layer-group"></i> Generar Lote'
      : '<i class="fas fa-cogs"></i> Generar Contraseña';
    passwordResultEl.innerHTML = 'Presiona "Generar..."'; // Resetear resultado
    updateStrengthMeter(""); // Resetear medidor
  });

  generateBtn.addEventListener("click", handleGeneration);

  copyBtn.addEventListener("click", () => {
    const textToCopy = passwordResultEl.innerText; //innerText para obtener el texto tal como se muestra (con saltos de línea)
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

  [
    uppercaseCheck,
    lowercaseCheck,
    numbersCheck,
    symbolsCheck,
    excludeAmbiguousCheck,
  ].forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      if (
        passwordResultEl.textContent !== 'Presiona "Generar..."' &&
        passwordResultEl.textContent !==
          "Selecciona al menos un tipo de carácter"
      ) {
        handleGeneration();
      }
    });
  });

  // --- Functions ---
  function handleGeneration() {
    const length = parseInt(lengthSlider.value);
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
    const randomValues = new Uint32Array(length); // Para mayor seguridad
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
    updateStrengthMeter(passwordsArray[0] || ""); // Evaluar fortaleza del primero

    downloadBtn.onclick = () => {
      const csvContent =
        "data:text/csv;charset=utf-8," + passwordsArray.join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `businesspass_${passwordsArray.length}_passwords.csv`,
      );
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

    // Puntuación por longitud
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25; // Total 50 para longitud >= 12
    if (password.length >= 16) strength += 15; // Total 65 para longitud >= 16

    // Puntuación por tipo de caracteres
    let charTypes = 0;
    if (/[A-Z]/.test(password) && uppercaseCheck.checked) charTypes++;
    if (/[a-z]/.test(password) && lowercaseCheck.checked) charTypes++;
    if (/[0-9]/.test(password) && numbersCheck.checked) charTypes++;
    if (/[^A-Za-z0-9]/.test(password) && symbolsCheck.checked) charTypes++;

    if (charTypes >= 3) strength += 35;
    else if (charTypes === 2) strength += 20;
    else if (charTypes === 1 && password.length > 0) strength += 10;

    strength = Math.min(strength, 100); // Cap at 100

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
  lengthValueEl.textContent = lengthSlider.value; // Set initial length display
  updateStrengthMeter(""); // Initialize strength meter
  // generateBtn.click(); // Opcional: generar una contraseña al cargar la página
});

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

// Mejor feedback táctil (añade al DOMContentLoaded)
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

// Evitar zoom en inputs (útil para iOS)
document.querySelectorAll("input, textarea, select").forEach((input) => {
  input.addEventListener("focus", () => {
    document
      .querySelector('meta[name="viewport"]')
      .setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0",
      );
  });
  input.addEventListener("blur", () => {
    document
      .querySelector('meta[name="viewport"]')
      .setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=5.0",
      );
  });
});
