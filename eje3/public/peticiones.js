let mostrarSeries = () => {

    let listaSeries = document.getElementById('listaSeries');

    fetch('/api/series').then((res) =>  res.json()).then((series) => {

        series.results.forEach(serie => {

            const itemSerie = document.createElement("li");
            itemSerie.classList.add("list-group-item");

            const titulo = document.createElement("h4");
            titulo.innerText = `${serie.titulo}`

            const plataforma = document.createElement("p");
            plataforma.innerText = `${serie.plataforma}`;

            const nota = document.createElement("p");
            nota.innerText = `${serie.nota}`;

            itemSerie.append(titulo,plataforma, nota);

            listaSeries.append(itemSerie);
        });
    });
};

mostrarSeries();


let botonAgregar = document.getElementById('botonAgregar');

botonAgregar.addEventListener('click',(e) => {

    e.preventDefault();

    let titulo = document.getElementById('titulo').value;
    let plataforma = document.getElementById('plataforma').value;
    let nota = document.getElementById('nota').value;

        fetch('/api/nuevaSerie' , {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                titulo,
                plataforma,
                nota
            })
        })
        .then((res) => res.json()).then((series) =>{

            while (listaSeries.firstChild) {
                listaSeries.removeChild(listaSeries.firstChild);
            }

            mostrarSeries();
        });
});
