const Contacto = function (nombre, apellido, telfijo, telmovil, direccion, email) {
    this.nombre = nombre
    this.apellido = apellido
    this.telfijo = telfijo
    this.telmovil = telmovil
    this.direccion = direccion
    this.email = email
}
const listadeContactos = [];
const agendaDiv = document.getElementById("agenda");

// Cargar carrito desde localStorage al iniciar
window.onload = cargarAgenda;

if (listadeContactos.length === 0) {
    agendaDiv.innerHTML = "<p>Tu agenda está vacía</p>";
} else {
    mostrarContactos();
}

let botonagregar = document.getElementById("bagregar");
botonagregar.addEventListener("click", agregarContacto);

let botonvaciar = document.getElementById("bvaciar");
botonvaciar.addEventListener("click", vaciarAgenda);

let botonbuscar = document.getElementById("bbuscar");
botonbuscar.addEventListener("click", buscarEnAgenda);

let botonfiltrar = document.getElementById("bfiltrar");
botonfiltrar.addEventListener("click", filtrarEnAgenda);

let botonquitar = document.getElementById("bquitar");
botonquitar.addEventListener("click", mostrarContactos);

function agregarContacto() {
    Swal.fire({
        title: "Nuevo contacto",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Nombre">
          <input id="swal-input2" class="swal2-input" placeholder="Apellido">
          <input id="swal-input3" class="swal2-input" placeholder="Telefono Fijo">
          <input id="swal-input4" class="swal2-input" placeholder="Telefono Movil">
          <input id="swal-input5" class="swal2-input" placeholder="Direccion">
          <input id="swal-input6" class="swal2-input" placeholder="E-mail">
        `,
        showCancelButton: true,
        confirmButtonText: "agregar",
        confirmButtonColor: "#4CAF50",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            let nombre = document.getElementById("swal-input1").value
            let apellido = document.getElementById("swal-input2").value
            let telfijo = parseInt(document.getElementById("swal-input3").value)
            let telmovil = parseInt(document.getElementById("swal-input4").value)
            let direccion = document.getElementById("swal-input5").value
            let email = document.getElementById("swal-input6").value

            if (isNaN(telmovil) || isNaN(telfijo) || nombre == "" || apellido == "") {
                Swal.fire({
                    icon: "error",
                    title: "error",
                    text: "por favor ingresa datos validos"
                })
                return;
            }

            let contacto = new Contacto(nombre, apellido, telfijo, telmovil, direccion, email)
            listadeContactos.push(contacto)
            mostrarContactos();
            resultadobien("Contacto agregado")
            guardarAgenda()
        }
    })
}

function buscarEnAgenda() {
    Swal.fire({
        title: "Buscar por nombre",
        html: `<input id="busqueda" class="swal2-input" placeholder="Nombre">`,
        showCancelButton: true,
        confirmButtonText: "Buscar",
        confirmButtonColor: "#4CAF50",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            const resp = document.getElementById("busqueda").value
            if (resp == "") {
                Swal.fire({
                    icon: "error",
                    title: "error",
                    text: "Introducir un parametro valido a buscar",
                    confirmButtonColor: "#4CAF50"
                })
            } else {
                const busq = listadeContactos.find(el => el.nombre === resp);
                const index = listadeContactos.findIndex(el => el.nombre === resp)
                if (busq === undefined) {
                    resultadomal("No se encontraron coincidencias");
                } else {
                    resultadobien("Se encontraron coincidencias");
                    let mensaje = `<ul>`;
                    mensaje += `Busqueda: "${resp}"`
                    mensaje += `
                        <li>${busq.nombre} ${busq.apellido} - Telefono: ${busq.telmovil} - E-MAIL: ${busq.email}
                        <button onclick="editarContacto(${index})">Editar</button>
                        <button onclick="borrarContacto(${index})">Borrar</button>
                        </li>
                        `;

                    mensaje += `</ul>`;
                    agendaDiv.innerHTML = mensaje;
                }
            }
        }
    }
    )
}

function borrarContacto(index) {
    listadeContactos.splice(index, 1);
    guardarAgenda();
    mostrarContactos();
    resultadobien("Contacto borrado")
}

function editarContacto(index) {
    let contacto = listadeContactos[index];
    Swal.fire({
        title: "Editar contacto",
        html: `
          <input id="swal-input1" class="swal2-input" placeholder="Nombre" value="${contacto.nombre}">
          <input id="swal-input2" class="swal2-input" placeholder="Apellido" value="${contacto.apellido}">
          <input id="swal-input3" class="swal2-input" placeholder="Telefono Fijo" value="${contacto.telfijo}">
          <input id="swal-input4" class="swal2-input" placeholder="Telefono Movil" value="${contacto.telmovil}">
          <input id="swal-input5" class="swal2-input" placeholder="Direccion" value="${contacto.direccion}">
          <input id="swal-input6" class="swal2-input" placeholder="E-mail" value="${contacto.email}">
        `,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        confirmButtonColor: "#4CAF50",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            listadeContactos[index].nombre = document.getElementById("swal-input1").value;
            listadeContactos[index].apellido = document.getElementById("swal-input2").value;
            listadeContactos[index].telfijo = document.getElementById("swal-input3").value;
            listadeContactos[index].telmovil = document.getElementById("swal-input4").value;
            listadeContactos[index].direccion = document.getElementById("swal-input5").value;
            listadeContactos[index].email = document.getElementById("swal-input6").value;
            guardarAgenda();
            mostrarContactos();
            resultadobien("Contacto editado")
        }
    });
}

function mostrarContactos() {
    const agendaDiv = document.getElementById("agenda");
    if (listadeContactos.length === 0) {
        agendaDiv.innerHTML = "<p>Tu agenda está vacía</p>";
    } else {
        let mensaje = `<h3>Tu agenda tiene ${listadeContactos.length} contactos: </h3>`;
        mensaje += "<ul>";
        listadeContactos.forEach((cont, index) => {
            mensaje += `
                <li>${cont.nombre} ${cont.apellido} - Telefono: ${cont.telmovil} - E-MAIL: ${cont.email}
                <button onclick="editarContacto(${index})">Editar</button>
                <button onclick="borrarContacto(${index})">Borrar</button>
                </li>
                `;
        })
        mensaje += "</ul>";
        agendaDiv.innerHTML = mensaje;
        resultadobien("Filtros eliminados")
    }
}

function vaciarAgenda() {
    Swal.fire({
        title: "¿Está seguro de eliminar todos los contactos?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#4CAF50",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            listadeContactos.length = 0;
            mostrarContactos();
            resultadobien("Contactos eliminados");
            guardarAgenda();
        }
        return;
    })
}

let resultadobien = parametro => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
      icon: "success",
      title: parametro
    });
}

let resultadomal = parametro => {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
      icon: "error",
      title: parametro
    });
}

function filtrarEnAgenda() {
    Swal.fire({
        title: "Filtrar por nombre",
        html: `<input id="busqueda" class="swal2-input" placeholder="Nombre">`,
        showCancelButton: true,
        confirmButtonText: "Filtrar",
        confirmButtonColor: "#4CAF50",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            const resp = document.getElementById("busqueda").value
            if (resp == "") {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Introducir un parametro valido para filtrar"
                })
            } else {
                const busc = listadeContactos.filter(el => el.nombre.trim().includes(resp));
                const agendaDiv = document.getElementById("agenda");
                if (busc.length === 0) {
                    resultadomal("No se encontraron coincidencias")
                } else {
                    resultadobien(`Se encontraron ${busc.length} coincidencias`)
                    let mensaje = "<ul>";
                    mensaje += `Filtro aplicado: "${resp}"`;
                    busc.forEach((cont, index) => {
                        mensaje += `
                            <li>${cont.nombre} ${cont.apellido} - Telefono: ${cont.telmovil} - E-MAIL: ${cont.email}
                            <button onclick="editarContacto(${index})">Editar</button>
                            <button onclick="borrarContacto(${index})">Borrar</button>
                            </li>
                            `;
                    })
                    mensaje += "</ul>";
                    agendaDiv.innerHTML = mensaje;
                }
            }
        }
    })
}

function guardarAgenda() {
    localStorage.setItem("listadeContactos", JSON.stringify(listadeContactos));
}

function cargarAgenda() {
    const agendaGuardada = localStorage.getItem("listadeContactos");
    if (agendaGuardada) {
        listadeContactos.push(...JSON.parse(agendaGuardada));
    }
    mostrarContactos();
    resultadobien("Agenda cargada")
}