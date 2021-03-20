//Création de la classe "product"
class Product {
  constructor(lenses, id, name, price, description, imageUrl) {
    this.lenses = lenses;
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }
}

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
}
  
//Fonction pour récupérer l'id passé dans l'URL de la page
/**
 * 
 * 
 * @returns {string}
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

/** LES BOITES MODALES */

//Fonction pour ajouter une boîte modale de confirmation
/**
 * 
 * @param {HTMLElement} element 
 * @param {string} text 
 */
const addConfirmBox = (element, text) => {
  var modalContainer = document.createElement('div');
  modalContainer.setAttribute('id', 'modal');

  var confirmBox = document.createElement('div');
  confirmBox.className = 'confirm-box';

  // Affichage boîte de confirmation
  element.addEventListener('click', function(e) {
    e.preventDefault();
    confirmBox.innerHTML = '<p>' + text + '</p>';
    if (text.includes("vider")) {
      confirmBox.innerHTML += '<button class="btn btn-modal" id="modal-confirm-clear">Confirmer</button>';
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
      //Si c'est la boîte modale pour confirmer l'ajout au panier
      if (document.getElementById('modal-confirm-clear') === null) {
        document.getElementById('modal-confirm').addEventListener('click', function () {
        console.log('Confirmé !');
        //On ajoute le produit au panier
        pushProductInBasket(element);
        //On ferme la boîte modale
        modalClose();
        //On ajoute la pastille rouge sur l'icône si elle n'y est pas
        redDot();
      });
      }//Sinon (boîte modale pour vider le panier)
       else {
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
      }
      
      //fonction permettant d'ajouter un produit au panier
      /**
       * 
       * @param {HTMLElement} element 
       */
      function pushProductInBasket(element) {
        //Si le panier n'existe pas
        if (localStorage.getItem('basket') === null) {
          //Création du panier et du tableau 
          let basket = [];
          //Récupération de l'id du produit et ajout au panier
          let id = element.getAttribute('id');
          basket.push(id);
          //Sauvegarde du panier sur LocalStorage
          localStorage.setItem('basket', basket);
          console.log(basket);
        } //Si le panier existe
          else {
          //On récupère le panier sur le localStorage et le transforme en tableau
          let basket = localStorage.getItem("basket");
          let newBasket = basket.split(",");
          //Récupération de l'id du produit et ajout au panier
          let id = element.getAttribute('id');
          newBasket.push(id);
          //Sauvegarde du panier sur LocalStorage
          localStorage.setItem('basket', newBasket);
          console.log(newBasket);
          }
      }
      //Fonction permettant de vider le panier
      function clearBasket() {
        if (localStorage.getItem('basket') === null) {
          window.alert("Votre panier ne contient aucun produit !")
        } else {
          localStorage.removeItem("basket");
        }
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
  price.innerHTML = myProduct.price + " €";
  let dropdown = createDropdown(myProduct);
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
 * @returns void
 * 
 */
 const postBasketProducts = (response) => {
  let myProduct = new Product(
    response.lenses,
    response._id,
    response.name,
    response.price,
    response.description,
    response.imageUrl
  );
  let list = document.querySelector(".products_list");
  let basketItem = createElementWithClass('li', 'products_list--item row');
  let img = createImgElement(myProduct);
  img.classList.add('col-2');
  let name = createElementWithClass('p', 'product_name col-4');
  name.textContent = myProduct.name;
  let trash = createElementWithClass('div', 'trash col-3');
  trash.innerHTML = "<i class='fas fa-trash-alt'></i>";
  let price = createElementWithClass('div', 'product_price col-3');
  price.innerHTML = myProduct.price + " €";
  basketItem.append(img, name, trash, price);
  list.append(basketItem);
  let productsContainer = document.getElementById('products');
  productsContainer.appendChild(list);
}

// Fonction créant un un élément 'produit'
/**
 * 
 * @param {object} Product
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
 * @param {object} Product
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
 * @param {object} Product
 * @returns {HTMLElement}
 */
const createProductBody = (Product) => {
  let productBody = createElementWithClass('div', 'product_body');
  let productName = createElementWithClass('h2', 'product_name');
  let productPrice = createElementWithClass('div', 'product_price');
  let productButton = createElementWithClass('button', 'btn btn-orinoco-secondary');
  productName.textContent = Product.name;
  productPrice.textContent = Product.price + ' €';
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
 * @param {object} Product
 * @returns {HTMLElement}
 */
const createDropdown = (Product) => {
  let dropEnd = createElementWithClass('div', 'btn-group dropend');
  let btn = createElementWithClass('button', 'btn btn-secondary dropdown-toggle');
  btn.setAttribute('data-bs-toggle', 'dropdown');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = "Lentilles";
  let menu = createElementWithClass('ul', 'dropdown-menu');
  dropEnd.appendChild(btn);
  dropEnd.appendChild(menu);
  for(i = 0 ; i < Product.lenses.length ; i++) {
    let dropdownItem = document.createElement('li');
    dropdownItem.innerHTML = "<a class='dropdown-item' href='#'>" + Product.lenses[i] + "</a></li>";
    menu.appendChild(dropdownItem);
  }
  return dropEnd;
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
function redDot() {
  const basketIcon = document.getElementById('basket');
  //Si le panier est vide 
  if (localStorage.getItem("basket") === null && basketIcon.classList.contains("basket_hasProduct")) {
    basketIcon.classList.remove("basket_hasProduct");
  } else if (localStorage.getItem("basket") && !basketIcon.classList.contains("basket_hasProduct")) {
    basketIcon.classList.toggle("basket_hasProduct");
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
    let basket = localStorage.getItem("basket").split(",");
    console.log(basket);
    getBasket(basket);
    //Afficher le contenu du panier
    function getBasket(basket) {
      basket.forEach(
        function(currentValue) {
          loadProducts("http://localhost:3000/api/cameras/" + currentValue)
          .then(function(content) {
            postBasketProducts(content);
          })
          .catch(function (err) {
            console.error('Erreur !');
            console.dir(err);
            window.alert("Une erreur est survenue, veuillez réessayer !")
          });
        }
      );
    }
    //Afficher le prix total
    
    function getTotalPrice() {
      let prices = document.querySelectorAll('.product_price');
        let total = 0;
        prices.forEach(
          function(currentValue){
            let price = parseInt(currentValue.innerText);
            total += price;
          }
        );
        let totalContainer = createElementWithClass('div', 'basket_price');
        totalContainer.innerHTML = "<p>Total de votre sélection : " + total + " €";
        products.appendChild(totalContainer);
    }
    //Afficher le formulaire pour passer une commande
    const formContainer = document.getElementById('basket_form');
    //Afficher le bouton "vider le panier"
    const clearBasket = createElementWithClass("button", "btn btn-orinoco-primary clearBasket-button");
    clearBasket.innerHTML = "Vider mon panier";
    formContainer.appendChild(clearBasket);
    let clearBtn = document.querySelector('.clearBasket-button');
    addConfirmBox(clearBtn, "Etes-vous sûr de vouloir vider votre panier ?");
  }
}

//Fonction de validation du formulaire
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

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
  default :
    console.log("Page inconnue");
  
}