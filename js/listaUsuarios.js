document.addEventListener("DOMContentLoaded", () => { //Se ejecuta cuando el DOM ya esta cargado
    inicializarDatos();
    cargarTabla();
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    console.log(usuarios);    

    document.getElementById("txtNombre").onkeyup = e => revisarControl(e.target, 2, 60, "Campo no valido"); //Funcion anonima que manda llamar otra función
    document.getElementById("txtTelefono").onkeyup = e => { //onkeyup = evento que suelta la tecla que yo este presionando
        validarTelefono(e.target);
    }
    document.getElementById("txtPassword").onkeyup = e => {
        revisarControl(e.target, 6, 20, "Campo no valido");
    }
    document.getElementById("txtConfirmarPassword").onkeyup = e => {
        if (document.getElementById("txtPassword").value.length > 6) {
            validarContrasenias(document.getElementById("txtPassword"), e.target)
        } else {
            revisarControl(e.target, 6, 20, "Campo no valido");
        }
    }
    document.getElementById("txtNombreUpdate").onkeyup = e => {
        revisarControl(e.target, 2, 60, "El nombre debe tener entre 2 y 60 caracteres.");
    }
    document.getElementById("txtEmail").onkeyup = e => {
        validarCorreo(e.target);
    }
    document.getElementById("txtEmailUpdate").onkeyup = e => {
        validarCorreo(e.target);
    }
    document.getElementById("txtTelefonoUpdate").onkeyup = e => { //onkeyup = evento que suelta la tecla que yo este presionando
        validarTelefono(e.target);
    }
    document.getElementById("txtResetPass").onkeyup = e => {
        revisarControl(e.target, 6, 20, "El campo es obligatorio y debe tener entre 6 y 20 caracteres");
    }
    document.getElementById("txtResetPass2").onkeyup = e => {
        if (document.getElementById("txtResetPass").value.length > 6) {
            validarContrasenias(document.getElementById("txtResetPass"), e.target)
        } else {
            revisarControl(e.target, 6, 20, "La contraseñá debe ser obligatoria y tener entre 6 y 20 caracteres");
        }
    }

    document.getElementById("btnLimpiar").addEventListener("click", e => {
        e.target.form.classList.remove("validado");
        //Iterar todos los controles del form
        //debugger;
        let controles = e.target.form.querySelectorAll("input");
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
        //Agregar la clase validado al formulario padre del boton que desencadeno el click
        e.target.form.classList.add("validado");
        //Obteniendo los elementos
        let txtNombre = document.getElementById("txtNombre");
        let txtContrasenia = document.getElementById("txtPassword");
        let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let txtTel = document.getElementById("txtTelefono");
        
        revisarControl(txtNombre, 2, 60, "El nombre es obligatorio (entre 2 y 60 caracteres)");
        revisarControl(txtContrasenia, 2, 60, "La contraseña es obligatoria (entre 2 y 60 caracteres)");

        validarCorreo(txtEmail);
        validarContrasenias(txtContrasenia, txtContrasenia2);
        validarTelefono(txtTel);
        //txtEmail.setCustomValidity("");
        if (e.target.form.checkValidity()) {
            console.log("validación completa Aceptar")
            //Crear el objeto usuario y guardarlo en el storage
            //let correo=document.querySelector("#mdlRegistro #txtCorreoOriginal").value.trim();
            let usuario = {
                nombre: txtNombre.value.trim(),
                correo: txtEmail.value.trim(),
                contrasenia: txtContrasenia.value.trim(),
                telefono: txtTelefono.value.trim()
            };
            
            let usuarios = JSON.parse(localStorage.getItem("usuarios"));
            let usuarioEncontrado = usuarios.find((element) => usuario.correo == element.correo);
            if (usuarioEncontrado) 
            {
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

                e.preventDefault(); //Sirve para que no se recargue 
                return;
            }
            agregarUsuario(usuario);
        } else {
            console.log("Error de validación");
            e.preventDefault();
        }  
    });

    document.getElementById("mdlRegistro").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("btnLimpiar").click();
        e.target.querySelector("#mdlRegistro .modal-title").innerText="Agregar";
        document.getElementById("txtNombre").focus();
    })

    document.getElementById("mdlUpdate").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("btnLimpiar").click();
        e.target.querySelector("#mdlUpdate .modal-title").innerText = "Editar";

        //Identificar si vamos editar para cargar los datos
        let correo = e.relatedTarget.value;
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let usuario = usuarios.find((element => element.correo == correo));
        
        //console.log(usuario)
        document.getElementById("txtNombreUpdate").value = usuario.nombre;
        document.getElementById("txtEmailUpdate").value = usuario.correo;
        document.getElementById("txtCorreoOriginal").value = usuario.correo;
        document.getElementById("txtTelefonoUpdate").value = usuario.telefono;
        
        document.getElementById("txtNombreUpdate").focus();
        
    });

    document.getElementById("btnActualizar").addEventListener("click", e => {
        //document.getElementById("msgDuplicado").classList.remove("show");
        //debugger;
        let alert = e.target.parentElement.querySelector("#mdlUpdate .alert");
        if (alert) {
            alert.remove();
        }
        //Agregar la clase validado al formulario padre del boton que desencadeno el click
        e.target.form.classList.add("validado");

        //Obteniendo los elementos
        let txtNombre = document.getElementById("txtNombreUpdate");
        //let txtContrasenia = document.getElementById("txtPassword");
        //let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmailUpdate");
        let txtTel = document.getElementById("txtTelefonoUpdate");
        
        revisarControl(txtNombre, 2, 60, "El nombre es obligatorio (entre 2 y 60 caracteres)");
        //revisarControl(txtContrasenia, 2, 60, "La contraseña es obligatoria (entre 2 y 60 caracteres)");
        validarCorreo(txtEmail);
        //validarContrasenias(txtContrasenia, txtContrasenia2);
        validarTelefono(txtTel);
        //txtEmail.setCustomValidity("");
        
        if (e.target.form.checkValidity()) {
            //Crear el objeto usuario y guardarlo en el storage
            let usuarios = JSON.parse(localStorage.getItem("usuarios"));
            let correoAnterior = document.getElementById("txtCorreoOriginal").value.trim();
            let correoNuevo = txtEmail.value.trim()
                     
            if (correoNuevo != correoAnterior) {
                let usuarioEncontrado = usuarios.find((element) => correoNuevo == element.correo);
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
            let indiceUsuario = usuarios.findIndex(usuario => usuario.correo === correoAnterior);
            let usuario = {
                nombre: txtNombre.value.trim(),
                correo: correoNuevo,
                contrasenia: usuarios[indiceUsuario].contrasenia,
                telefono: txtTel.value.trim()
            }; 
            usuarios[indiceUsuario] = usuario;
            // Guarda el array actualizado en el localStorage
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            //console.log("FINAL LOCALSTORAGE")
            //console
        } else {
            console.log("Error de validación");
            e.preventDefault();
        }  
    });

    document.getElementById("mdlDelete").addEventListener('shown.bs.modal', (e) => {

        e.target.querySelector("#mdlDelete .modal-title").innerText = "Eliminar";

        //Identificar si vamos editar para cargar los datos
        let correo = e.relatedTarget.value;
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let usuario = usuarios.find((element => element.correo == correo));
        document.getElementById("userEmail").value = correo;
        //console.log(usuario)
        document.getElementById("showUser").innerText = "Esta seguro de eliminar al usuario: " + usuario.nombre;
        /*document.getElementById("showUser").innerHTML  = "<div>Esta seguro de eliminar al usuario: " + usuario.nombre + "</div>";*/
    });

    document.getElementById("btnEliminar").addEventListener("click", e => {
        //Agregar la clase validado al formulario padre del boton que desencadeno el click
         let delteUserEmail = document.getElementById("userEmail").value.trim();
        
        console.log(delteUserEmail);
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        //Recuperamos el usuario que queramos eliminar
        let usuario = usuarios.findIndex((element => element.correo == delteUserEmail));

        usuarios.splice(usuario,1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    });

    document.getElementById("mdlResetPassword").addEventListener('shown.bs.modal', (e) => {
        //document.getElementById("btnLimpiar").click();
        e.target.querySelector("#mdlResetPassword .modal-title").innerText = "Restablecer contraseña";
        let correo = e.relatedTarget.value;
        let usuarios = JSON.parse(localStorage.getItem('usuarios'));
        let usuario = usuarios.find((element => element.correo == correo));
        document.getElementById("userEmailReset").value = correo;
        //Identificar si vamos editar para cargar los datos
        //let correo = e.relatedTarget.value;
        //let usuarios=JSON.parse(localStorage.getItem('usuarios'));
        //let usuario = usuarios.find((element => element.correo == correo));
    });

    document.getElementById("btnRestablecer").addEventListener("click", e => {
        //document.getElementById("msgDuplicado").classList.remove("show");
        //debugger;
        let alert = e.target.parentElement.querySelector("#mdlResetPassword .alert");
        if (alert) {
            alert.remove();
        }
        //Agregar la clase validado al formulario padre del boton que desencadeno el click
        e.target.form.classList.add("validado");
        
        let txtContrasenia = document.getElementById("txtResetPass");
        let txtContrasenia2 = document.getElementById("txtResetPass2");
        
        //revisarControl(txtNombre, 2, 60, "El nombre es obligatorio (entre 2 y 60 caracteres)");
        revisarControl(txtContrasenia, 2, 60, "La contraseña es obligatoria (entre 2 y 60 caracteres)");
        //validarCorreo(txtEmail);
        validarContrasenias(txtContrasenia, txtContrasenia2);
        //validarTelefono(txtTel);
        //txtEmail.setCustomValidity("");
        if (e.target.form.checkValidity()) {
            //Crear el objeto usuario y guardarlo en el storage
            let usuarios = JSON.parse(localStorage.getItem("usuarios"));
            let correo = document.getElementById("userEmailReset").value;
            
            let indiceUsuario = usuarios.findIndex(usuario => usuario.correo === correo);
            //console.log(usuarios);
            let usuario = {
                nombre: usuarios[indiceUsuario].nombre,
                correo: usuarios[indiceUsuario].correo,
                contrasenia: txtContrasenia.value.trim(),
                telefono: usuarios[indiceUsuario].telefono
            }; 
            usuarios[indiceUsuario] = usuario;
            //console.log(usuarios);
            // Guarda el array actualizado en el localStorage
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            //console
        } else {
            console.log("Error de validación");
            e.preventDefault();
        }  
    });


});

