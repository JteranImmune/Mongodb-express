let mostrarLibros = () => {

    let listaLibros = document.getElementById('listaLibros');

    fetch('/api/libros').then((res) =>  res.json()).then((libros) => {

        libros.results.forEach(libro => {
            const itemLibro = document.createElement("li");
            itemLibro.classList.add("list-group-item");

            const titulo = document.createElement("h4");
            titulo.innerText = `${libro.titulo}`

            const estado = document.createElement("p");
            estado.innerText = `${libro.estado}`;

            
            const libroId = libro._id;

            const  botonBorrar = document.createElement("button");
            botonBorrar.setAttribute("type","button");
            botonBorrar.classList.add("btn", "btn-danger", "borrar");
            botonBorrar.innerText = 'Borrar';
            
            const  botonEditar = document.createElement("button");
            botonEditar.setAttribute("type","button");
            botonEditar.classList.add("btn", "btn-primary","mx-2" , "editar");
            botonEditar.innerText = 'Marcar leído';
            
            botonBorrar.dataset.id = libroId;
            botonEditar.dataset.id = libroId;
            
            botonEditar.onclick = () => { editarLibro(libroId) };
            botonBorrar.onclick = () => { borrarLibro(libroId) };

            itemLibro.append(titulo,estado,botonBorrar, botonEditar);
            listaLibros.append(itemLibro);
        });
    });
};

mostrarLibros();

function borrarLibro(libroId){

    let listaLibros = document.getElementById('listaLibros');

    fetch('/api/borrarLibro', {
        method:'DELETE',
        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
                    _id:libroId
                })
    })
    .then((res) => res.json()).then((libro) =>{

        while (listaLibros.firstChild) {
            listaLibros.removeChild(listaLibros.firstChild);
        }

        mostrarLibros()
        
    });
    
};

function editarLibro(libroId){

    let listaLibros = document.getElementById('listaLibros');

    fetch('/api/editarLibro', {
        method:'PUT',
        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
                    _id:libroId
                })
    })
    .then((res) => res.json()).then((libro) =>{

        while (listaLibros.firstChild) {
            listaLibros.removeChild(listaLibros.firstChild);
        }

        mostrarLibros()       
        
    });
    
};