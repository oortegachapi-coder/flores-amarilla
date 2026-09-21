/* =====================================================
   ELEMENTOS
===================================================== */

const boton = document.getElementById("comenzar");
const inicio = document.getElementById("inicio");
const contenido = document.getElementById("contenido");
const musica = document.getElementById("musica");
const textoLetra = document.getElementById("texto-letra");
const final = document.getElementById("final");


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const TIEMPO_FINAL = 89;


/* =====================================================
   LETRA
===================================================== */

/*
   ESCRIBE TUS FRASES DENTRO DE LAS COMILLAS.

   Ejemplo:

   { tiempo: 4, texto: "Tu frase aquí" }

   Los tiempos están expresados en segundos.
*/

const letra = [
   {
        tiempo: 4,
        texto: "Vámonos de aquí"
    },

    {
        tiempo: 8,
        texto: "Acompáñame"
    },

    {
        tiempo: 14,
        texto: "Yo te cuidaré"
    },

    {
        tiempo: 15,
        texto: "Como en las pedas y todo lo demás"
    },

    {
        tiempo: 25,
        texto: "Corre y no vuelvas si quieres te ayudo a escapar"
    },

    {
        tiempo: 36,
        texto: "Corre, te sigo, vámonos a cualquier lugar"
    },

    {
        tiempo: 46,
        texto: "Vámonos de viaje y no volver"
    },

    {
        tiempo: 53,
        texto: "Llegar a un hotel a coger"
    },

    {
        tiempo: 59,
        texto: "No importa vamos a estar bien"
    },

    {
        tiempo: 67,
        texto: "Vamos a dejar nuestra ciudad"
    },

    {
        tiempo: 74,
        texto: "Comprarnos ropa de bazar"
    },

    {
        tiempo: 80,
        texto: "No importa todo lo demás"
    },

    {
        tiempo: 89,
        texto: "Ay wey que felicidad"
    }

];


/* =====================================================
   VARIABLES
===================================================== */

let indiceActual = -1;
let iniciado = false;
let terminado = false;
let animacionActual = null;


/* =====================================================
   INICIO
===================================================== */

boton.addEventListener("click", iniciar);


async function iniciar() {

    if (iniciado) {
        return;
    }

    iniciado = true;
    terminado = false;
    indiceActual = -1;

    inicio.classList.add("oculto");

    contenido.classList.add("visible");

    musica.currentTime = 0;
    musica.volume = 0.8;

    try {

        /*
           Recarga el audio antes de reproducirlo.
        */

        musica.load();

        await musica.play();

    } catch (error) {

        console.error(
            "No se pudo reproducir música.mp3:",
            error
        );

        /*
           La página continúa funcionando aunque
           el navegador rechace el audio.
        */
    }

    animacionActual =
        requestAnimationFrame(actualizar);
}


/* =====================================================
   ACTUALIZAR
===================================================== */

function actualizar() {

    if (!iniciado || terminado) {
        return;
    }

    const tiempo = musica.currentTime;


    /* ---------------------------------------------
       COMPROBAR FINAL
    --------------------------------------------- */

    if (tiempo >= TIEMPO_FINAL) {

        terminar();

        return;
    }


    /* ---------------------------------------------
       BUSCAR FRASE ACTUAL
    --------------------------------------------- */

    let nuevoIndice = -1;

    for (
        let i = 0;
        i < letra.length;
        i++
    ) {

        if (
            tiempo >= letra[i].tiempo
        ) {

            nuevoIndice = i;
        }
    }


    /* ---------------------------------------------
       CAMBIAR FRASE
    --------------------------------------------- */

    if (
        nuevoIndice !== -1 &&
        nuevoIndice !== indiceActual
    ) {

        indiceActual = nuevoIndice;

        const texto =
            letra[indiceActual].texto;


        if (
            texto &&
            texto.trim() !== ""
        ) {

            mostrarTexto(texto);

        } else {

            ocultarTexto();
        }
    }


    /* ---------------------------------------------
       CONTINUAR
    --------------------------------------------- */

    animacionActual =
        requestAnimationFrame(actualizar);
}


/* =====================================================
   MOSTRAR TEXTO
===================================================== */

function mostrarTexto(texto) {

    textoLetra.classList.remove("mostrar");

    setTimeout(function () {

        if (terminado) {
            return;
        }

        textoLetra.textContent = texto;

        textoLetra.classList.add("mostrar");

    }, 250);
}


/* =====================================================
   OCULTAR TEXTO
===================================================== */

function ocultarTexto() {

    textoLetra.classList.remove("mostrar");

    setTimeout(function () {

        if (!terminado) {

            textoLetra.textContent = "";
        }

    }, 500);
}


/* =====================================================
   FINAL
===================================================== */

function terminar() {

    if (terminado) {
        return;
    }

    terminado = true;


    /* ---------------------------------------------
       DETENER SINCRONIZACIÓN
    --------------------------------------------- */

    if (
        animacionActual !== null
    ) {

        cancelAnimationFrame(
            animacionActual
        );

        animacionActual = null;
    }


    /* ---------------------------------------------
       DETENER MÚSICA
    --------------------------------------------- */

    musica.pause();


    /* ---------------------------------------------
       OCULTAR LETRA
    --------------------------------------------- */

    textoLetra.classList.remove("mostrar");

    setTimeout(function () {

        textoLetra.textContent = "";

    }, 500);


    /* ---------------------------------------------
       MOSTRAR FINAL
    --------------------------------------------- */

    setTimeout(function () {

        final.classList.add("visible");

    }, 900);


    /* ---------------------------------------------
       PAUSAR LUCIÉRNAGAS
    --------------------------------------------- */

    setTimeout(function () {

        const particulas =
            document.querySelectorAll(
                ".luciernagas span"
            );

        particulas.forEach(function (particula) {

            particula.style.animationPlayState =
                "paused";

        });

    }, 2500);
}


/* =====================================================
   AUDIO TERMINADO
===================================================== */

musica.addEventListener(
    "ended",
    function () {

        if (!terminado) {
            terminar();
        }

    }
);


/* =====================================================
   ERROR DE AUDIO
===================================================== */

musica.addEventListener(
    "error",
    function () {

        console.error(
            "ERROR: No se pudo cargar música.mp3."
        );

    }
);


/* =====================================================
   AUDIO LISTO
===================================================== */

musica.addEventListener(
    "canplaythrough",
    function () {

        console.log(
            "✓ música.mp3 está listo para reproducirse."
        );

    }
);
