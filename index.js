// Fonction pour savoir si nous sommes sur la page d'accueil
/**
 * 
 * @param void
 * @returns {boolean}
 * 
 */
const isHome = () => {
  var home = document.querySelector('.home');
    if (home !== null) {
      return true;
    }
    else {
      return false;
    }
};

// Affichage des produits sur la page d'accueil
/**
 * 
 * @param void
 * @returns {HTMLElement}
 * 
 */
const postAllProducts = () => {
  var home = isHome();
  if (home == true) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let response = JSON.parse(this.responseText);
        postProducts(response);
      };
    };
    request.open("GET", "http://localhost:3000/api/cameras");
    request.send();
  };
};

postAllProducts();

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

/**
 * 
 * @param {objectID} id
 * @returns {HTMLElement}
 */
const createProductElement = (id) => {
  let product = document.createElement('a');
  product.setAttribute('href', "html/product.html");
  product.setAttribute('class', 'product');
  product.setAttribute('id', id);
  return product;
}

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

/* Ecoute du clic sur un produit

let product = document.getElementsByClassName('product');
product.addEventListener('click', function {
  this.getAttribute('id');

})

const postProductSelected = (id) => {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let response = JSON.parse(this.responseText);
    }
  };
  request.open("GET", "http://localhost:3000/api/cameras/" + id);
  request.send();
}
*/
