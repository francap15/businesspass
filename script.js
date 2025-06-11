document.addEventListener("DOMContentLoaded", () => {
    // ===== NAVBAR DINÁMICO =====
    const nav = document.querySelector(".main-nav");
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    let lastScrollY = window.scrollY;

    // Control de scroll para ocultar/mostrar la barra de navegación
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;

        // Reset al llegar al top de la página
        if (currentScrollY <= 10) {
            nav.classList.remove("scrolled", "hidden");
            return;
        }

        // Ocultar la barra de navegación al hacer scroll hacia abajo
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            nav.classList.add("hidden");
        }
        // Mostrar la barra de navegación y añadir clase 'scrolled' al hacer scroll hacia arriba
        else {
            nav.classList.remove("hidden");
            nav.classList.add("scrolled");
        }

        lastScrollY = currentScrollY;
    });

    // Menú móvil (toggle de navegación)
    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open"); // Alterna la clase 'open' para mostrar/ocultar el menú
            navToggle.innerHTML = navLinks.classList.contains("open")
                ? '<i class="fas fa-times"></i>' // Icono de cerrar (X) cuando el menú está abierto
                : '<i class="fas fa-bars"></i>'; // Icono de hamburguesa cuando el menú está cerrado
        });

        // Cerrar menú móvil al hacer clic en un enlace de navegación
        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open"); // Cierra el menú
                navToggle.innerHTML = '<i class="fas fa-bars"></i>'; // Restaura el icono de hamburguesa
            });
        });
    }

    // --- Elementos del DOM relacionados con el generador de contraseñas ---
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

    // Elementos del DOM para la lógica de visualización de opciones
    const regularPasswordOptionsDiv = document.getElementById("regular-password-options");
    const passphraseExplanationDiv = document.getElementById("passphrase-explanation");

    // Elementos del DOM para las opciones de Passphrase Avanzadas (excepto 'generar frase con sentido')
    const passphraseCapitalizeRandomlyCheck = document.getElementById("passphrase-capitalize-randomly");
    const passphraseIncludeNumbersCheck = document.getElementById("passphrase-include-numbers");
    const passphraseIncludeSymbolsCheck = document.getElementById("passphrase-include-symbols");


    // --- Conjuntos de caracteres base para contraseñas ---
    const baseCharSets = {
        uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowercase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+-=[]{}|;:,.<>/?",
    };
    const ambiguousChars = /[l1O0]/g; // Caracteres que pueden confundirse (L minúscula, 1, O mayúscula, 0)

    // --- Lista de palabras EXTENSA para passphrases (generación aleatoria pura) ---
    // Esta lista ha sido expandida significativamente para ofrecer mayor entropía.
    const wordListES = [
        "abaco", "abandono", "abeja", "abierto", "absoluto", "abuelo", "abundancia", "acabar", "academico", "acceso",
        "accion", "aceite", "acelerar", "acento", "aceptar", "acero", "acertar", "acido", "aclarar", "acoger",
        "aconsejar", "acordar", "acostado", "acostumbre", "acre", "acto", "actuacion", "actual", "acuerdo", "acumular",
        "adaptar", "adelante", "adelgazar", "adentro", "adhesion", "adicion", "adivinar", "adjunto", "administrar", "admirable",
        "admirar", "admision", "adolescente", "adoptar", "adorar", "adorno", "adquirir", "advertir", "aereo", "aeropuerto",
        "afectar", "aficion", "afirmar", "afligido", "aflojar", "afuera", "agarrar", "agencia", "agenda", "agente",
        "agil", "agitado", "agitar", "agoniza", "agosto", "agotado", "agradable", "agradecer", "agresivo", "agricultura",
        "agrio", "agua", "aguila", "agujero", "ahi", "ahogar", "ahora", "ahorrar", "aire", "aislado",
        "ajeno", "ajustar", "ala", "alambre", "alargar", "alarma", "album", "alcanzar", "alcohol", "aldea",
        "alegrar", "alegre", "alegria", "alejar", "aleman", "alerta", "alfabeto", "alfombra", "algo", "algodon",
        "alguien", "alguno", "alhaja", "alianza", "aliento", "alimento", "alinear", "alisar", "allanar", "alli",
        "alma", "almacen", "almohada", "almuerzo", "alto", "altura", "alumbrado", "alumno", "alza", "amable",
        "amapola", "amar", "amargo", "amarillo", "ambiente", "ambito", "ambulancia", "amenaza", "america", "amigo",
        "amistad", "amo", "amonestar", "amortiguar", "amplio", "ampolla", "ancho", "anciano", "andaluz", "andar",
        "anillo", "anima", "animal", "animar", "animo", "aniversario", "ano", "anotar", "ansiado", "anterior",
        "anticipo", "antiguedad", "antojo", "anual", "anunciar", "anuncio", "anzuelo", "añadir", "añejo", "año",
        "apagar", "aparato", "aparecer", "aparente", "apartamento", "aparte", "apenas", "aplaudir", "aplicar", "apoyar",
        "aprender", "apretar", "aprovechar", "aproximar", "apuesta", "apuntar", "aquel", "aqui", "arabe", "araña",
        "arbol", "arcilla", "arco", "arder", "ardilla", "arena", "arma", "armario", "arquitecto", "arrancar",
        "arrastrar", "arreglar", "arriba", "arrojar", "arrugado", "arroz", "arte", "articulo", "artista", "asar",
        "ascensor", "asegurar", "asesino", "asiento", "asistir", "asociacion", "asombro", "aspecto", "aspera", "aspiracion",
        "asunto", "ataque", "atender", "atento", "atmosfera", "atras", "atreverse", "atun", "aumentar", "aun",
        "aunque", "auto", "autor", "autoridad", "auxilio", "avance", "avanzar", "ave", "avenida", "aventura",
        "averiguar", "avion", "avisar", "ayer", "ayuda", "ayudar", "ayuntamiento", "azucar", "azul", "baba",
        "bailar", "bailarin", "baile", "bajar", "baja", "bajo", "balanza", "balcon", "bala", "ballena",
        "balon", "bambú", "banco", "banda", "bandeja", "bandera", "bandido", "bañarse", "barato", "barba",
        "barco", "barrer", "barrio", "base", "basura", "batalla", "bateria", "baul", "bebe", "beber",
        "bebida", "bello", "beneficio", "besar", "biblioteca", "bicicleta", "bien", "billete", "biologia", "blanco",
        "blando", "bloquear", "boca", "bola", "boleto", "bolsa", "bombero", "bondad", "bonito", "bordo",
        "borrar", "bosque", "bote", "botella", "boton", "brazo", "breve", "brillar", "brillo", "brisa",
        "bromear", "bronca", "bueno", "bulto", "burbuja", "burro", "buscar", "busto", "cabalgar", "caballero",
        "caballo", "cabeza", "cabina", "cabo", "cada", "cadena", "caer", "cafe", "caida", "caja",
        "calabaza", "calcio", "calcular", "caldera", "calido", "caliente", "calificar", "calle", "cama", "camarero",
        "cambio", "caminar", "camino", "camion", "campana", "campo", "canal", "canasta", "cancelar", "cancer",
        "cancion", "canela", "cantar", "cantidad", "canto", "caña", "caoba", "capacidad", "capital", "capitan",
        "capturar", "caracter", "cara", "carbon", "carcel", "cargador", "cargar", "caricia", "caridad", "cariño",
        "carne", "carpintero", "carrera", "carro", "carta", "cartera", "casa", "casar", "casi", "caso",
        "castigar", "catastrofe", "catedral", "categoria", "causa", "caza", "cazar", "cebolla", "ceder", "celda",
        "celebrar", "celeste", "cena", "ceniza", "centro", "cepillo", "cerca", "cerebro", "cereza", "cero",
        "cerrar", "cerro", "cesar", "cesta", "cielo", "cien", "ciencia", "cierto", "cifrar", "cigarrillo",
        "cima", "cinco", "cine", "cinta", "cintura", "circulo", "ciudad", "civil", "claro", "clase",
        "clavar", "cliente", "clima", "clinica", "coche", "cocina", "cocinar", "codigo", "codo", "coger",
        "cola", "colgar", "colina", "color", "columna", "comandar", "combate", "combinar", "combustible", "comedia",
        "comenzar", "comer", "comercio", "comida", "comisaria", "comision", "como", "comodo", "comparar", "compasion",
        "compatible", "competencia", "completar", "completo", "complicado", "componer", "comprar", "comprender", "comprimir", "compromiso",
        "comun", "comunicar", "conciencia", "concluir", "condicion", "conducir", "conferencia", "confesar", "confiar", "confirmar",
        "confuso", "congelar", "conocer", "conquista", "conseguir", "consejo", "consentir", "conservar", "considerar", "consistencia",
        "consolar", "constante", "construir", "consultar", "consumir", "contacto", "contar", "contener", "contento", "contestar",
        "continuar", "contra", "contrato", "control", "convalecencia", "convencer", "conversar", "convertir", "copa", "copia",
        "copiar", "corazon", "coro", "corona", "corte", "cortar", "cosa", "cosechar", "costa", "costar",
        "costumbre", "crear", "crecer", "creer", "crimen", "cristal", "cruz", "cuaderno", "cuadro", "cual",
        "cuando", "cuanto", "cuarto", "cuatro", "cubrir", "cuchara", "cuchillo", "cuello", "cuenta", "cuento",
        "cuerpo", "cuestion", "cuidado", "cuidar", "culpa", "cultura", "cumplir", "curar", "curioso", "curso",
        "curva", "custodia", "cutis", "dama", "danza", "daño", "dar", "dato", "deber", "decidir",
        "decir", "dedo", "defender", "defensa", "definitivo", "dejar", "delgado", "delito", "demasiado", "demostrar",
        "denunciar", "depender", "deporte", "deposito", "derecho", "derribar", "desaparecer", "desarrollo", "desayuno", "descansar",
        "descargar", "desconocido", "descubrir", "desde", "desear", "deseo", "desesperar", "desierto", "designar", "desliz",
        "despacio", "despertar", "despues", "destino", "destruir", "detalle", "detener", "determinar", "deuda", "dia",
        "diablo", "dialogo", "diamante", "diario", "dibujar", "diente", "diez", "diferencia", "dificil", "digitar",
        "digno", "dinero", "direccion", "directo", "dirigir", "discutir", "diseñar", "disfrutar", "disponer", "distancia",
        "distinto", "divertir", "dividir", "doble", "doctor", "doce", "documento", "dolar", "doler", "domingo",
        "donde", "dormir", "dos", "doce", "drama", "ducha", "duda", "dulce", "duro", "echar",
        "edad", "edificio", "educar", "efecto", "eficaz", "ejecutar", "ejemplo", "ejercicio", "eleccion", "electrico",
        "elegir", "elemento", "elevar", "eliminar", "ella", "ello", "emocion", "emperador", "emplear", "empleado",
        "empresa", "empujar", "encontrar", "energico", "energia", "enfrentar", "enfermedad", "enfermo", "engañar", "enorme",
        "enseñar", "entender", "entero", "enterrar", "entrada", "entrar", "entregar", "entrevista", "entusiasmo", "enviar",
        "epidemia", "equipo", "error", "escalera", "escenario", "escribir", "escritor", "escuchar", "escuela", "esfuerzo",
        "espacio", "espada", "español", "especial", "especie", "esperar", "espeso", "esposa", "esquina", "estable",
        "establecer", "estacion", "estado", "estadounidense", "estanque", "estar", "estatua", "este", "estrella", "estructura",
        "estudiante", "estudiar", "etapa", "eterno", "evento", "evitar", "exacto", "examinar", "excesivo", "existencia",
        "existir", "exito", "experiencia", "explicar", "exponer", "expresar", "extraño", "extremo", "fabrica", "facil",
        "factura", "familia", "famoso", "fantasia", "fantasma", "favor", "febrero", "fecha", "felicidad", "feliz",
        "fenomeno", "feo", "feria", "fiesta", "figura", "fijo", "fila", "filosofia", "fin", "final",
        "firma", "firmar", "fisico", "flaco", "flecha", "flor", "flotar", "fluido", "fondo", "forma",
        "formar", "formula", "fortaleza", "foto", "frances", "frase", "frecuencia", "frente", "fresco", "frio",
        "fruta", "fuego", "fuerza", "funcion", "fundamento", "futuro", "galeria", "ganar", "gancho", "garganta",
        "gasolina", "gastar", "gato", "gemelo", "general", "genero", "gente", "gesto", "gigante", "girar",
        "globo", "gloria", "gobernar", "gobierno", "golpe", "gordo", "gota", "gracia", "grado", "gran",
        "grande", "grano", "gratis", "grave", "gritar", "grueso", "grupo", "guardar", "guapo", "guerra",
        "guia", "guitarra", "gustar", "haber", "habitacion", "habitante", "hablar", "hacer", "hacia", "hallar",
        "hambre", "harina", "hasta", "hecho", "helado", "helicoptero", "herida", "hermano", "hermoso", "heroe",
        "herramienta", "hielo", "hierro", "hijo", "historia", "hogar", "hoja", "hombre", "hombro", "honor",
        "hora", "horizonte", "hormiga", "hospital", "hotel", "hoy", "hueso", "humano", "humedo", "humor",
        "ida", "idea", "ideal", "idioma", "iglesia", "ignorar", "igual", "ilegal", "ilustracion", "imagen",
        "imaginar", "impedir", "imperio", "implicar", "importancia", "importante", "imposible", "impresion", "impuesto", "incluir",
        "incluso", "indicar", "individuo", "industrial", "infancia", "inferior", "infinito", "influencia", "informacion", "informar",
        "ingeniero", "ingreso", "inicial", "iniciar", "inmediato", "inmigrante", "inocente", "insecto", "inspirar", "instante",
        "instrumento", "inteligente", "intencion", "interesar", "interesante", "interior", "internacional", "interpretar", "interrumpir", "intervalo",
        "introducir", "inutil", "invierno", "invitar", "ir", "isla", "izquierda", "jabón", "jamón", "jardín",
        "jarra", "jefe", "joven", "joya", "juego", "jugar", "juicio", "junio", "junto", "juramento",
        "justicia", "justo", "juventud", "labor", "lado", "ladron", "lagrima", "lamentar", "lampara", "lana",
        "lapiz", "largo", "lastima", "lavar", "lazo", "leche", "leer", "legal", "lejano", "lengua",
        "lento", "leon", "levantar", "leve", "ley", "libertad", "libreria", "libro", "ligero", "limitar",
        "limite", "limpio", "linea", "lingüistico", "liquido", "lista", "listo", "literatura", "litro", "llamar",
        "llave", "llegar", "llenar", "llevar", "llorar", "lluvia", "local", "loco", "lograr", "lomo",
        "luz", "madera", "madre", "maduro", "maestro", "magia", "magnifico", "maiz", "maleta", "malo",
        "mamá", "mancha", "mandar", "manejar", "manera", "mano", "mantener", "manta", "mañana", "mapa",
        "maquina", "mar", "maravilloso", "marca", "marcha", "margen", "marido", "masa", "masaje", "matar",
        "material", "matrimonio", "maximo", "mayor", "mayoria", "mecanismo", "medida", "medio", "medir", "mejor",
        "mejora", "melon", "memoria", "mencionar", "menor", "menos", "mensaje", "mente", "mentira", "mercado",
        "merecer", "mesa", "meta", "meter", "metro", "mezclar", "miedo", "miembro", "mientras", "miercoles",
        "milagro", "militar", "mina", "mineral", "minimo", "ministro", "minuto", "mio", "mirar", "misa",
        "miserable", "misterio", "mitad", "modelo", "moderno", "modo", "mojar", "molestar", "molecula", "momento",
        "moneda", "mono", "monstruo", "montaña", "montar", "morir", "mostrar", "motivo", "mover", "movimiento",
        "mucho", "mueble", "muerte", "mujer", "mundo", "musica", "nacer", "nacional", "nada", "nadie",
        "naranja", "nariz", "naturaleza", "navegar", "navidad", "necesitar", "negocio", "negro", "nervioso", "neto",
        "nevar", "nido", "ninguno", "niño", "nivel", "no", "noble", "noche", "nombre", "normal",
        "norte", "noticia", "novela", "noviembre", "nube", "nuestro", "nuevo", "numero", "nunca", "nutricion",
        "obedecer", "objeto", "obligar", "obra", "observar", "obtener", "ocasion", "ocultar", "ocupar", "ocurrir",
        "oceano", "octubre", "odiar", "oeste", "ofender", "ofrecer", "oido", "ojo", "ola", "oler",
        "olvidar", "once", "operacion", "opinion", "oponer", "oportunidad", "optar", "orden", "ordenar", "oreja",
        "organismo", "organizar", "origen", "oro", "oscuro", "otoño", "otro", "oveja", "paciencia", "pacifico",
        "padre", "pagar", "pagina", "pais", "paja", "palabra", "palido", "palma", "palpitar", "pan",
        "panal", "pantalla", "pañuelo", "papel", "par", "parar", "parecer", "pared", "pareja", "parque",
        "parte", "participar", "particular", "partido", "pasado", "pasaje", "pasar", "pasillo", "paso", "pasta",
        "paz", "pecho", "pedir", "pegar", "pelear", "pelicula", "pelo", "peligro", "pena", "penal",
        "pensar", "peor", "pequeño", "pera", "percibir", "perder", "perdonar", "perfecto", "perfume", "periodico",
        "permitir", "pero", "perro", "perseguir", "persona", "personal", "pesar", "pescado", "peso", "pestaña",
        "picante", "pie", "piedra", "piel", "pierna", "pieza", "piloto", "pincel", "pintar", "pintura",
        "piso", "pistola", "pizarra", "placer", "plan", "planeta", "planta", "plata", "plato", "playa",
        "plaza", "poblacion", "pobre", "poco", "poder", "podrir", "poema", "poeta", "politica", "polvo",
        "poner", "popular", "porcentaje", "portal", "posible", "posicion", "practica", "precio", "precisar", "preferir",
        "pregunta", "preguntar", "premio", "preocupar", "preparar", "presentar", "presidente", "presion", "prestar", "primer",
        "principio", "prision", "privado", "problema", "proceder", "proceso", "producir", "producto", "profesion", "profesor",
        "profundo", "programa", "progresar", "prohibir", "prometer", "promover", "pronto", "propiedad", "propio", "proponer",
        "proteger", "proteina", "protestar", "proveer", "proximo", "prueba", "publico", "pueblo", "puerta", "puerto",
        "puesto", "pulmon", "pulsera", "punto", "purpura", "quedar", "quemar", "querer", "queso", "quien",
        "quieto", "quimica", "quince", "quitar", "radio", "raiz", "rama", "rapido", "raro", "raton",
        "razon", "real", "realizar", "rebaño", "rebelde", "recibir", "reciente", "recoger", "reconocer", "recordar",
        "recto", "recuerdo", "redondo", "referir", "reflejar", "refrigerador", "regalo", "regresar", "regular", "reina",
        "reino", "reir", "relacion", "relativo", "reloj", "remoto", "rendir", "renta", "reparar", "repasar",
        "repetir", "reportaje", "representar", "reservar", "residencia", "resistir", "resolver", "respetar", "respirar", "responder",
        "responsable", "restaurante", "resultado", "reunion", "revelar", "revista", "rey", "rezar", "rico", "riesgo",
        "rigido", "rincon", "rio", "riqueza", "risa", "robot", "rojo", "romper", "ropa", "rosa",
        "rotura", "rubio", "rueda", "ruido", "ruta", "saber", "sabio", "sacar", "sacerdote", "sacrificio",
        "sala", "salida", "salir", "salmon", "salto", "salud", "saludar", "salvar", "sangre", "santa",
        "santo", "sapo", "satisfacer", "secar", "seco", "secreto", "seccion", "sed", "seguir", "segundo",
        "seguro", "seis", "seleccion", "semana", "semilla", "sendero", "sensacion", "sensible", "sentar", "sentido",
        "sentir", "separar", "septiembre", "ser", "serie", "serio", "servicio", "servir", "sesion", "setenta",
        "sexo", "sexto", "siempre", "siete", "siglo", "significar", "siguiente", "silencio", "silla", "simbolo",
        "simple", "simular", "sincero", "sindicato", "sino", "sistema", "sitio", "situacion", "social", "sociedad",
        "sol", "solicitar", "solo", "solucion", "sombra", "sombrero", "sonar", "sonido", "sonreir", "sonrisa",
        "sopa", "sordo", "sorpresa", "sostener", "suave", "subir", "sucio", "suelo", "suerte", "suficiente",
        "sugerir", "suicida", "suizo", "sumar", "superficie", "superior", "suponer", "surgir", "sur", "suspirar",
        "sustancia", "taco", "tacto", "talento", "taller", "tamaño", "tambien", "tan", "tanto", "tapa",
        "tapete", "tarde", "tarea", "tarjeta", "taxi", "taza", "techo", "tejer", "telefono", "tema",
        "temblar", "temprano", "tendencia", "tener", "teoria", "tercero", "terminar", "terrible", "terror", "tesoro",
        "testigo", "texto", "tia", "tiempo", "tienda", "tierra", "tigre", "timbre", "tina", "tinta",
        "tio", "tipo", "tirar", "tocar", "todavia", "todo", "tomar", "tono", "tonto", "tocar",
        "tormenta", "tornillo", "torre", "tortuga", "total", "trabajar", "trabajo", "tradicion", "trafico", "traje",
        "tranquilo", "transformar", "transporte", "tratar", "tren", "trece", "treinta", "tres", "tribu", "tributo",
        "triste", "triunfo", "trompeta", "tronco", "tropa", "tubo", "tumor", "tunel", "turbio", "turismo",
        "ultimo", "unir", "uno", "universidad", "urgente", "usar", "uso", "util", "uvas", "vacio",
        "valiente", "valor", "vapor", "variable", "varios", "vecino", "vegetal", "veinte", "velocidad", "vender",
        "vengarse", "venir", "ventana", "ver", "verano", "verde", "verdad", "verdadero", "vestido", "vestir",
        "vez", "viaje", "vida", "vidrio", "viejo", "viento", "vigor", "villa", "vino", "violencia",
        "violin", "virgen", "virtud", "visible", "vision", "visita", "visitar", "vista", "vivir", "vivo",
        "volar", "volumen", "volver", "voto", "voz", "vuelta", "yegua", "yema", "yerno", "yoga",
        "yodo", "yogur", "zafiro", "zumo", "zurdo"
    ];

    // NOTA: 'categoriasES' y 'phraseTemplates' ya no se utilizarán para la generación de passphrase
    // cuando la opción "Generar frase con sentido" sea eliminada.
    // Se mantienen aquí por si decides reintroducir la lógica en el futuro,
    // pero no son accesibles directamente por las funciones de generación de passphrase
    // en esta versión del código.
    const categoriasES = {
        articulos: ["el", "la", "los", "las", "un", "una", "unos", "unas"],
        pronombres: ["yo", "tú", "él", "ella", "nosotros", "vosotros", "ellos", "ellas"],
        sustantivos: [
            "agua", "aire", "casa", "perro", "gato", "libro", "mesa", "silla",
            "ciudad", "hombre", "mujer", "niño", "flor", "árbol", "sol", "luna",
            "tiempo", "vida", "mundo", "trabajo", "escuela", "familia", "amigo",
            "elefante", "montaña", "río", "estrella", "computadora", "teléfono",
            "jardín", "cielo", "nube", "canción", "noche", "día", "comida", "sueño",
            "viaje", "camino", "voz", "silencio", "puerta", "ventana", "color", "sonrisa"
        ],
        verbos: [
            "correr", "saltar", "dormir", "leer", "bailar", "comer", "beber", "cantar",
            "hablar", "escribir", "amar", "vivir", "pensar", "sentir", "querer", "hacer",
            "ver", "oír", "tocar", "jugar", "estudiar", "trabajar", "viajar", "aprender",
            "crecer", "soñar", "despertar", "volar", "navegar", "buscar", "encontrar", "crear",
            "construir", "imaginar", "recordar", "olvidar", "ayudar", "llegar", "partir"
        ],
        adjetivos: [
            "grande", "pequeño", "rojo", "azul", "feliz", "triste", "rápido", "lento",
            "bueno", "malo", "hermoso", "feo", "fuerte", "débil", "joven", "viejo",
            "nuevo", "antiguo", "alto", "bajo", "claro", "oscuro", "inteligente", "divertido",
            "interesante", "aburrido", "dulce", "amargo", "suave", "áspero", "limpio", "sucio"
        ],
        adverbios: [
            "lentamente", "rápidamente", "bien", "mal", "siempre", "nunca", "aquí", "allí",
            "hoy", "ayer", "mañana", "tarde", "pronto", "lejos", "cerca", "mucho", "poco", "muy",
            "demasiado", "quizás", "nunca", "aún", "casi", "solo", "también", "además"
        ],
        preposiciones: ["a", "con", "de", "en", "para", "por", "sobre", "sin", "entre", "hacia", "desde", "hasta", "contra", "según"],
        conjunciones: ["y", "o", "pero", "porque", "si", "que", "como", "cuando", "mientras", "aunque"]
    };

    const phraseTemplates = [
        ["articulos", "sustantivos", "verbos", "articulos", "sustantivos"],
        ["pronombres", "verbos", "adverbios"],
        ["articulos", "sustantivos", "adjetivos", "verbos"],
        ["sustantivos", "verbos", "preposiciones", "articulos", "sustantivos"],
        ["verbos", "articulos", "sustantivos"],
        ["verbos", "adverbios"],
        ["articulos", "sustantivos", "y", "articulos", "sustantivos"],
        ["verbos", "conjunciones", "verbos"],
        ["articulos", "adjetivos", "sustantivos"],
        ["sustantivos", "adjetivos", "adjetivos"],
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

        // Ajusta el texto del botón basado en los modos
        if (batchModeCheck.checked) {
            generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
        } else if (passphraseModeCheck.checked) {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase';
        } else {
            generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
        }

        passwordResultEl.innerHTML = 'Presiona "Generar..."'; // Restablece el área de resultado
        updateStrengthMeter(""); // Restablece la barra de fortaleza
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

    // Listeners para checkboxes de contraseñas regulares
    [
        uppercaseCheck,
        lowercaseCheck,
        numbersCheck,
        symbolsCheck,
        excludeAmbiguousCheck
    ].forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            // Solo regenerar si no es el mensaje inicial o de error
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

        // Alternar visibilidad de las opciones de caracteres vs. explicación de passphrase
        regularPasswordOptionsDiv.style.display = isPassphraseMode ? "none" : "grid";
        // La explicación de passphrase ahora se mostrará siempre si el modo passphrase está activo,
        // ya que la complejidad de "sentido" se eliminó de las opciones del usuario.
        passphraseExplanationDiv.style.display = isPassphraseMode ? "block" : "none";


        // Ajustar los valores min/max/actual del slider de longitud según el modo
        if (isPassphraseMode) {
            lengthSlider.min = 3; // Mínimo 3 palabras para passphrase
            lengthSlider.max = 10; // Máximo 10 palabras para passphrase
            lengthSlider.value = passphraseLength.value; // Sincronizar con el slider de longitud de passphrase
        } else {
            lengthSlider.min = 8; // Mínimo original para longitud de contraseña
            lengthSlider.max = 64; // Máximo original para longitud de contraseña
            lengthSlider.value = 16; // Restablecer a la longitud de contraseña por defecto
        }
        lengthValueEl.textContent = lengthSlider.value; // Actualizar la visualización de la longitud

        // Ajustar los controles de lote y el texto del botón de generación
        if (batchModeCheck.checked) {
            generateBtn.innerHTML = '<i class="fas fa-layer-group"></i> Generar Lote';
        } else if (isPassphraseMode) {
            generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generar Passphrase';
        } else {
            generateBtn.innerHTML = '<i class="fas fa-cogs"></i> Generar Contraseña';
        }

        passwordResultEl.innerHTML = 'Presiona "Generar..."'; // Restablecer el área de resultado
        updateStrengthMeter(""); // Restablecer la barra de fortaleza

        if (isPassphraseMode) {
            handleGeneration(); // Generar una passphrase inmediatamente al activar el modo
        }
    });

    passphraseLength.addEventListener("input", (e) => {
        passphraseLengthValue.textContent = e.target.value;
        lengthSlider.value = e.target.value; // Mantener el slider de longitud principal sincronizado
        lengthValueEl.textContent = e.target.value; // Actualizar la visualización de longitud principal
        if (passphraseModeCheck.checked) {
            handleGeneration();
        }
    });

    passphraseSeparator.addEventListener("change", () => {
        if (passphraseModeCheck.checked) {
            handleGeneration();
        }
    });

    // Listeners para las opciones avanzadas de Passphrase (solo las que se mantienen)
    [
        passphraseCapitalizeRandomlyCheck,
        passphraseIncludeNumbersCheck,
        passphraseIncludeSymbolsCheck
    ].forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            if (passphraseModeCheck.checked) { // Solo regenerar si estamos en modo passphrase
                handleGeneration();
            }
        });
    });


    // --- Funciones de Generación y Lógica ---

    /**
     * Genera una contraseña segura, asegurando que al menos un carácter de cada tipo seleccionado esté presente.
     * Los caracteres obligatorios se insertan primero y luego la contraseña se mezcla.
     * @param {string} charset - El conjunto de caracteres a utilizar para la generación.
     * @param {number} length - La longitud deseada de la contraseña.
     * @param {object} options - Objeto con booleanos para los tipos de caracteres (uppercase, lowercase, numbers, symbols).
     * @returns {string} La contraseña generada.
     */
    function generatePasswordWithGuaranteedChars(charset, length, options) {
        let passwordArray = [];
        const mustInclude = [];

        // Identificar y asegurar la inclusión de al menos un carácter de cada tipo marcado
        if (options.uppercase && baseCharSets.uppercase.split('').some(char => charset.includes(char))) {
            mustInclude.push(baseCharSets.uppercase.charAt(Math.floor(Math.random() * baseCharSets.uppercase.length)));
        }
        if (options.lowercase && baseCharSets.lowercase.split('').some(char => charset.includes(char))) {
            mustInclude.push(baseCharSets.lowercase.charAt(Math.floor(Math.random() * baseCharSets.lowercase.length)));
        }
        if (options.numbers && baseCharSets.numbers.split('').some(char => charset.includes(char))) {
            mustInclude.push(baseCharSets.numbers.charAt(Math.floor(Math.random() * baseCharSets.numbers.length)));
        }
        if (options.symbols && baseCharSets.symbols.split('').some(char => charset.includes(char))) {
            mustInclude.push(baseCharSets.symbols.charAt(Math.floor(Math.random() * baseCharSets.symbols.length)));
        }

        // Si la longitud es menor que el número de tipos obligatorios, priorizar los obligatorios
        // y generar una advertencia o ajustar la longitud si es un caso extremo.
        if (length < mustInclude.length) {
            console.warn("La longitud de la contraseña es menor que la cantidad de tipos de caracteres seleccionados. Se ajustará la longitud para incluir todos los tipos.");
            length = mustInclude.length; // Asegurar que la longitud sea al menos igual al número de tipos obligatorios
            // Aquí podrías incluso actualizar el slider en la UI si esto ocurriera automáticamente
        }

        // Añadir los caracteres obligatorios
        passwordArray.push(...mustInclude);

        // Rellenar el resto de la contraseña
        const remainingLength = length - passwordArray.length;
        
        // Solo generar si la longitud restante es positiva
        if (remainingLength > 0) {
            const randomValues = new Uint32Array(remainingLength);
            window.crypto.getRandomValues(randomValues);

            for (let i = 0; i < remainingLength; i++) {
                passwordArray.push(charset[randomValues[i] % charset.length]);
            }
        }


        // Mezclar la contraseña para asegurar la aleatoriedad de la posición
        for (let i = passwordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
        }
        return passwordArray.join('');
    }


    /**
     * Maneja la generación de contraseñas o passphrases, simple o en lote.
     */
    function handleGeneration() {
        const effectiveLength = passphraseModeCheck.checked ? parseInt(passphraseLength.value) : parseInt(lengthSlider.value);

        if (passphraseModeCheck.checked) {
            // Modo Passphrase
            // Capturar el estado de las opciones para passphrase (se eliminó 'useGrammaticalTemplates')
            const passphraseOptions = {
                capitalizeRandomly: passphraseCapitalizeRandomlyCheck.checked,
                includeNumbers: passphraseIncludeNumbersCheck.checked,
                includeSymbols: passphraseIncludeSymbolsCheck.checked
            };

            if (batchModeCheck.checked) {
                generateBatchPassphrases(effectiveLength, passphraseOptions);
            } else {
                const generatedPhrase = generatePassphrase(
                    effectiveLength,
                    passphraseSeparator.value,
                    passphraseOptions.capitalizeRandomly, // Se pasa directamente la opción de capitalización
                    passphraseOptions.includeNumbers,
                    passphraseOptions.includeSymbols
                );
                passwordResultEl.textContent = generatedPhrase;
                updateStrengthMeter(generatedPhrase);
            }
            return; // Termina la función aquí para el modo passphrase
        }

        // Modo Contraseña Regular
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

        // Opciones de tipos de caracteres para la función de generación mejorada
        const options = {
            uppercase: uppercaseCheck.checked,
            lowercase: lowercaseCheck.checked,
            numbers: numbersCheck.checked,
            symbols: symbolsCheck.checked,
        };

        if (batchModeCheck.checked) {
            generateBatchPasswords(currentCharset, length, options);
        } else {
            // Usa la nueva función para garantizar la inclusión de tipos
            const generatedPassword = generatePasswordWithGuaranteedChars(currentCharset, length, options);
            passwordResultEl.textContent = generatedPassword;
            updateStrengthMeter(generatedPassword);
        }
    }

    /**
     * Genera contraseñas regulares en lote.
     * @param {string} charset - El conjunto de caracteres.
     * @param {number} length - La longitud de cada contraseña.
     * @param {object} options - Opciones de tipos de caracteres.
     */
    function generateBatchPasswords(charset, length, options) {
        const count = parseInt(batchSizeInput.value);
        if (isNaN(count) || count < 2 || count > 50) {
            passwordResultEl.innerHTML = "<div>Número de lote inválido (2-50).</div>";
            updateStrengthMeter("");
            return;
        }
        let passwordsHtml = "";
        let passwordsArray = [];

        for (let n = 0; n < count; n++) {
            // Utiliza la función mejorada para cada contraseña del lote
            let password = generatePasswordWithGuaranteedChars(charset, length, options);
            passwordsHtml += `<div>${password}</div>`;
            passwordsArray.push(password);
        }
        passwordResultEl.innerHTML = passwordsHtml;
        updateStrengthMeter(passwordsArray[0] || ""); // Muestra la fuerza de la primera para referencia

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

    /**
     * Genera una passphrase a partir de la lista de palabras extendida.
     *
     * @param {number} length - El número de palabras a generar.
     * @param {string} separator - El separador entre palabras.
     * @param {boolean} capitalizeRandomly - Si se deben capitalizar aleatoriamente palabras.
     * @param {boolean} includeNumbers - Si se deben insertar números aleatorios.
     * @param {boolean} includeSymbols - Si se deben insertar símbolos aleatorios.
     * @returns {string} La passphrase generada.
     */
    function generatePassphrase(length, separator, capitalizeRandomly, includeNumbers, includeSymbols) {
        let finalPassphraseWords = [];

        // Función auxiliar para obtener un valor aleatorio criptográficamente seguro
        const getRandomIndex = (max) => {
            if (max <= 0) {
                console.error("getRandomIndex: 'max' debe ser mayor que 0.");
                return 0;
            }
            return window.crypto.getRandomValues(new Uint32Array(1))[0] % max;
        };

        // Generar palabras aleatorias de la lista extensa
        for (let i = 0; i < length; i++) {
            const word = wordListES[getRandomIndex(wordListES.length)];
            finalPassphraseWords.push(word);
        }

        // Unir todas las palabras con el separador principal
        let passphrase = finalPassphraseWords.filter(word => word !== "").join(separator);

        // --- Aplicar transformaciones post-generación ---

        // Capitalizar la primera letra de la primera palabra de la passphrase (por defecto)
        if (passphrase.length > 0) {
            passphrase = passphrase.charAt(0).toUpperCase() + passphrase.slice(1);
        }

        // Capitalización aleatoria de otras palabras (si la opción está activa)
        if (capitalizeRandomly) {
            let parts = passphrase.split(separator);
            let capitalizedParts = parts.map(part => {
                // Solo capitalizar si la parte no es la primera palabra y si la condición aleatoria se cumple
                // La primera palabra ya fue capitalizada arriba.
                return Math.random() < 0.25 ? part.charAt(0).toUpperCase() + part.slice(1) : part;
            });
            passphrase = capitalizedParts.join(separator);
        }

        // Inclusión de números aleatorios (si la opción está activa)
        if (includeNumbers) {
            const numCount = Math.floor(Math.random() * 2) + 1; // Inserta 1 o 2 números
            for (let i = 0; i < numCount; i++) {
                const randomNumber = getRandomIndex(100); // Números de 0 a 99
                const insertIndex = getRandomIndex(passphrase.length + 1); // Posición aleatoria en la passphrase
                passphrase = passphrase.slice(0, insertIndex) + randomNumber + passphrase.slice(insertIndex);
            }
        }

        // Inclusión de símbolos aleatorios (si la opción está activa)
        if (includeSymbols) {
            const symbols = "!@#$%^&*()-_+=[]{}|;:,.<>?";
            const symbolCount = Math.floor(Math.random() * 2) + 1; // Inserta 1 o 2 símbolos
            for (let i = 0; i < symbolCount; i++) {
                const randomSymbol = symbols[getRandomIndex(symbols.length)];
                const insertIndex = getRandomIndex(passphrase.length + 1); // Posición aleatoria en la passphrase
                passphrase = passphrase.slice(0, insertIndex) + randomSymbol + passphrase.slice(insertIndex);
            }
        }

        return passphrase;
    }

    /**
     * Genera passphrases en lote.
     * @param {number} length - La longitud (número de palabras) de cada passphrase.
     * @param {object} passphraseOptions - Objeto con las opciones avanzadas para la passphrase.
     */
    function generateBatchPassphrases(length, passphraseOptions) {
        const count = parseInt(batchSizeInput.value);
        if (isNaN(count) || count < 2 || count > 50) {
            passwordResultEl.innerHTML = "<div>Número de lote inválido (2-50).</div>";
            updateStrengthMeter("");
            return;
        }
        let passwordsHtml = "";
        let passwordsArray = [];

        for (let n = 0; n < count; n++) {
            // Pasar las opciones a generatePassphrase
            let passphrase = generatePassphrase(
                length,
                passphraseSeparator.value,
                passphraseOptions.capitalizeRandomly,
                passphraseOptions.includeNumbers,
                passphraseOptions.includeSymbols
            );
            passwordsHtml += `<div>${passphrase}</div>`;
            passwordsArray.push(passphrase);
        }
        passwordResultEl.innerHTML = passwordsHtml;
        updateStrengthMeter(passwordsArray[0] || ""); // Muestra la fuerza de la primera para referencia

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

    /**
     * Actualiza la barra de fortaleza de la contraseña.
     * @param {string} password - La contraseña o passphrase para evaluar.
     */
    function updateStrengthMeter(password) {
        let strength = 0;

        if (!password) {
            strengthBar.style.width = "0%";
            strengthBar.style.backgroundColor = "var(--strength-weak)";
            return;
        }

        if (passphraseModeCheck.checked) {
            const words = password.split(passphraseSeparator.value).filter(word => word.length > 0); // Filtra palabras vacías
            const wordCount = words.length;

            // Evaluación de fortaleza para passphrases (ajustada)
            // Una passphrase de 4 palabras ya es muy fuerte si las palabras son aleatorias.
            // Más palabras = más fuerte.
            if (wordCount >= 6) strength = 100;
            else if (wordCount === 5) strength = 90;
            else if (wordCount === 4) strength = 80;
            else if (wordCount === 3) strength = 60;
            else strength = 30; // Menos de 3 palabras es muy débil
        } else {
            // Evaluación de fortaleza para contraseñas regulares (ajustada para ser más precisa)
            // Entropía es la clave. Un enfoque más allá de la longitud pura y tipos.
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasNumbers = /[0-9]/.test(password);
            const hasSymbols = /[^A-Za-z0-9]/.test(password);

            let charTypes = 0;
            if (hasUppercase) charTypes++;
            if (hasLowercase) charTypes++;
            if (hasNumbers) charTypes++;
            if (hasSymbols) charTypes++;

            const length = password.length;

            // Puntuación basada en longitud
            if (length >= 16) strength += 40; // Muy buena longitud
            else if (length >= 12) strength += 25;
            else if (length >= 8) strength += 10;

            // Puntuación basada en tipos de caracteres
            if (charTypes === 4) strength += 40; // Todos los tipos
            else if (charTypes === 3) strength += 25;
            else if (charTypes === 2) strength += 10;

            // Bonificaciones por combinaciones y longitud (ej. 12+ chars y 3+ tipos)
            if (length >= 12 && charTypes >= 3) strength += 10;
            if (length >= 16 && charTypes === 4) strength += 10;

            // Penalización por caracteres ambiguos si no se excluyen y se usan
            // Esta parte ya está manejada por la exclusión.
        }

        strength = Math.min(strength, 100); // Asegurar que no exceda el 100%
        strengthBar.style.width = `${strength}%`;

        if (strength < 40) {
            strengthBar.style.backgroundColor = "var(--strength-weak)";
        } else if (strength < 75) {
            strengthBar.style.backgroundColor = "var(--strength-medium)";
        } else {
            strengthBar.style.backgroundColor = "var(--strength-strong)";
        }
    }

    // --- Configuración Inicial ---
    lengthValueEl.textContent = lengthSlider.value;
    passphraseLengthValue.textContent = passphraseLength.value;
    updateStrengthMeter("");

    // Mejor feedback táctil para botones y opciones
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

    // Evitar zoom en inputs en iOS al enfocar
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

// ===== LÓGICA DEL MODAL DE DONACIONES =====
const donationModal = document.getElementById("donationModal");
const supportLink = document.getElementById("support-link");
const closeButton = document.querySelector("#donationModal .close-button");

// Abrir modal al hacer clic en el enlace "Apoya el Proyecto"
if (supportLink) {
    supportLink.addEventListener("click", (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del enlace
        donationModal.style.display = "flex"; // Mostrar el modal (usando flex para centrado)
        document.body.style.overflow = 'hidden'; // Evitar scroll en el body mientras el modal está abierto
    });
}

// Cerrar modal al hacer clic en el botón 'x'
if (closeButton) {
    closeButton.addEventListener("click", () => {
        donationModal.style.display = "none";
        document.body.style.overflow = ''; // Restaurar scroll del body
    });
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener("click", (event) => {
    if (event.target === donationModal) {
        donationModal.style.display = "none";
        document.body.style.overflow = ''; // Restaurar scroll del body
    }
});

// Mostrar el modal de donaciones como un mensaje sutil, una vez por sesión
const hasSeenDonationPrompt = sessionStorage.getItem("hasSeenDonationPrompt");
if (!hasSeenDonationPrompt) {
    setTimeout(() => {
        if (donationModal.style.display !== "flex") { // Solo mostrar si no está ya abierto
            donationModal.style.display = "flex";
            document.body.style.overflow = 'hidden';
            sessionStorage.setItem("hasSeenDonationPrompt", "true");
        }
    }, 180000); // Mostrar después de 3 minutos (180000 ms)
}

// Lógica del Banner de Cookies
const cookieBanner = document.getElementById("cookieBanner");
const acceptCookies = document.getElementById("acceptCookies");

if (!localStorage.getItem("cookiesAccepted")) {
    cookieBanner.style.display = "flex"; // Mostrar el banner si las cookies no han sido aceptadas
}

acceptCookies.addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true"); // Marcar cookies como aceptadas en localStorage
    cookieBanner.style.display = "none"; // Ocultar el banner
});