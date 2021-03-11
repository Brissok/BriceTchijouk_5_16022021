//Création de la classe "product"
class product {
  constructor(id, price) {
    this.id = id;
    this.price = price;
  }
}

// Variable globale qui contiendra l'id des produits ajoutés au panier
let basket = [];

// Fonction pour savoir sur quelle page nous sommes
/**
 * 
 * 
 * @returns {string} onPage
 * 
 */
 const whichPage = () => {
    let onPage = ".homePage";
    let page = document.querySelector(onPage);
    if (page == null) {
      onPage = ".productPage";
      page = document.querySelector(onPage);
      if (page == null) {
        onPage = ".basketPage";
        page = document.querySelector(onPage);
        if (page == null) {
          onPage = ".orderPage";
          page = document.querySelector(onPage);
          if (page == null) {
            window.alert("Page inconnu");
          } else {
            return onPage;
            }
        } else {
          return onPage;
          }
      } else {
        return onPage;
        }
    } else {
      return onPage;
      }
  };
  
// on récupère l'id passé dans l'URL de la page
/**
 * 
 * 
 * @returns {string} param
 * 
 */
const getId = () => {
  let searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('id')) {
    let param = searchParams.get('id');
    return param;
  } else {
    window.alert("Le produit que vous recherchez est introuvable !");
  };
}


switch (whichPage()) {
  case ".homePage" :
    loadProducts("http://localhost:3000/api/cameras")
    .then(function(content) {
      postProducts(content);
      addToBasketListener();
    })
    .catch(function (err) {
      console.error('Erreur !');
      console.dir(err);
    });
    break;
  case ".productPage" :
    let id = getId();
    loadProducts("http://localhost:3000/api/cameras/" + id)
    .then(function(content) {
      postProductDetails(content);
      addToBasketListener();
    })
    .catch(function (err) {
      console.error('Erreur !');
      console.dir(err);
      window.alert("Une erreur est survennue, veuillez réessayer !")
    });
    break;
  default :
    console.log("Page inconnue");
  
}


/** FONCTION DE REQUETES */


//Fonction de chargement de données distantes et renvoyant une promesse
/**
 * 
 * @param {string} url
 * @returns {Promise}
 * 
 */
function loadProducts (url) {
  return new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        resolve(JSON.parse(request.responseText));
      } else if (this.readyState == XMLHttpRequest.DONE && this.status !== 200) {
        reject(this.status);
        };
    }
    request.open('GET', url);
    request.send();
  });
};


/** EVENT LISTENERS */


const addToBasketListener = () => {
  let product = document.querySelectorAll('.product-button');
  product.forEach(
    function(currentValue) {
      addConfirmBox(currentValue, "Ce produit a bien été ajouté à votre panier !");
    });
};


/** MODIFICATION DU DOM */


//Affichage des produits sur la page
/**
 * 
 * @param {Array} response
 * @returns void
 * 
 */
const postProducts = (response) => {
  for (let i = 0 ; i < response.length ; i++) {
    let id = response[i]._id;
    let product = createProductElement(id);
    product.addEventListener('click', function() {
      productDetails = product.id;
    });
    let products = document.getElementById('products');
    products.appendChild(product);
    let productCard = createProductCard();
    product.appendChild(productCard);
    let imageUrl = response[i].imageUrl;
    let name = response[i].name;
    let img = createImgElement(imageUrl, name);
    productCard.appendChild(img);
    let description = response[i].description;
    let price = response[i].price;
    let body = createProductBody(name, description, price, id);
    productCard.appendChild(body);
  }
}

// Affichage des détails du produit sélectionné
/**
 * 
 * @param {Array} response
 * @returns void
 * 
 */
const postProductDetails = (response) => {
  let id = response._id;
  let product = createElementWithClass('div', 'product, product_details');
  let products = document.getElementById('products');
  products.appendChild(product);
  let productCard = createProductCard();
  product.appendChild(productCard);
  let imageUrl = response.imageUrl;
  let name = response.name;
  let img = createImgElement(imageUrl, name);
  productCard.appendChild(img);
  let description = response.description;
  let price = response.price;
  let body = createProductBody(name, description, price, id);
  productCard.appendChild(body);
}


// Fonction créant un un élément 'produit'
/**
 * 
 * @param {objectID} id
 * @returns {HTMLElement}
 */
const createProductElement = (id) => {
  let product = document.createElement('a');
  product.setAttribute('href', "html/product.html?id=" + id);
  product.setAttribute('class', 'product');
  product.setAttribute('id', id);
  return product;
}

// Fonction créant un élément <div> avec la classe 'product-card'
/**
 * 
 * 
 * @returns {HTMLElement}
 */
const createProductCard = () => {
  let productCard = document.createElement('div');
  productCard.setAttribute('class', 'product-card');
  return productCard;
}

// fonction créant un élément 'image'
/**
 * 
 * @param {string} imagUrl
 * @param {string} name
 * @returns {HTMLElement}
 */
const createImgElement = (imageUrl, name) => {
  let img = document.createElement('img');
  img.setAttribute('class', 'product-img');
  img.setAttribute('src', imageUrl);
  img.setAttribute('alt', name);
  return img;
}

//Fonction créant un élément 'product body'
/**
 * 
 * @param {string} name
 * @param {string} description
 * @param {string} price
 * @param {objectID} id
 * @returns {HTMLElement}
 */
const createProductBody = (name, description, price, id) => {
  let productBody = createElementWithClass('div', 'product-body');
  let productName = createElementWithClass('h2', 'product-name');
  let productDescription = createElementWithClass('p', 'product-description');
  let productPrice = createElementWithClass('div', 'product-price');
  let productButton = createElementWithClass('button', 'product-button');
  productName.textContent = name;
  productDescription.textContent = description;
  productPrice.textContent = price + ' €';
  productButton.textContent = 'Ajouter au panier';
  productButton.setAttribute('id', id);
  productBody.appendChild(productName);
  productBody.appendChild(productDescription);
  productBody.appendChild(productPrice);
  productBody.appendChild(productButton);
  return productBody;
}

//Fonction crénat un élément avec une classe
/**
 * 
 * @param {string} element
 * @param {string} className
 * @returns {HTMLElement}
 */
const createElementWithClass = (element, className) => {
  let elt = document.createElement(element);
  elt.setAttribute('class', className);
  return elt;
}

/** LES BOITES MODALES */

const addConfirmBox = (element, text) => {
  var modalContainer = document.createElement('div');
  modalContainer.setAttribute('id', 'modal');

  var confirmBox = document.createElement('div');
  confirmBox.className = 'confirm-box';

  // Affichage boîte de confirmation
  element.addEventListener('click', function(e) {
    e.preventDefault();
    confirmBox.innerHTML = '<p>' + text + '</p>';
    confirmBox.innerHTML += '<button id="modal-confirm">Confirmer</button>';
    confirmBox.innerHTML += '<button id="modal-close">Annuler</button>';
    modalShow();
  });

  function modalShow() {
      modalContainer.appendChild(confirmBox);
      document.body.appendChild(modalContainer);

      document.getElementById('modal-close').addEventListener('click', function() {
          modalClose();
      });
      document.getElementById('modal-confirm').addEventListener('click', function () {
          console.log('Confirmé !');
          let id = element.getAttribute('id');
          basket.push(id);
          localStorage.setItem('basket', basket);
          console.log(basket);
          modalClose();
      });
      }

  function modalClose() {
      while (modalContainer.hasChildNodes()) {
          modalContainer.removeChild(modalContainer.firstChild);
      }
      document.body.removeChild(modalContainer);
  }
}