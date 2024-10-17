/* - - - Cargar Registros JSON - - - */

function cargarRegistrosJSON() {
    const guardarRegistroButton = document.getElementById("guardarRegistro");
    guardarRegistroButton.disabled = true;
    fetch("../assets/archivosPersistencia/registros.json")
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los registros.');
            }
            return response.json();
        })
        .then(data => {
            mostrarRegistrosDesdeJSON(data);
            fuenteDeLosDatos = "json";
        })
        .catch(error => {
            notificacion("error", error.message);
        });
};

function mostrarRegistrosDesdeJSON(data) {
    registrosFetch = data;
    const enviarRegistrosButton = document.getElementById("enviarRegistros");
    enviarRegistrosButton.disabled = false;
    const registroDiario = document.getElementById("registroDiario");
    registroDiario.innerHTML = "";
    const tabla = document.createElement("table");
    const encabezados = ["Fecha Ingreso", "Día Registrado", ...etiquetas];
    const filaEncabezados = document.createElement("tr");

    encabezados.forEach(encabezado => {
        const th = document.createElement("th");
        th.innerText = encabezado;
        filaEncabezados.appendChild(th);
    });
    
    tabla.appendChild(filaEncabezados);

    data.forEach(registro => {
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
};

