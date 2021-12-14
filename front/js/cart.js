let panier = JSON.parse(localStorage.getItem("panier"));
panier.forEach(function(article){
  let showCart = document.getElementById("cart__items")
  showCart.innerHTML += `<article class="cart__item" data-id="{product-ID}">
  <div class="cart__item__img">
    <img src="../images/product01.jpg" alt="Photographie d'un canapé">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__titlePrice">
      <h2>Nom du produit</h2>
      <p>${article.price},00 €</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`;
  })
  