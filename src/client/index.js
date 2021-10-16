const ADDRESS = "http://localhost:5000";
const socket = io.connect(ADDRESS);

var palabraServer = "";
var palabraAux = "";
var guiones = "";
var datos = [];

socket.on('connect', function() {
    socket.emit('registrer', { id: socket.id, estado: 0 });
});

socket.on('inicio', (data) => {
    actualizar(data);
});

socket.on('palabra', (palabra) => {
    comenzar(palabra);

});

socket.on('bloquearInput', (data) => {
    document.getElementById("intro").disabled = true;
    document.getElementById("boton").disabled = true;
    document.getElementById("termino").innerHTML = data.msg;
    document.getElementById("termino").style.color = "red";
});

socket.on('desbloquear', (data) => {
    document.getElementById("intro").disabled = false;
    document.getElementById("boton").disabled = false;
    document.getElementById("termino").innerHTML = data.msg;
    document.getElementById("termino").style.color = "green";
});

const actualizar = (data) => {
    datos = [...data];
    if (data.length > 1) {
        document.getElementById("pa").innerHTML = data[data.length - 1].palabra;
        if (data[data.length - 1].palabra.indexOf("_") == -1) {
            alert("Gano el jugador" + data[data.length - 1].turno);
            location.reload();
        }
        palabraAux = data[data.length - 1].palabra;
    }
}

function comenzar(palabra) {
    console.log(palabra);
    palabraAux = "";
    for (let i in palabra) {
        palabraAux += "_ ";
    }
    var div = document.getElementById("contenedorA");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    var crear = document.createElement("h2");
    crear.id = "pa"
    crear.innerHTML = palabraAux;
    div.appendChild(crear);
    palabraServer = palabra;
}


function soloLetras(e) {
    var key = e.keyCode || e.which,
        tecla = String.fromCharCode(key).toLowerCase(),
        letras = " áéíóúabcdefghijklmnñopqrstuvwxyz",
        especiales = [8, 37, 39, 46],
        tecla_especial = false;

    for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }

    if (letras.indexOf(tecla) == -1 && !tecla_especial) {
        return false;
    }
}

function valida() {
    var letra = document.getElementById("intro");
    var letraE = letra.value;
    var posicion = -1;
    var listaPalabra = palabraServer.split('');
    var listaguiones = palabraAux.split(' ');
    var posiciones = [];
    var nueva = "";
    if (letraE !== "") {
        posicion = listaPalabra.indexOf(letraE)
        posiciones.push(posicion);

        if (posicion !== -1) {
            while (posicion !== -1) {
                posicion = listaPalabra.indexOf(letraE, posicion + 1);
                if (posicion !== -1) {
                    posiciones.push(posicion);
                }
            }
        } else {
            alert("error");
        }
    }

    for (let i = 0; i < posiciones.length; i++) {
        listaguiones[posiciones[i]] = letraE;
    }
    for (let i = 0; i < listaguiones.length; i++) {
        nueva += listaguiones[i] + " ";
    }
    letra.value = "";

    datos[datos.length - 1].estado = 1;
    datos.push({ tipo: 0, turno: datos[datos.length - 1].turno + 1, estado: 0, palabra: nueva })
    console.log(datos);
    socket.emit("new_inicio", datos);

}