function revisarControl(control, min, max, message) {
    //Limpiar mensajes de validacion
    //control = e.target; //Obtiendo el elemento que desencadeno el evento.
    control.setCustomValidity(""); //setCustomValidity = No muestre un mensaje de validacion
    control.classList.remove("valido"); //
    control.classList.remove("novalido");
    //Manera visual de ver que el usuario metio los datos incorrectos
    if (control.value.trim().length < min ||
        control.value.trim().length > max) {
        control.setCustomValidity(message);
        //txt.setCustomValidity("Campo no válido");
        control.classList.add("novalido");
    } else {
        control.classList.add("valido");
    }
    /*console.log(txt.value);
    console.log(txt.validity);*/
}

function validarCorreo(control) {
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    control.setCustomValidity(""); //setCustomValidity = No muestre un mensaje de validacion
    control.classList.remove("valido"); //
    control.classList.remove("novalido");
    //Manera visual de ver que el usuario metio los datos incorrectos
    if (!control.value.trim().match(regexCorreo)) {
        control.setCustomValidity("El correo que ingreso no cumple con el formato");
        //txt.setCustomValidity("Campo no válido");
        control.classList.add("novalido");
    } else {
        control.classList.add("valido");
    }

}

function validarContrasenias(control1, control2) {

    control2.setCustomValidity(""); //setCustomValidity = No muestre un mensaje de validacion
    control2.classList.remove("valido"); //
    control2.classList.remove("novalido");
    //Manera visual de ver que el usuario metio los datos incorrectos
    if (control1.value.trim() !== control2.value.trim()) {
        control2.setCustomValidity("Las contraseñas no coinciden.");
        //txt.setCustomValidity("Campo no válido");
        control2.classList.add("novalido");
    } else {
        control2.classList.add("valido");
    }

}

