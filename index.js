let products_id = [];

var request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let response = JSON.parse(this.responseText);
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
};
request.open("GET", "http://localhost:3000/api/cameras");
request.send();


/**
 * 
 * @param {objectID} id
 * @returns {HTMLElement}
 */
const createProductElement = (id) => {
  let product = document.createElement('a');
  product.setAttribute('href', "#");
  product.setAttribute('class', 'product');
  product.setAttribute('id', id);
  return product;
}

const createProductCard = () => {
  let productCard = document.createElement('div');
  productCard.setAttribute('class', 'product-card');
  return productCard;
}

const createImgElement = (imageUrl, name) => {
  let img = document.createElement('img');
  img.setAttribute('class', 'product-img');
  img.setAttribute('src', imageUrl);
  img.setAttribute('alt', name);
  return img;
}

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

const createElementWithClass = (element, className) => {
  let elt = document.createElement(element);
  elt.setAttribute('class', className);
  return elt;
}