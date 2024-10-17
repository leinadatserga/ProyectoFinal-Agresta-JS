/* - - - Insulina - - - */

let url = "../assets/archivosPersistencia/insulina.json";
let datosCalculos = {
    dosisInsulina: [],
    insulinaTotal: 0,
    tieneErrores: false
};

async function insulinaFetch() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            notificacion("error", `Error al cargar los datos: ${response.status}`);
            return;
        }
        const datos = await response.json();
        guardarDatos(datos);
        mostrarDatos();
    } catch (error) {
        notificacion("error", error.message);
    }
};
function generarMensajeAdvertencia(periodo, glucosa, tipo) {
    const mensajeTipo = tipo === "HIPERGLUCEMIA" ? "superior a 200 mg/dL" : "inferior a 50 mg/dL";
    return `¡ADVERTENCIA!: Su valor de glucosa ${periodo + " -"} ${glucosa} mg/dL, es ${mensajeTipo} lo que supone una <strong><em>${tipo}</em></strong>. Se sugiere CONSULTA INMEDIATA.`;
};


function verificarValor(glucosa, periodo) {
    if (glucosa > 200) {
        return generarMensajeAdvertencia(periodo, glucosa, "HIPERGLUCEMIA");
    } else if (glucosa < 50) {
        return generarMensajeAdvertencia(periodo, glucosa, "HIPOGLUCEMIA");
    }
    return null;
};

function redirigir() {
    window.location.href = "../index.html";
};

function validarLectura(glucosa, periodo) {
    if (isNaN(glucosa)) {
        return `El valor de glucosa en el campo <strong><em>${periodo.toUpperCase()}</em></strong> es requerido y debe ser un número.`;
    }
    if (glucosa < 20 || glucosa > 300) {
        return `El valor de glucosa en el campo <strong><em>${periodo.toUpperCase()}</em></strong> debe estar entre 20 y 300 mg/dL.`;
    }
    return null;
};

const periodos = ["Ayunas", "PreColacion", "PostAlmuerzo", "Merienda"];

periodos.forEach(periodo => {
    const input = document.getElementById(`glucosa${periodo}`);
    input.addEventListener("focus", () => {
    });
});

function guardarDatos(datosFetch) {
    let datosGuardados;
    const datosLS = JSON.parse(localStorage.getItem("resultados")) || [];
    if (datosFetch) {
        datosGuardados = datosFetch.concat(datosLS);
        localStorage.setItem("resultados", JSON.stringify(datosGuardados));
    } else {
        const diaActual = Math.floor(datosLS.length / (periodos.length + 1)) + 1;
        const valoresGlucosa = periodos.map((periodo, i) => ({
            dia: `#${diaActual}`,
            periodo: periodo,
            glucosa: parseFloat(document.getElementById(`glucosa${periodo}`).value),
            dosis: datosCalculos.dosisInsulina[i] || 0
        }));
        valoresGlucosa.push({
            dia: `#${diaActual}`,
            periodo: `<strong>Total Diaria</strong>`,
            glucosa: "",
            dosis: `<strong>${(datosCalculos.insulinaTotal).toFixed(2)}</strong>`
        });
        datosGuardados = datosLS.concat(valoresGlucosa);
        localStorage.setItem("resultados", JSON.stringify(datosGuardados));
        mostrarDatos();
        document.getElementById("guardarDatos").disabled = true;
        reiniciarFormulario();
        mensaje("success", "Los valores se han almacenado con exito!!!");
        setTimeout(() => {
            document.querySelector("#tablaResultados").scrollIntoView({ behavior: "smooth", block: "end" });
        }, 5000);
        
    }
};

function mostrarDatos() {
    const tablaBody = document.querySelector("#tablaResultados tbody");
    tablaBody.innerHTML = "";
    const datosGuardados = JSON.parse(localStorage.getItem("resultados")) || []; 
    datosGuardados.forEach(({ dia, periodo, glucosa, dosis }) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${dia}</td><td>${periodo}</td><td>${glucosa}</td><td>${dosis}</td>`;
        tablaBody.appendChild(fila);
    });
};

function calcularInsulina() {
    const valoresGlucosa = [];
    let alertas = [];
    datosCalculos.tieneErrores = false;

    for (let i = 0; i < periodos.length; i++) {
        const periodo = periodos[i];
        const glucosa = parseFloat(document.getElementById(`glucosa${periodo}`).value);
        valoresGlucosa[i] = glucosa;

        const validacion = validarLectura(glucosa, periodo);
        if (validacion) {
            alertas.push(validacion);
            datosCalculos.tieneErrores = true;
        } else {
            const resultado = verificarValor(glucosa, periodo);
            if (resultado) alertas.push(resultado);
        }
    }

    if (datosCalculos.tieneErrores) {
        notificacion("error", alertas.join("\n"));
        return;
    }

    const objetivoGlucosa = 120;
    const factorCorreccion = 50;

    for (let i = 0; i < valoresGlucosa.length; i++) {
        const diferencia = valoresGlucosa[i] - objetivoGlucosa;
        const dosis = (diferencia > 0 ? diferencia / factorCorreccion : 0);
        datosCalculos.dosisInsulina[i] = dosis;
        datosCalculos.insulinaTotal += dosis;
    }

    let resultadoParaHTML = "<p>Insulina necesaria:</p><ul>";
    for (let i = 0; i < periodos.length; i++) {
        resultadoParaHTML += `<li>${periodos[i]}: ${datosCalculos.dosisInsulina[i]} unidades</li>`;
    }
    resultadoParaHTML += `<li><strong>Total diaria: ${(datosCalculos.insulinaTotal).toFixed(2)} unidades</strong></li></ul>`;
    
    document.getElementById("resultado").innerHTML = resultadoParaHTML;

    if (alertas.length > 0) {
        mensaje("info", alertas.join("\n"));
    }
    document.getElementById("guardarDatos").disabled = datosCalculos.tieneErrores;
};

function reiniciarFormulario() {
    for (let i = 0; i < periodos.length; i++) {
        document.getElementById(`glucosa${periodos[i]}`).value = "";
    }
    document.getElementById("resultado").innerHTML = "";
};

document.addEventListener("DOMContentLoaded", async () => {
    const buscarLS = JSON.parse(localStorage.getItem("resultados"));
    if (!buscarLS) {
        await insulinaFetch();
    } else {
        mostrarDatos();
    }
});