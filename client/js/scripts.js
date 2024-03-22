const tabla = document.getElementById('tabla');
let paises = [];
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
                if (pais.name.common) {
                    let paisDB = {
                        codigo: index,
                        nombre: pais.altSpellings[1],
                        capital: pais.capital,
                        region: pais.region,
                        poblacion: parseInt(pais.population, 10),
                        latitud: pais.latlng[0],
                        longitud: pais.latlng[1]
                    };
                    // Vamos acumulando los países que están con la info completa
                    if (paisDB.nombre) {
                        paises.push(paisDB);

                    }
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

traerPaisesUrl();

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
            } else if (data.length === 1) {
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
    let regionCheckBox = document.getElementById('omitirRegion');
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
        if (region.trim() !== '') {
            buscarDB('poblacionYRegion', poblacionRegion);
        } else {
            buscarDB('poblacionMin', poblacionMin);
        }
    } else if (region && regionCheckBox.checked) {
        buscarDB('regionCheck', region);
    } else if (region) {
        buscarDB('region', region);
    }
    else if (poblacionMax && poblacionMin) {
        buscarDBVariosParametros('poblacionBetween', 'poblacionMin', poblacionMin, 'poblacionMax', poblacionMax);
    } else if (poblacionMax) {
        buscarDB('poblacionMax', poblacionMax);
    } else if (poblacionMin) {
        buscarDB('poblacionMin', poblacionMin);
    } else {
        tabla.innerHTML = ''
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
            mostrarData(data);
        })
        .catch(error => {
        });
}

async function buscarDBVariosParametros(datoNecesario, nombreParametro1, parametro1, nombreParametro2, parametro2) {

    await fetch('/buscar-por-' + datoNecesario + '?' + nombreParametro1 + '=' + parametro1 + '&' + nombreParametro2 + '=' + parametro2, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            mostrarData(data);
        })
        .catch(error => {
        });
}

function mostrarData(data) {
    tabla.innerHTML = '';
    paises = data;
    if (data.length > 1) {
        data.forEach(pais => {
            mostrarPaisEnTabla(pais, tabla);
        });
    } else {
        mostrarPaisEnTabla(data, tabla);
    }
}

async function ordenar() {
    await fetch('/ordenar', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            mostrarData(data);
        })
        .catch(error => {
        });
}