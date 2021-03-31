/** CREATION DES CLASSES */

//Création de la classe "product"
class Product {
  constructor(lenses, id, name, price, description, imageUrl, quantity) {
    this.lenses = lenses;
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.quantity = quantity;
  }
}

//Création de la classe "BasketProduct"
class BasketProduct {
  constructor(id, quantity) {
    this.id = id;
    this.quantity = quantity;
  }
}

//Création de la classe "contact"
class Contact {
  constructor(firstName, lastName, address, city, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.city = city;
    this.email = email;
  }
  validContact() {
    if ((typeof this.firstName==='string' && this.firstName!="") && 
        (typeof this.lastName==='string' && this.lastName!="") &&
        (typeof this.address==='string' && this.address!="") &&
        (typeof this.city==='string' && this.city!="") &&
        (typeof this.email==='string' && this.email!="")) {
          return true;
        } else {
          return false;
        }
  }
}

//Création de la classe "body"
class Body {
  constructor(contact, products) {
    this.contact = contact;
    this.products = products;
  }
}

/** FONCTIONS GLOBALES */

// Fonction pour savoir sur quelle page nous sommes
/**
 * 
 * @returns {string}
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
            window.alert("Page inconnue");
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
}
  
//Fonction pour récupérer l'id passé dans l'URL de la page
/**
 * 
 * @returns {string}
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

//Fonction pour modifier le prix
/**
 * 
 * @param {string} price 
 * @returns {Number} 
 */
const priceTransform = (price) => {
  if (Number.isNaN(Number.parseFloat(price))) {
    return 0;
  }
  return parseFloat(price) * 0.01  ;
}

//fonction permettant d'ajouter un produit au panier
/**
 * 
 * @param {HTMLElement} element 
 */
const pushProductInBasket = (element) => {
  //Si le panier n'existe pas
  if (localStorage.getItem('basket') === null) {
    //Création du panier et du tableau produit 
    let basket = [];
    let product = [];
    //Récupération de l'id du produit et ajout au panier
    let id = element.getAttribute('id');
    if(id) {
      product.push(id);
      //Ajout de la quantité
      let quantity = 1;
      product.push(quantity);
      //Ajout du tableau produit dans le panier
      basket.push(product);
      //Sauvegarde du panier sur LocalStorage
      localStorage.setItem('basket', basket);
      console.log(basket);
    }
  } //Si le panier existe
    else {
    //On récupère le panier sur le localStorage et le transforme en tableau
    let basket = localStorage.getItem("basket").split(",");
    //Récupération de l'id du produit et ajout au panier
    let id = element.getAttribute('id');
    if(id) {
      if(basket.includes(id)) {
        let idx = basket.indexOf(id);
        basket[idx += 1]++;
      } else {
        let product = [];
        //Récupération de l'id du produit et ajout au panier
        let id = element.getAttribute('id');
        product.push(id);
        //Ajout de la quantité
        let quantity = 1;
        product.push(quantity);
        //Ajout du tableau produit dans le panier
        basket.push(product);
      }
      //Sauvegarde du panier sur LocalStorage
      localStorage.setItem('basket', basket);
      console.log(basket);
      }
    }
}

//Fonction permettant de vider le panier
const clearBasket = () => {
  if (localStorage.getItem('basket') === null) {
    window.alert("Votre panier ne contient aucun produit !")
  } else {
    localStorage.removeItem("basket");
  }
}

//Fonction permettant de retirer un produit du panier
/**
 * 
 * @param {HTMLElement} element 
 */
const removeProduct = (element) => {
  if(element) {
  //On récupère le panier sur le localStorage et le transforme en tableau
  let basket = localStorage.getItem("basket").split(",");
  if(basket) {
    if(basket.length===2) {
      localStorage.removeItem('basket');
      postBasket();
    } else {
      //Récupération de l'id du produit
      let id = element.getAttribute('id');
      if(id){
        //Récupération de l'index de l'id dans le tableau panier
        let idx = basket.indexOf(id);
        if(idx){
          //Retrait du produit et de la quantité du panier
          basket.splice(idx, 2);
          //Renvoi du nouveau panier sur le LocalStorage
          localStorage.setItem('basket', basket);
          //Retrait du produit de la page
          element.parentElement.remove();
        } else {
          window.alert("Ce produit n'est pas présent dans votre panier");
        }
      }
      }
    }
  }
}


/** LES BOITES MODALES */

