/* - - - Insulina - - - */

function generarMensajeAdvertencia(periodo, glucosa, tipo) {
    const mensajeTipo = tipo === "HIPERGLUCEMIA" ? "superior a 200 mg/dL" : "inferior a 50 mg/dL";
    return `¡ADVERTENCIA!: Su valor de glucosa ${periodo + " -"} ${glucosa} mg/dL, es ${mensajeTipo} lo que supone una <strong><em>${tipo}</em></strong>. Se sugiere CONSULTA INMEDIATA.`;
}

function verificarValor(glucosa, periodo) {
    if (glucosa > 200) {
        return generarMensajeAdvertencia(periodo, glucosa, "HIPERGLUCEMIA");
    } else if (glucosa < 50) {
        return generarMensajeAdvertencia(periodo, glucosa, "HIPOGLUCEMIA");
    }
    return null;
}

function redirigir() {
    window.location.href = "../index.html";
}

function validarLectura(glucosa, periodo) {
    if (isNaN(glucosa)) {
        return `El valor de glucosa en el campo <strong><em>${periodo.toUpperCase()}</em></strong> es requerido y debe ser un número.`;
    }
    if (glucosa < 20 || glucosa > 300) {
        return `El valor de glucosa en el campo <strong><em>${periodo.toUpperCase()}</em></strong> debe estar entre 20 y 300 mg/dL.`;
    }
    return null;
}

const periodos = ["Ayunas", "PreColacion", "PostAlmuerzo", "Merienda"];

periodos.forEach(periodo => {
    const input = document.getElementById(`glucosa${periodo}`);
    input.addEventListener("focus", () => {
        document.querySelector(".aviso").textContent = "";
    });
});

function calcularInsulina() {
    const valoresGlucosa = [];
    let alertas = [];
    let tieneErrores = false;
    const aviso = document.querySelector(".aviso");
    aviso.textContent = "";

    for (let i = 0; i < periodos.length; i++) {
        const periodo = periodos[i];
        const glucosa = parseFloat(document.getElementById(`glucosa${periodo}`).value);
        valoresGlucosa[i] = glucosa;

        const validacion = validarLectura(glucosa, periodo);
        if (validacion) {
            alertas.push(validacion);
            tieneErrores = true;
        } else {
            const resultado = verificarValor(glucosa, periodo);
            if (resultado) alertas.push(resultado);
        }
    }

    if (tieneErrores) {
        document.querySelector(".aviso").innerHTML = alertas.join("\n");
        return;
    }

    const objetivoGlucosa = 120;
    const factorCorreccion = 50;
    let insulinaTotal = 0;
    const dosisInsulina = [];

    for (let i = 0; i < valoresGlucosa.length; i++) {
        const diferencia = valoresGlucosa[i] - objetivoGlucosa;
        const dosis = diferencia > 0 ? diferencia / factorCorreccion : 0;
        dosisInsulina[i] = dosis;
        insulinaTotal += dosis;
    }

    let resultadoParaHTML = "<p>Insulina necesaria:</p><ul>";
    for (let i = 0; i < periodos.length; i++) {
        resultadoParaHTML += `<li>${periodos[i]}: ${dosisInsulina[i].toFixed(2)} unidades</li>`;
    }
    resultadoParaHTML += `<li><strong>Total diaria: ${insulinaTotal.toFixed(2)} unidades</strong></li></ul>`;
    
    document.getElementById("resultado").innerHTML = resultadoParaHTML;

    if (alertas.length > 0) {
        document.querySelector(".advertencia").innerHTML = alertas.join("\n");
    }
}

function reiniciarFormulario() {
    for (let i = 0; i < periodos.length; i++) {
        document.getElementById(`glucosa${periodos[i]}`).value = "";
    }
    document.querySelector(".aviso").innerHTML = "";
    document.getElementById("resultado").innerHTML = "";
    document.querySelector(".advertencia").innerHTML = "";
}
