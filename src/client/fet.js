 
function registrar_user() {
    let url = 'https://helloworld-python-qxoiardjgq-ew.a.run.app/apis/clientes?name='
    const name = document.getElementById("name").value;
    const user = document.getElementById("user").value;
    const password = document.getElementById("password").value;
    if (name.length != 0 && user.length != 0 && password.length != 0){
        console.log(name,user,password);
        url +=name+'&user='+user+'&password='+password
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data => console.log(data));
        alert("Registro exitoso!!");
        location.replace("index.html");
    }else{
        alert("Debes llenar todos los campos");
    }
}

async function inciar_sesion() {
    let url = 'https://helloworld-python-qxoiardjgq-ew.a.run.app/apis/user?user=';
    const user = document.getElementById("user_login").value;
    const password = document.getElementById("password_login").value;
    let estado = false;
    if (user.length != 0 && password.length != 0) {
        url +=user+'&password='+password;
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data => estado = data["estado"]);
        var x = await resolveAfter2Seconds(5);
        console.log(estado);
        if (estado == "True") {
            location.replace("juego.html");
        } else {
            alert("usuario o clave incorrecta!");
        }
    }else{
        alert("Debes llenar todos los campos");
    }
}

function resolveAfter2Seconds(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 500);
    });
}

//https://helloworld-python-qxoiardjgq-ew.a.run.app/apis/user