/* - - - Registro - - - */

let registros = JSON.parse(localStorage.getItem("registros")) || [];
const etiquetas = [
    "Antes del desayuno", 
    "Después del desayuno", 
    "Antes del almuerzo", 
    "Después del almuerzo", 
    "Antes de la cena", 
    "Después de la cena", 
    "Antes de ir a dormir"
];
console.log(registros);

registros.length == 0 ?  document.getElementById("registroDiario").innerText = "> > > > > > No hay registros que mostrar " : mostrarRegistros();
function infoContenido(contenido) {
    const info = document.getElementById("info");
    info.innerText = contenido;
    destellar(info);
}

function destellar(contenido) {
    let intervalo;
    let visible = true;
    intervalo = setInterval(() => {
        contenido.style.opacity = visible ? '0' : '1';
        visible = !visible;
    }, 500);
    setTimeout(() => {
        clearInterval(intervalo);
        contenido.style.opacity = '1';
        contenido.innerText = "";
    }, 10000);
}

function guardarRegistroLS(nuevoRegistro) {
    const registrosGuardados = JSON.parse(localStorage.getItem("registros")) || [];
    const registrosActualizados = [...registrosGuardados, nuevoRegistro];
    registros = registrosActualizados;
    localStorage.setItem("registros", JSON.stringify(registrosActualizados));
  }

function guardarDatos() {
    const fecha = document.getElementById("fechaRegistro").innerText;    
    const diaSeleccionado = document.getElementById("diaSeleccionado").value;
    const mili = new Date().getTime();    

    if (!fecha || !diaSeleccionado) {
        infoContenido("< < < < < Por favor, selecciona un día de la semana para tu registro.");
        return;
    }

    const formulario = document.getElementById(diaSeleccionado);
    if (!validarFormulario(formulario)) {
        return;
    }

    const niveles = Array.from(document.querySelectorAll(`#${diaSeleccionado} .glucose`))
        .map(input => parseFloat(input.value) || null);    
    const registroJSON = { fechaIngreso: fecha, diaRegistrado: diaSeleccionado, niveles };
    guardarRegistroLS(registroJSON);
    infoContenido("¡ ¡ ¡ ¡ ¡ ¡ REGISTROS GUARDADOS EXITOSAMENTE ! ! ! ! ! !.");
    hacerOtroRegistro();
    mostrarRegistros();
}

function mostrarRegistros() {
    const registroDiario = document.getElementById("registroDiario");
    registroDiario.innerHTML = "";
    const tabla = document.createElement("table");
    const encabezados = ["Fecha Ingreso", "Día Registrado", etiquetas[0], etiquetas[1], etiquetas[2], etiquetas[3], etiquetas[4], etiquetas[5], etiquetas[6]];
    const filaEncabezados = document.createElement("tr");
    encabezados.forEach(encabezado => {
        const th = document.createElement("th");
        th.innerText = encabezado;
        filaEncabezados.appendChild(th);
    });
    tabla.appendChild(filaEncabezados);
    registros.forEach(registro => {
        const fila = document.createElement("tr");
        
        const tdFecha = document.createElement("td");
        tdFecha.innerText = registro.fechaIngreso;
        fila.appendChild(tdFecha);

        const tdDia = document.createElement("td");
        tdDia.innerText = registro.diaRegistrado;
        fila.appendChild(tdDia);

        etiquetas.forEach((etiqueta, index) => {
            const tdNivel = document.createElement("td");
            const nivel = registro.niveles[index] !== undefined ? `${registro.niveles[index]} mg/dL` : "N/A";
            tdNivel.innerText = nivel;
            fila.appendChild(tdNivel);
        });

        tabla.appendChild(fila);
    });
    registroDiario.appendChild(tabla);
}

function hacerOtroRegistro() {
    document.getElementById("formularios").innerHTML = "";
}

function mostrarFormulario(dia) {
    document.getElementById("info").innerText = "";
    const formulariosDiv = document.getElementById("formularios");
    formulariosDiv.innerHTML = "";

    if (dia) {
        formulariosDiv.style.display = "block";
        const formulario = document.createElement("div");
        formulario.className = "formulario-dia";
        formulario.id = dia;

        const titulo = document.createElement("h3");
        titulo.textContent = dia;
        formulario.appendChild(titulo);

        etiquetas.forEach(etiqueta => {
            const label = document.createElement("label");
            label.textContent = `${etiqueta}: `;
            const input = document.createElement("input");
            input.type = "number";
            input.id = `${etiqueta}`;
            input.step = "1";
            input.className = "glucose";
            input.placeholder = "valor de 20 a 300 (mg/dL)";
            input.min = 20;
            input.max = 300;
            input.required = true;
            input.addEventListener("focus", () => infoContenido(""));
            label.appendChild(input);
            formulario.appendChild(label);
        });

        formulariosDiv.appendChild(formulario);
    } else {
        formulariosDiv.style.display = "none";
    }
}

function validarFormulario(formulario) {
    const inputs = formulario.querySelectorAll(".glucose");
    for (const input of inputs) {
        const valor = parseFloat(input.value);
        if (isNaN(valor) || valor < 20 || valor > 300) {
            infoContenido(`< < < < < < El valor "${input.id}", debe ser numérico y estar entre 20 y 300 (mg/dL).`);
            return false;
        }
    }
    return true;
}

function redirigir() {
    window.location.href = "../index.html";
}

function formatearFecha(fecha) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const minuto = fecha.getMinutes();
    let minutos;
    minuto > 9 ? minutos = minuto : minutos = "0" + minuto;    
    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    const hora = fecha.getHours();
    return `${diaSemana} ${dia} de ${mes} de ${año} - ${hora}:${minutos}`;
}

function mostrarFecha() {
    const fechaActual = new Date();
    let fechaFormateada =  formatearFecha(fechaActual);
    const fechaRegistro = document.getElementById("fechaRegistro") || "";
    fechaRegistro.textContent = fechaFormateada;
}

window.onload = mostrarFecha;

