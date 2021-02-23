var request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var response = JSON.parse(this.responseText);
        var cardImg = document.getElementById("cardImg");
        cardImg.innerHTML = "<img src='" + response[0].imageUrl + "' alt='" + response[0].name + "'>";
    }
};
request.open("GET", "http://localhost:3000/api/cameras/5be1ef211c9d44000030b062");
request.send();

  /**
   * 
   * @param {string} className
   * @returns {HTMLElement}
   */
  createDivWithClass(className) {
    let div = document.createElement('div');
    div.setAttribute("class", className);
    return div;
  };