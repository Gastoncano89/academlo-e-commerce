//* URL Base
const baseUrl = "https://ecommercebackend.fundamentos-29.repl.co/";
//* Mostrar y ocultar carrito
const carToggle = document.querySelector('.car__toggle');
const carBlock = document.querySelector('.car__block');
//* Dibujar productos en la web
const productsList = document.querySelector('#products-container');
//* Carrito de compras
const car = document.querySelector('#car');
const carList = document.querySelector('#car__list');
//* Vaciar el carrito
emptyCarButton = document.querySelector('#empty__cart')
//? Necesito tener un array que reciba los elementos que debo introducir en el carrito de compras.
let carProducts = [];
//* Modal
const modalContainer = document.querySelector('#modal-container');
const modalElement = document.querySelector('#modal');
const claseElement = document.querySelector('.modal__element')
let modalDetails = [];

//* lógica para mostrar y ocultar el carrito.
carToggle.addEventListener('click', () => {
  carBlock.classList.toggle("nav__car__visible")
  //* Cuando NO tiene la clase nav__car__visible, la agrega. Si se le da click nuevamente y detecta la clase, la retira.
})

//! Vamos a crear una función que contenga y que ejecute todos los Listeners al inicio de la carga del código.
eventListenersLoader()

function eventListenersLoader() {
  //* Cuando se presione el botón "Add to car"
  productsList.addEventListener('click', addProduct)

  //* Cuando se presione el botón "Delete"
  car.addEventListener('click', deleteProduct)

  //* Cuando se presione el botón "Empty car"
  emptyCarButton.addEventListener('click', emptyCar)

  //* Se ejecuta cuando se carga la página
  document.addEventListener('DOMContentLoaded', () => {
    carProducts = JSON.parse(localStorage.getItem('cart')) || [];
    carElementsHTML();
  })

  //* Cuando se presione el botón "View Details"
  productsList.addEventListener('click', modalProduct);

  //* Cuando se de click al botón para cerrar Modal
  modalContainer.addEventListener('click', closeModal);

}

function getProducts() {
  axios.get(baseUrl)
    .then(function (response){
      const products = response.data
      printProducts(products)
    })
    .catch(function(error){
      console.log(error)
    })
}
getProducts()

function printProducts(products){
  let html = '';
  for(let i = 0; i < products.length; i++){
    html += `
    <div class='product__container'>
      <div class='product__container__img'>
        <img src="${products[i].image}" alt="image">
      </div>
      <div class="product__container__name">
        <p>${products[i].name}</p>
      </div>
      <div class="product__container__price">
        <p>$ ${products[i].price.toFixed(2)}</p>
      </div>
      <div class="product__container__button">
        <button class="car__button add__to__car" id="add__to__car" data-id="${products[i].id}">Add to car</button>
        <button class="product__details" data-id="${products[i].id}">View Details</button>
      </div>
    </div>
    `
  }
  productsList.innerHTML = html
}
//* Agregar productos al carrito
//* 1. Capturar la información del producto al que se le dé click.
function addProduct(event){
  if(event.target.classList.contains('add__to__car')){
    //.contains valida si el elemento existe dentro de la clase
    const product = event.target.parentElement.parentElement
    // parentElement nos ayuda a acceder al padre inmediatamente superior del elemento.
    //console.log(product)
    carProductsElements(product)
  }
}
//* 2. Debo transformar la información HTML a un array de objetos.
//* 2.1 Debo validar si el elemento seleccionado ya se encuentra dentro del carrito. Si existe, le debo sumar una unidad para que no se repita. 
function carProductsElements(product){

  const infoProduct = {
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
    // textContent me permite pedir el texto que contiene un elemento.
    quantity: 1
  }
  //* Agregar un contador
  //* Si dentro de carProducts ya existe un ID igual al que tengo previamente alojado en infoProduct, entonces le sumo 1 a la cantidad.

  // some, valida si existe algún elemento dentro del array que cumpla la condición
  if(carProducts.some(product => product.id === infoProduct.id)){
    // Si el producto al que le doy click en infoProduct ya existe en carProducts, entonces:
    const product = carProducts.map(product => {
      // Como tengo un producto que ya existe dentro de carProducts, entonces debo mapearlo y sumarle una unidad a la cantidad del elemento igual.
      if(product.id === infoProduct.id){
        product.quantity ++;
        return product;
      } else {
        return product;
      }
    })
    carProducts = [...product]
  } else {
    carProducts = [...carProducts, infoProduct]
  }
  console.log(carProducts)
  carElementsHTML()
}
//* 3. Debo Imprimir, pintar, dibujar o mostrar en pantalla los productos dentro del carrito.
function carElementsHTML(){

  //! Como cada vez que iteramos con forEach creamos un nuevo div, debemos depurar los duplicados reinicializando el contenedor carList con innerHTML vacío. Esto borra todo lo que pueda estar repetido y vuelve a iterar sobre los elementos actualizados en el array de carProducts.
  carList.innerHTML = "";

  carProducts.forEach(product => {
    const div = document.createElement('div');
    // createElement, permite crear etiquetas desde el DOM.
    div.innerHTML = `
      <div class="car__product">
        <div class="car__product__image">
          <img src="${product.image}">
        </div>
        <div class="car__product__description">
          <p>${product.name}</p>
          <p>Precio: ${product.price}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
        <div class="car__product__button">
          <button class="delete__product" data-id="${product.id}">
            Delete
          </button>
        </div>
      </div>
      <hr>
    `;
    // appendChild permite insertar elementos al DOM, muy similar a innerHTML
    carList.appendChild(div);
  })
  productsStorage()
}
//* LocalStorage
function productsStorage() {
  localStorage.setItem('cart', JSON.stringify(carProducts))
}

