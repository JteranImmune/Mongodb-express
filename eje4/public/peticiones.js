function editarMenu(){

    const numero = document.getElementById('editarNumero').value;
    const entrada = document.getElementById('editarEntrada').value;
    const principal = document.getElementById('editarPrincipal').value;
    const postre = document.getElementById('editarPostre').value;
    const precio = document.getElementById('editarPrecio').value;

    fetch('/api/editarMenu', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            numero,
            entrada,
            principal,
            postre,
            precio
        })
    })
    .then((res) => res.json())
    .then((menu) =>{
        console.log(menu);
    })

}

function borrarMenu(){

    const numero = document.getElementById('borrarNumero').value;

    fetch('/api/borrarMenu', {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            numero,
        })
    })
    .then((res) => res.json())
    .then((menu) =>{
        console.log(menu);
    })

}