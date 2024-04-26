document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    cargarTabla();
    document.getElementById("txtNombre").onkeyup = e => revisarControl(e, 2, 60);
    document.getElementById("txtTelefono").onkeyup = e => {
        if (e.target.value.trim().length > 0)
            revisarControl(e, 10, 10);
    }
    document.getElementById("txtPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }
    document.getElementById("txtConfirmarPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }

    document.getElementById("btnLimpiar").addEventListener("click", e => {
        e.target.form.classList.remove("validado");
        //Iterar todos los controles del form
        //debugger;
        let controles = e.target.form.querySelectorAll("input,select");
        controles.forEach(control => {
            control.classList.remove("valido");
            control.classList.remove("novalido");
        });
        //console.log(controles);
    });
    document.getElementById("btnAceptar").addEventListener("click", e => {
        //document.getElementById("msgDuplicado").classList.remove("show");
        //debugger;
        let alert = e.target.parentElement.querySelector(".alert");
        if (alert) {
            alert.remove();
        }

        e.target.form.classList.add("validado");
        let txtNombre = document.getElementById("txtNombre");
        let txtContrasenia = document.getElementById("txtPassword");
        let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let txtTel = document.getElementById("txtTelefono");
        txtNombre.setCustomValidity("");
        txtContrasenia.setCustomValidity("");
        txtContrasenia2.setCustomValidity("");
        txtEmail.setCustomValidity("");
        txtTel.setCustomValidity("");

        if (txtNombre.value.trim().length < 2 ||
            txtNombre.value.trim().length > 60) {
            txtNombre.setCustomValidity("El nombre es obligatorio (entre 2 y 60 caracteres)");
        }
        if (txtContrasenia.value.trim().length < 6 ||
            txtContrasenia.value.trim().length > 20) {
            txtContrasenia.setCustomValidity("La contraseña es obligatoria (entre 2 y 60 caracteres)");
        }
        if (txtContrasenia2.value.trim().length < 6 ||
            txtContrasenia2.value.trim().length > 20) {
            txtContrasenia2.setCustomValidity("Confirma la contraseña");
        }

        if (txtTel.value.trim().length > 0 && txtTel.value.trim().length != 10) {
            txtTel.setCustomValidity("El teléfono debe tener 10 dígitos");
        }


        if (e.target.form.checkValidity()) {
            //Crear el objeto usuario y guardarlo en el storage
            let correo=document.getElementById("txtCorreoOriginal").value.trim();
            let usuario = {
                nombre: txtNombre.value.trim(),
                correo: txtEmail.value.trim(),
                contrasenia: txtContrasenia.value.trim(),
                telefono: txtTelefono.value.trim()
            };
            
            let usuarios = JSON.parse(localStorage.getItem("usuarios"));
            if(document.querySelector("#mdlRegistro .modal-title").innerText=='Agregar'){
                let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
                if (usuarioEncontrado) {
                    
                    let alerta = document.createElement('div');
                    alerta.innerHTML = 'Este correo ya se encuentra registrado, favor de usar otro <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                    alerta.className = "alert alert-warning alert-dismissible fade show";
                    
                    e.target.parentElement.insertBefore(alerta, e.target);
                    //e.target.parentElement.innerHTML=alerta+e.target.parentElement.innerHTML;
                    //debugger;
                    //document.getElementById("msgDuplicado").classList.add("show");
                    setTimeout(() => {
                        //Destruir la alerta
                        alerta.remove();
                    }, 3000);

                    e.preventDefault();
                    return;
                }
                usuarios.push(usuario);
            }else{
                if(usuario.correo!=correo){
                    let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
                    if (usuarioEncontrado) {
                        let alerta = document.createElement('div');
                        alerta.innerHTML = 'Este correo ya se encuentra registrado, favor de usar otro <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
                        alerta.className = "alert alert-warning alert-dismissible fade show";
                        
                        e.target.parentElement.insertBefore(alerta, e.target);
                    
                        setTimeout(() => {
                            alerta.remove();
                        }, 3000);
    
                        e.preventDefault();
                        return;
                    }
                }
            }
            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            /*const mdlRegistro = bootstrap.Modal.getInstance('#mdlRegistro');
            mdlRegistro.hide();*/
        } else {
            e.preventDefault();
        }
    });

    document.getElementById("mdlRegistro").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("btnLimpiar").click();
        let operacion=e.relatedTarget.innerText;
        
        e.target.querySelector(".modal-title").innerText=operacion;

        //Identificar si vamos editar para cargar los datos
        if(operacion=='Editar'){
            let correo=e.relatedTarget.value;
            let usuarios=JSON.parse(localStorage.getItem('usuarios'));
            let usuario=usuarios.find((element=>element.correo==correo));
            document.getElementById("txtNombre").value=usuario.nombre;
            document.getElementById("txtEmail").value=usuario.correo;
            document.getElementById("txtCorreoOriginal").value=usuario.correo;
            document.getElementById("txtTelefono").value=usuario.telefono;
        }
        document.getElementById("txtNombre").focus();
        
    })
});

function revisarControl(e, min, max) {
    txt = e.target;
    txt.setCustomValidity("");
    txt.classList.remove("valido");
    txt.classList.remove("novalido");
    if (txt.value.trim().length < min ||
        txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no válido");
        txt.classList.add("novalido");
    } else {
        txt.classList.add("valido");
    }
    /*console.log(txt.value);
    console.log(txt.validity);*/
}

function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    for (var i = 0; i < usuarios.length; i++) {
        usuario = usuarios[i];
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.innerText = usuario.nombre;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#mdlUpdate" value="' + usuario.correo + '" onclick="editar(' + i + ')">Editar</button>'
            + '<button type = "button" class="btn btn-warning"  data-bs-toggle="modal" data-bs-target="#mdlDelete" value = "' + usuario.correo + '" onclick = "editar(' + i + ')">Eliminar</button>'
            + '<button type="button" class="btn btn btn-success" data-bs-toggle="modal" data-bs-target="#mdlResetPassword" value="' + usuario.correo + '" onclick="editar(' + i + ')">Restablecer contraseña</button>';
        fila.appendChild(celda);
        tbody.appendChild(fila);
    }

}

function inicializarDatos() {
    let usuarios = localStorage.getItem('usuarios');
    if (!usuarios) {
        usuarios = [
            {
                nombre: 'Uriel Perez Gomez',
                correo: 'uriel@gmail.com',
                password: '123456',
                telefono: ''
            },
            {
                nombre: 'Lorena Garcia Hernandez',
                correo: 'lorena@gmail.com',
                password: '567890',
                telefono: '4454577468'
            }
        ];

        //let usuarios=[];
        usuarios.push(
            {
                nombre: 'Uriel Perez Gomez',
                correo: 'uriel1@gmail.com',
                password: '123456',
                telefono: ''
            });
        usuarios.push(
            {
                nombre: 'Lorena Garcia Hernandez',
                correo: 'lorena1@gmail.com',
                password: '567890',
                telefono: '4454577468'
            });

        localStorage.setItem('usuarios', JSON.stringify(usuarios));

    }
}