//Fonction pour ajouter une boîte modale de confirmation
/**
 * 
 * @param {HTMLElement} element 
 * @param {string} text 
 */
const addConfirmBox = (element, text) => {
  let modalContainer = document.createElement('div');
  modalContainer.setAttribute('id', 'modal');

  let confirmBox = document.createElement('div');
  confirmBox.className = 'confirm-box';

  // Affichage boîte de confirmation
  element.addEventListener('click', function(e) {
    e.preventDefault();
    confirmBox.innerHTML = '<p>' + text + '</p>';
    if (text.includes("vider")) {
      confirmBox.innerHTML += '<button class="btn btn-modal" id="modal-confirm-clear">Confirmer</button>';
      confirmBox.innerHTML += '<button class="btn btn-modal" id="modal-close">Annuler</button>';
      modalShow();
    } else if (text.includes("retirer")) {
      confirmBox.innerHTML += '<button class="btn btn-modal" id="modal-confirm-remove">Confirmer</button>';
      confirmBox.innerHTML += '<button class="btn btn-modal" id="modal-close">Annuler</button>';
      modalShow();
    } else {
      confirmBox.innerHTML += '<button class="btn btn-modal" id="modal-confirm">Confirmer</button>';
      confirmBox.innerHTML += '<button class="btn btn-modal" id="modal-close">Annuler</button>';
      modalShow();
    }
  });

  //Fonction pour afficher la boîte modale
  function modalShow() {
      modalContainer.appendChild(confirmBox);
      document.body.appendChild(modalContainer);

      document.getElementById('modal-close').addEventListener('click', function() {
          modalClose();
      });
      //Si c'est la boîte modale pour vider le panier
      if (document.getElementById('modal-confirm-clear')) {
        document.getElementById('modal-confirm-clear').addEventListener('click', function () {
        console.log('Panier vidé !');
        //On vide le panier
        clearBasket();
        //On ferme la boîte modale
        modalClose();
        //On retire la pastille rouge de l'icône
        redDot();
        //On affiche ce qu'il faut en cas de panier vide
        postBasket();
        });
      }//Sinon si c'est la boîte modale pour retirer un produit
        else if (document.getElementById('modal-confirm-remove')) {
          document.getElementById('modal-confirm-remove').addEventListener('click', function () {
          console.log('Produit retiré !');
          //On retire le produit
          removeProduct(element);
          //On ferme la boîte modale
          modalClose();
          //On retire la pastille rouge si le panier est vide
          redDot();
          //On affiche le nouveau prix
          if(localStorage.getItem('basket')){
            getTotalPrice();
          }
          });
      } else { 
        document.getElementById('modal-confirm').addEventListener('click', function () {
        console.log('Produit ajouté !');
        //On ajoute le produit au panier
        pushProductInBasket(element);
        //On ferme la boîte modale
        modalClose();
        //On ajoute la pastille rouge sur l'icône si elle n'y est pas
        redDot();
        });
      }
    }
  //Fonction pour fermer la boîte modale
  function modalClose() {
      while (modalContainer.hasChildNodes()) {
          modalContainer.removeChild(modalContainer.firstChild);
      }
      document.body.removeChild(modalContainer);
  }
}


/** FONCTION DE REQUETES */


//Fonction de chargement de données distantes et renvoyant une promesse
/**
 * 
 * @param {string} url
 * @returns {Promise}
 * 
 */
async function loadProducts (url) {
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
}

//Fonction d'envoi des éléments de commande
/**
 * 
 * @returns 
 */
const sendOrder = () => {
  //Si un orderId est enregistré on le supprime
  if(localStorage.getItem('orderId')){
    localStorage.removeItem('orderId')
  }
  //On récupère les informations à envoyer
  let contact = getContact();
  let products = getProducts();

  //Vérification des types de contact et products avant l'envoi
  if(Array.isArray(products) && contact.validContact()) {
    //Si contact et products sont du bon type on crée la variable body qui sera envoyée
    let body = new Body(contact, products);

    fetch('http://localhost:3000/api/cameras/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => {
      //Envoi de l'orderId sur le LocalStorage
      localStorage.setItem('orderId', res.orderId);
      //On soumet le formulaire
      let form = document.querySelector('.needs-validation');
      form.submit();
      //On vide le panier
      localStorage.removeItem('basket');
    })

    .catch(e => console.log(e));
  }
}

