const cryptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda'); 
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objDatos = {
    moneda: '',
    criptomoneda: ''
};

//Promesas
const obtenerCryptomonedas = cryptomonedas => new Promise( resolve => {
    resolve( cryptomonedas );
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCryptomonedas();
    formulario.addEventListener('submit', validarFormulario );
    cryptoSelect.addEventListener('change', leerDatosForm );
    monedaSelect.addEventListener('change', leerDatosForm );
});

// Obtener Listado de cotizaciones API
function consultarCryptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( response => obtenerCryptomonedas( response.Data ) )
        .then( cryptomonedas => selectCryptos( cryptomonedas ) )
        .catch( error => console.log( error ));
};

// Completa el Select
function selectCryptos( criptomonedas ){
    
    criptomonedas.forEach( crypto => {
        
        const { FullName, Name } = crypto.CoinInfo;
        const option = document.createElement( 'option' );
        option.value = Name;
        option.textContent = FullName;
        // Insertar en HTML
        cryptoSelect.appendChild( option );
    });
};

function leerDatosForm(e) {
    objDatos[e.target.name] = e.target.value;
    console.log( objDatos );
};

function validarFormulario( e ){
    e.preventDefault();

    //Validacion 
    const { moneda, criptomoneda } = objDatos; 

    if( moneda === '' || criptomoneda === '' ){
        mostrarAlerta('Todos los campos son obligatorios.');
        return;
    } else {
        // Consultar API con valores del form
        consultarAPI();
    }

    
};

function mostrarAlerta( msj ){
    
    const divAlerta = document.createElement('div');
    divAlerta.classList.add('error');
    divAlerta.textContent = msj;    

    formulario.appendChild( divAlerta );
    
    setTimeout( () => {
        divAlerta.remove();
    }, 3000 );
};

function consultarAPI(){   
    
    const { moneda, criptomoneda } = objDatos;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
             
    mostrarSpinner();
    
    fetch( url )
        .then( respuesta => respuesta.json() )
        .then( cotizacion => {
            mostrarCotizacionHTML( cotizacion.DISPLAY[criptomoneda][moneda] )
        });
};

function mostrarCotizacionHTML( price ){
    
    limpiarHTML();

    console.log( price );
    const  { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = price;


    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);

    formulario.appendChild(resultado);
};

function mostrarSpinner() {
    
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;

    resultado.appendChild(spinner);
}

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
};
