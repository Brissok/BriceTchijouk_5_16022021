let products_id = [];

var request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        for (let i = 0 ; i < response.lenght ; i++) {
          let id = response[i]._id;
          products_id.push(id);
        }
        return products_id;
    }
};
request.open("GET", "http://localhost:3000/api/cameras");
request.send();


/**
 * 
 * @param {objectID} id
 * @returns {HTMLElement}
 */
const createProduct = (id) => {
  let product = document.createElement('a');
  product.setAttribute('href', "#");
  product.setAttribute('class', 'product');
  product.setAttribute('id', id);
  return product;
}
l
const createDivImg = (id) => {
  let imageUrl = ;
  let div = document.createElement('div');
  div.setAttribute('class', 'product-img');
  div.setAttribute('src', imageUrl);
  div.setAttribute('alt', name);
}