//Fonction récupération des infos dans l'objet contact
/**
 * 
 * @returns {InstanceType} Contact
 */
 const getContact = () => {
  let firstName = document.getElementById("first-name").value;
  let lastName = document.getElementById("last-name").value;
  let address = document.getElementById("number").value + " " + document.getElementById("road").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("email").value;
  let contact = new Contact(firstName, lastName, address, city, email);
  return contact;
}

//Fonction récupération du tableau products à envoyer au serveur
/**
 * 
 * @returns {Array}
 */
const getProducts = () => {
  if(localStorage.getItem('basket')) {
    //Récupèration du panier sur localStorage avec séparation des ids et des quantités
    const basket = localStorage.getItem("basket").split(",").filter(word => word.length > 2);
    const quantities = localStorage.getItem("basket").split(",").filter(word => word.length < 3);
    //Push des ids dans le tableau products en fonction de la quantité
    var products = [];
    for(i=0 ; i<basket.length; i++) {
      for(j = 0; j < Number.parseFloat(quantities[i]) ; j++) {
        products.push(basket[i]);
      }
    }
    return products;
  }
}


/** EVENT LISTENERS */

// Fonction pour ajouter un produit au panier (event listener + confirm box)
const addToBasketListener = () => {
  let product = document.querySelectorAll('.btn-orinoco-secondary');
  product.forEach(
    function(currentValue) {
      addConfirmBox(currentValue, "Etes-vous sûr de vouloir ajouter ce produit à votre panier ?");
    });
}


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
    let pName = "p"+i;
    pName = new Product(
      response[i].lenses,
      response[i]._id,
      response[i].name,
      response[i].price,
      response[i].description,
      response[i].imageUrl
    );
    let productsContainer = document.getElementById('products');
    let product = createElementWithClass("div", "product");
    productsContainer.appendChild(product);
    let productCard = createProductCard(pName);
    product.appendChild(productCard);
    let img = createImgElement(pName);
    productCard.appendChild(img);
    let body = createProductBody(pName);
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
  let myProduct = new Product(
    response.lenses,
    response._id,
    response.name,
    response.price,
    response.description,
    response.imageUrl
  );
  let title = document.querySelector('.mainTitle');
  title.textContent = myProduct.name;
  let img = createImgElement(myProduct);
  let price = createElementWithClass('div', 'product_price');
  price.innerHTML = priceTransform(myProduct.price).toFixed(2) + " €";
  let dropdown = createSelectLenses(myProduct);
  let description = createElementWithClass('p', 'product_description');
  description.textContent = myProduct.description;
  let basketBtn = createElementWithClass('button', 'btn btn-orinoco-secondary');
  basketBtn.setAttribute('id', myProduct.id);
  basketBtn.textContent = 'Ajouter au panier';
  let container = document.getElementById('product_details');
  container.append(title, img, price, dropdown, description, basketBtn);
}

// Affichage des produits du panier
/**
 * 
 * @param {Array} response
 * @param {String} quantity
 * @returns void
 * 
 */
const postBasketProducts = (response, quantity) => {
    if(response && quantity) {
      let myProduct = new Product(
        response.lenses,
        response._id,
        response.name,
        response.price,
        response.description,
        response.imageUrl,
        quantity
      );
      //Création des éléments HTML pour l'image et le nom du produit
      let list = document.querySelector(".products_list");
      let basketItem = createElementWithClass('li', 'products_list--item row');
      let img = createImgElement(myProduct);
      img.classList.add('col-4', 'col-sm-2');
      let name = createElementWithClass('p', 'product_name col-6 col-sm-3');
      name.textContent = myProduct.name;
      
      //Création du "select menu" avec la quantité
      let qContainer = createElementWithClass('div', 'col-2')
      let q = createElementWithClass('select', 'product_quantity');
      q.innerHTML = "<option>"+quantity+"</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option>";
      qContainer.appendChild(q);
      //Ajout EventListener sur le select 
      q.addEventListener('change', (e) => {
        //On récupère la quantité choisie
        quantity = e.target.value;
        //On modifie le prix
        getPrice(quantity);
        //On modifie le prix total du panier
        getTotalPrice();
        //On récupère le panier sur le localStorage
        let basket = localStorage.getItem('basket').split(',');
        //On modifie la quantité du produit correspondant
        let idx = basket.indexOf(myProduct.id);
        basket[idx += 1] = quantity;
        //On enregistre le nouveau panier
        localStorage.setItem('basket', basket);
      })
      
      //Création de la poubelle pour retirer un produit du panier
      let trash = createElementWithClass('div', 'trash col-sm-2');
      trash.setAttribute('id', myProduct.id);
      trash.innerHTML = "<i class='fas fa-trash-alt'></i>";
      addConfirmBox(trash, "Voulez-vous retirer ce produit de votre panier ?");

      //Ajout du prix
      let price = createElementWithClass('div', 'product_price col-sm-3');
        //Fonction pour récupérer le prix
        const getPrice = (quantity) => {
          price.innerHTML = priceTransform(myProduct.price * quantity).toFixed(2) + " €";
        }
      getPrice(quantity);

      //Affichage des éléments sur la page
      basketItem.append(img, name, qContainer, trash, price);
      list.append(basketItem);
      let productsContainer = document.getElementById('products');
      productsContainer.appendChild(list);
    }
}
  

