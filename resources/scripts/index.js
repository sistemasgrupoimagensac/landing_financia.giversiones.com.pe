function changeDocument() {
    var option = document.getElementById('selectDocumento').value;
    var dni = document.getElementById('nDNI');
    switch (option) {
        case '1':
            dni.setAttribute('maxlength','8')
            break;

        case '2':
            dni.setAttribute('maxlength','12')
            dni.setAttribute('minlength','12')
            break;

        case '3':
            dni.setAttribute('maxlength','12')
            break;
            
        default:
            break;
    }
    dni.value = '';
}

function getData() {
    var x = document.getElementById("nDNI");
    if (x.value.length < 1) {
        document.getElementById("txtCelular").value = "";
        document.getElementById("txtNombres").value = "";
        document.getElementById("txtApellidos").value = "";
        document.getElementById("txtCorreo").value = "";
    }

    if (x.value.length == 8) {
        var dni = x.value;
        var urlencoded = new URLSearchParams();

        var requestOptions = {
            method: "POST",
            body: urlencoded,
            redirect: "follow",
        };

        fetch(
                `https://sistema.grupoimagensac.com.pe/api/consulta-dni?numero=${dni}`,
                requestOptions
            )
            .then((response) => response.text())
            .then((result) => {
                var datos = JSON.parse(result);
                if ((datos.celular != "") & (datos.celular != undefined)) {
                    document.getElementById("txtCelular").value = datos.celular;
                }
                if ((datos.nombres != "") & (datos.nombres != undefined)) {
                    document.getElementById("txtNombres").value = datos.nombres;
                }
                if ((datos.paterno != "") & (datos.paterno != undefined)) {
                    document.getElementById("txtApellidos").value =
                        datos.paterno + " " + datos.materno;
                }
                if ((datos.correo != "") & (datos.correo != undefined)) {
                    document.getElementById("txtCorreo").value = datos.correo;
                }
            })
            .catch((error) => console.log("Error: ", error));
    }
}

var form = document.getElementById("formInversiones");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let modal = document.querySelector(".modal-background");
    modal.classList.add("show");

    const landing = "GInversiones - Inversiones";
    const tipo_producto = 3;
    const origen = 35;
    var dni = document.getElementById("nDNI").value;
    var nombres = document.getElementById("txtNombres").value;
    var apellidos = document.getElementById("txtApellidos").value;
    var celular = document.getElementById("txtCelular").value;
    var correo = document.getElementById("txtCorreo").value;
    var monto_rdButtons = document.getElementsByName('radioBtnMonto');
    var monto;
    for (let i = 0; i < monto_rdButtons.length; i++) {
        if(monto_rdButtons[i].checked) {
            monto = monto_rdButtons[i].value;
        }
    }

    let url='https://sistema.grupoimagensac.com.pe/api/guardar-datos-inversion?';
    url += "numero=" + dni;
    url += "&nombres=" + nombres;
    url += "&apellidos=" + apellidos;
    url += "&celular=" + celular;
    url += "&correo=" + correo;
    url += "&tipo_producto=" + tipo_producto;
    url += "&origen=" + origen;
    var requestOptions = {
        method: "POST",
        redirect: "follow",
      };
    fetch(url, requestOptions)
        .then((response) => response.text())
        .catch((error) => {
            modal.classList.remove("show");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Sucedió un error!',
                footer: '<a href="https://wa.me/+51902759899">Intente contactarse por Whatsapp clickendo este mensaje</a>'
              })
        });

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
    var urlencoded = new URLSearchParams();
    urlencoded.append("landing", landing);
    urlencoded.append("dni", dni);
    urlencoded.append("nombres", nombres);
    urlencoded.append("apellidos", apellidos);
    urlencoded.append("celular", celular);
    urlencoded.append("correo", correo);
    urlencoded.append("monto", monto);
    
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };
    
    fetch("https://360creative.pe/landing-inversiones", requestOptions)
        .then(response => response.text())
        .then((result) => {
            window.location.href = "/gracias.html";
        })
        .catch(() => {
            modal.classList.remove("show");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Sucedió un error!',
                footer: '<a href="https://wa.me/+51902759899">Intente contactarse por Whatsapp clickendo este mensaje</a>'
              })
        });
});