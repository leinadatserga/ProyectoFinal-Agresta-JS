/* - - - Generar avisos - - - */

const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
});

const notificacion = (icono, notificacion) => {
Toast.fire({
    icon: icono,
    title: notificacion
})
};

const mensaje = (icono, mensaje) => {
    Swal.fire({
        icon: icono,
        title: mensaje,
        timer: 3500,
        timerProgressBar: true,
        showClass: {
          popup: `
            animate__animated
            animate__bounceIn
            animate__fast
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__bounceOut
            animate__fast
          `
        }
    });
};