// Fonction créant un un élément HTML 'product_card'
/**
 * 
 * @param {InstanceType} Product
 * @returns {HTMLElement}
 */
const createProductCard = (Product) => {
  let product = document.createElement('a');
  product.setAttribute('href', "html/product.html?id=" + Product.id);
  product.setAttribute('class', 'product_card');
  product.setAttribute('id', Product.id);
  return product;
}

// fonction créant un élément 'image'
/**
 * 
 * @param {InstanceType} Product
 * @returns {HTMLElement}
 */
const createImgElement = (Product) => {
  let imgContainer = createElementWithClass('div', 'product_img');
  let img = document.createElement('img');
  img.setAttribute('src', Product.imageUrl);
  img.setAttribute('alt', Product.name);
  imgContainer.appendChild(img);
  return imgContainer;
}

//Fonction créant un élément 'product body'
/**
 * 
 * @param {InstanceType} Product
 * @returns {HTMLElement}
 */
const createProductBody = (Product) => {
  let productBody = createElementWithClass('div', 'product_body');
  let productName = createElementWithClass('h2', 'product_name');
  let productPrice = createElementWithClass('div', 'product_price');
  let productButton = createElementWithClass('button', 'btn btn-orinoco-secondary');
  productName.textContent = Product.name;
  productPrice.textContent = priceTransform(Product.price).toFixed(2) + ' €';
  productButton.textContent = 'Ajouter au panier';
  productButton.setAttribute('id', Product.id);
  productBody.appendChild(productName);
  productBody.appendChild(productPrice);
  productBody.appendChild(productButton);
  return productBody;
}

//Fonction pour créer un menu déroulant
/**
 * 
 * @param {InstanceType} Product
 * @returns {HTMLElement}
 */
const createSelectLenses = (Product) => {
  let select = createElementWithClass('select', 'form-select');
  select.innerHTML = "<option selected>Choisissez une lentilles</option>";
  for(i = 0 ; i < Product.lenses.length ; i++) {
    let option = document.createElement('option');
    option.setAttribute('value', i);
    option.innerHTML = Product.lenses[i];
    select.appendChild(option);
  }
  return select;
}

//Fonction créant un élément avec une classe
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

//Fonction pour afficher la pastille sur le panier
const redDot = () => {
  const basketIcon = document.getElementById('basket');
  //Si le panier est vide 
  if (localStorage.getItem("basket") === null && basketIcon.classList.contains("basket_hasProduct")) {
    basketIcon.classList.remove("basket_hasProduct");
  } else if (localStorage.getItem("basket") && !basketIcon.classList.contains("basket_hasProduct")) {
    basketIcon.classList.toggle("basket_hasProduct");
    }
}


//Fonction pour afficher le prix total du panier
const getTotalPrice = () => {
  //On récupère le tableau des prix des produits du panier
  let prices = document.querySelectorAll('.product_price');
  let total = 0;
  //On parcourt le tableau et on ajoute chaque prix à la variable "total"
  prices.forEach(
    function(currentValue){
      let price = parseInt(currentValue.innerText);
      total += price;
    }
  );
  //Enregistrement du prix total sur le localStorage
  localStorage.setItem('orderPrice', total.toFixed(2));
  //On affiche le prix total ou on le met à jour s'il existe déjà
  if(document.querySelector('.basket_price')===null) {
    let totalContainer = createElementWithClass('div', 'basket_price row');
    totalContainer.innerHTML = "<p class='col-sm-9'>Total de votre sélection :</p><p class='col-sm-3'>" + total.toFixed(2) + " €</p>";
    products.appendChild(totalContainer);
  } else {
    let totalContainer = document.querySelector('.basket_price');
    totalContainer.innerHTML = "<p class='col-sm-9'>Total de votre sélection :</p><p class='col-sm-3'>" + total.toFixed(2) + " €</p>";
  }
}

