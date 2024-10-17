/* - - - Enviar Registros - - - */

function enviarRegistrosPorEmail(registros) {
    const registrosJSON = JSON.stringify(registros) || [];
    const enlaceMailto = `mailto:?subject=Registros de Glucosa&body=${encodeURIComponent(registrosJSON)}`;
    const enviarRegistrosButton = document.getElementById("enviarRegistros");
    enviarRegistrosButton.disabled = true;
    const cargarRegistrosButton = document.getElementById("cargarRegistros");
    cargarRegistrosButton.disabled = true;
    window.location.href = enlaceMailto;
};