//* Eliminar productos del carrito
function deleteProduct(event){
  if(event.target.classList.contains('delete__product')){
    const productId = event.target.getAttribute('data-id')
    carProducts = carProducts.filter(product => product.id !== productId)
    carElementsHTML()
  }
}
//* Vaciar el carrito completo
function emptyCar() {
  carProducts = [];
  carElementsHTML();
}

//* Ventana Modal
function modalProduct(event){
  if(event.target.classList.contains('product__details')){
    modalContainer.classList.add('show__modal')
    const product = event.target.parentElement.parentElement
    modalDetailsElement(product)
  }
}

function closeModal(event){
  if(event.target.classList.contains('icon__modal')){
    modalContainer.classList.remove('show__modal')
    modalElement.innerHTML = ""; 
    //claseElement.innerHTML = "";  
    modalDetails = [];
    //console.log(modalDetails);
  }
}

function modalDetailsElement(product){
  const infoDetails = [{
    id: product.querySelector('button').getAttribute('data-id'),
    image: product.querySelector('img').src,
    name: product.querySelector('.product__container__name p').textContent,
    price: product.querySelector('.product__container__price p').textContent,
  }]
  
  modalDetails = [...infoDetails]

detailsElementsHTML()
  
}

// Cargar Modal
function detailsElementsHTML(){

  //! Como cada vez que iteramos con forEach creamos un nuevo div, 
  //debemos depurar los duplicados reinicializando el contenedor carList con innerHTML vacío. 
  //Esto borra todo lo que pueda estar repetido y vuelve a iterar sobre los elementos 
  //actualizados en el array de carProducts.
  //carList.innerHTML = "";
  modalElement.innerHTML = "";
  
  console.log(modalDetails);
  
  modalDetails.forEach(product => {
    const div = document.createElement('div');
    // createElement, permite crear etiquetas desde el DOM.

    div.innerHTML = `
    <div class="modal__product">

            <div class="modal_descript">
                <h2>${product.name}</h2>
                
                <p>${product.price}</p>

                <div class="first__modal__colors">
                    <p>Colores</p>
                    <div>
                      <img src="${product.image}">
                    </div>
                  </div>

                  <div class="first__modal__sizes__text">
                    <div>
                      <p>Tallas</p>
                      <p>Guía de tallas</p>
                    </div>
                  </div>  

                  <div class="first__modal__sizes">
                      <div>
                          <p>S</p>
                      </div>
                      <div>
                         <p>M</p>
                      </div>
                      <div>
                          <p>L</p>
                      </div>
                      <div>
                          <p>XL</p>
                      </div>
                      <div>
                          <p>2XL</p>
                      </div>
                      <div>
                          <p>3XL</p>
                      </div>
                  </div>
            </div>

            <div class="modal_image">
              <img src="${product.image}">
            </div>

            
    </div>
    <div>
                <button class="modal__button modal__to__car" id="modal__to__car" data-id="1">Add to car</button> 
    </div>
    `
    ;
    // appendChild permite insertar elementos al DOM, muy similar a innerHTML

    modalElement.appendChild(div);
  })
 // productsStorage()
}