//Fonction pour afficher le contenu du panier et le prix total
/**
 * 
 * @param {Array} basket
 * @param {Array} quantities
 */
const getBasket = (basket, quantities) => {
  if (Array.isArray(basket) && Array.isArray(quantities)) {
    let prices = [];
    let reqFinished = 0;
    for(i = 0 ; i<basket.length ; i++) {
      let q = quantities[i];
      loadProducts("http://localhost:3000/api/cameras/" + basket[i])
        .then(function(content) {
          postBasketProducts(content, q);
          prices.push(content.price);
          reqFinished++;
          if(reqFinished===basket.length) {
            getTotalPrice();
          };
        })
        .catch(function (err) {
          console.error('Erreur !');
          console.dir(err);
          window.alert("Une erreur est survenue, veuillez réessayer !")
        });
    }
  }
}

//Fonction pour afficher le panier
const postBasket = () => {
  // Si le panier n'existe pas
  if (localStorage.getItem("basket") === null) {
    const products = document.getElementById('products');
    products.innerHTML = "";
    const formContainer = document.getElementById('basket_form');
    formContainer.innerHTML = "";
    //Afficher "votre panier est vide"
    const noBasket = createElementWithClass("h1", "basket_title");
    noBasket.innerHTML = "Votre panier est vide";
    products.appendChild(noBasket);
    //Afficher le bouton "voir la boutique" (lien vers la page d'accueil)
    const shopBtn = createElementWithClass("a", "homeLink");
    shopBtn.setAttribute("href", "../index.html");
    shopBtn.innerHTML = "<button class='btn btn-orinoco-primary'>Voir la boutique</button>";
    products.appendChild(shopBtn);
  } else {
    //Ajout du titre
    const basketTitle = createElementWithClass("h1", "basket_title");
    basketTitle.innerHTML = "Récapitulatif de votre panier";
    const products = document.getElementById('products');
    products.appendChild(basketTitle);

    //Récupèration du panier sur localStorage
    const basket = localStorage.getItem("basket").split(",").filter(word => word.length > 2);
    const quantities = localStorage.getItem("basket").split(",").filter(word => word.length < 3);
    //Afficher le contenu du panier et le prix total
    getBasket(basket, quantities);

    //Afficher le formulaire pour passer une commande
    const formContainer = document.getElementById('basket_form');
    checkFormValidity();

    //Afficher le bouton "vider le panier"
    const clearBasket = createElementWithClass("button", "btn btn-orinoco-primary clearBasket-button");
    clearBasket.innerHTML = "Vider mon panier";
    formContainer.appendChild(clearBasket);
    let clearBtn = document.querySelector('.clearBasket-button');
    addConfirmBox(clearBtn, "Etes-vous sûr de vouloir vider votre panier ?");
  }
}

//Fonction de validation du formulaire
const checkFormValidity = () => {
  var form = document.querySelector('.needs-validation');
  var formBtn = document.querySelector('.btn-order');
  formBtn.addEventListener('click', function (event) {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      event.preventDefault()
      event.stopPropagation()
      sendOrder()
    }
    form.classList.add('was-validated');
  }, false)
}


switch (whichPage()) {
  case ".homePage" :
    redDot();
    getListOfProducts();
    async function getListOfProducts() {
      try {
        const content = await loadProducts("http://localhost:3000/api/cameras");
        postProducts(content);
        addToBasketListener();
      } catch (err) {
        console.log('Erreur !');
      }
    }
    break;
  case ".productPage" :
    redDot();
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
  case ".basketPage" :
    redDot();
    postBasket();
    break;
  case ".orderPage" :
    redDot();
    //Affichage du prix total
    let orderPrice = localStorage.getItem('orderPrice');
    let price = document.querySelector(".order_price");
    price.textContent = orderPrice + ' €';
    //Affichage de l'id de commande
    let orderId = localStorage.getItem('orderId');
    let textId = document.querySelector(".order_id");
    textId.textContent = orderId;
    break;
  default :
    console.log("Page inconnue");
  
}