function validarTelefono(control) {

    control.setCustomValidity(""); //setCustomValidity = No muestre un mensaje de validacion
    control.classList.remove("valido"); //
    control.classList.remove("novalido");
    //Manera visual de ver que el usuario metio los datos incorrectos
    if (control.value.trim().length > 0 && control.value.trim().length != 10) {
        control.setCustomValidity("El telefono debe tener 10 digitos.");
        //txt.setCustomValidity("Campo no válido");
        control.classList.add("novalido");
    } else {
        control.classList.add("valido");
    }

}

function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    let tbody = document.querySelector("#tblUsuarios tbody");
    for (var i = 0; i < usuarios.length; i++) {
        usuario = usuarios[i];
        let fila = document.createElement("tr"); //Elementos 
        let celda = document.createElement("td");
        celda.innerText = usuario.nombre; //innerText = 
        fila.appendChild(celda); //appendChild = funcion que ayuda meter elementos en un elemento HTML

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#mdlUpdate" value="' + usuario.correo + '">Editar</button>'
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML ='<button type="button" class="btn btn-danger"  data-bs-toggle="modal" data-bs-target="#mdlDelete" value="' + usuario.correo + '">Eliminar</button>';
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML ='<button type="button" class="btn btn btn-warning" data-bs-toggle="modal" data-bs-target="#mdlResetPassword" value="' + usuario.correo + '">Restablecer contraseña</button>';
        fila.appendChild(celda);

        tbody.appendChild(fila);
    }

}

function inicializarDatos() {
    let usuarios = localStorage.getItem('usuarios');
    if (!usuarios || !Array.isArray(JSON.parse(usuarios))) {
        // Si no hay usuarios en el localStorage o no es un array válido, inicializa el array de usuarios con los predeterminados
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

        // Guardar los usuarios en el almacenamiento local
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

function agregarUsuario(usuario) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}
