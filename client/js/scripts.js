const tabla = document.getElementById('tabla');

function traerPaisesUrl() {
    // Traemos todos los paises
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            // Limpiamos la tabla            
            tabla.innerHTML = '';

            let paises = [];
            // Iteramos cada pais
            data.forEach((pais, index) => {
                // Si el pais tiene nombre se carga, si no tiene es omitido
                if (pais.altSpellings[1]) {
                    let paisDB = {
                        codigo: index,
                        nombre: pais.altSpellings[1],
                        capital: pais.capital,
                        region: pais.region,
                        poblacion: pais.poblation,
                        latitud: pais.latlng[0],
                        longitud: pais.latlng[1]
                    };
                    // Vamos acumulando los países que están con la info completa
                    paises.push(paisDB);
                }
            });
            fetch('cargar-paises', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paises),
            })
                .then(response => {
                    response.json()
                    console.log('Datos guardados');
                })
                .catch(error => {
                });
        })
        .catch(error => {
            console.error('Error al cargar los datos de la API:', error);
        });
}

function llenarTabla() {
    fetch('/buscar-paises', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            tabla.innerHTML = '';

            if (data.length > 1) {
                data.forEach(pais => {
                    mostrarPaisEnTabla(pais, tabla);
                });
            } else {
                mostrarPaisEnTabla(data, tabla);
            }
        })
        .catch(error => {
            console.error('Error en el servidor:', error);
        });
}

llenarTabla();

function mostrarPaisEnTabla(pais, tabla) {
    // Creamos la fila  
    let tr = document.createElement('tr');

    let codigo = document.createElement('td');
    codigo.textContent = pais.codigo;

    let nombre = document.createElement('td');
    nombre.textContent = pais.nombre;

    let capital = document.createElement('td');
    capital.textContent = pais.capital;

    let region = document.createElement('td');
    region.textContent = pais.region;

    let poblacion = document.createElement('td');
    poblacion.textContent = pais.poblacion;

    let latitud = document.createElement('td');
    latitud.textContent = pais.latitud;

    let longitud = document.createElement('td');
    longitud.textContent = pais.longitud;

    tr.appendChild(codigo);
    tr.appendChild(nombre);
    tr.appendChild(capital);
    tr.appendChild(region);
    tr.appendChild(poblacion);
    tr.appendChild(latitud);
    tr.appendChild(longitud);

    tabla.appendChild(tr);
}

function buscar() {
    let nombre = document.getElementById('nombre').value;
    let region = document.getElementById('region').value;
    let poblacionMin = document.getElementById('poblacion-min').value;
    let poblacionMax = document.getElementById('poblacion-max').value;

    let poblaciones = {
        poblacionMin: poblacionMin,
        poblacionMax: poblacionMax
    }

    let poblacionRegion = {
        poblacionMin: poblacionMin,
        region: region
    }

    if (nombre) {
        buscarDB('nombre', nombre);
    } else if (poblacionMin && region) {
        buscarDB('poblacionYRegion', poblacionRegion);
    } else if (region) {
        buscarDB('region', region);
    } else if (poblacionMax && poblacionMin) {
        buscarDB('poblacionBetween', poblaciones);
    } else if (poblacionMax) {
        buscarDB('poblacionMax', poblacionMax);
    } else if (poblacionMin) {
        buscarDB('poblacionMin', poblacionMin);
    } else {
        llenarTabla();
    }
}
async function buscarDB(datoNecesario, parametro) {
    await fetch('/buscar-por-' + datoNecesario + '?' + datoNecesario + '=' + parametro, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            tabla.innerHTML = '';
            if (data.length > 1) {
                data.forEach(pais => {
                    mostrarPaisEnTabla(pais, tabla);
                });
            } else {
                mostrarPaisEnTabla(data, tabla);
            }
        })
        .catch(error => {
        });
}

