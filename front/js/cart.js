getBasket().forEach(function (article) {
  let showCart = document.getElementById("cart__items");
  showCart.innerHTML += `<article class="cart__item" data-id="${article.id}">
  <div class="cart__item__img">
    <img src="${article.image}" alt="${article.txt}">
  </div>
  <div class="cart__item__content">
    <div class="cart__item__content__titlePrice">
      <h2>${article.name}</h2>
      <p>${article.price},00 €</p>
      <p>${article.color}</p>
    </div>
    <div class="cart__item__content__settings">
      <div class="cart__item__content__settings__quantity">
        <p>Qté : </p>
        <input type="number" class="" name="${article.name}" min="1" max="100" value="${article.quantity}">
      </div>
      <div class="cart__item__content__settings__delete">
        <p class="deleteItem">Supprimer</p>
      </div>
    </div>
  </div>
</article>`;
});
calcBasket();

totalQuantity = document.getElementById("totalQuantity");
totalPrice = document.getElementById("totalPrice");

//enregistrement des données sur le localstorage
function saveBasket(panier) {
  localStorage.setItem("panier", JSON.stringify(panier));
  calcBasket();
}
//récupération du local storage
function getBasket() {
  let panier = localStorage.getItem("panier");
  if (panier == null) {
    return [];
  } else {
    try { // permet d'éviter une cassure dans l'exécution du code
      return JSON.parse(panier);
    } catch (e) {
      return [];
    }
  }
}

function changeQuantity(product, input) {
  let panier = getBasket();
  let foundProduct = panier.find((p) => p.id == product.dataset.id); //recherche si l'id du produit éxiste déjà
  if (foundProduct != undefined) {
    const quantity = parseInt(input.value, 10);
    foundProduct.quantity = quantity; // foundProduct.quantity = foundProduct.quantity + quantity;
    if (foundProduct.quantity <= 0) {
      removeFromBasket(product);
    } else {
      saveBasket(panier);
    }
  }
}

function calcBasket() {
  let panier = getBasket();
  let count = 0;
  let somme = 0;
  panier.forEach((item) => {
    count += item.quantity;
    somme += item.price * item.quantity;
  });
  totalQuantity.textContent = count;
  totalPrice.textContent = somme;
}

//supprimer un produit du panier
function removeFromBasket(product) {
  let panier = getBasket();
  panier = panier.filter((i) => i.id != product.dataset.id); //! = retire seulement l'id demandé
  saveBasket(panier);
  product.remove();
}
//   let btnSupp = document.querySelector(".deleteItem");
// btnSupp.addEventListener("click", removeFromBasket);
// btnSupp.addEventListener("click", () => {
//   removeFromBasket('truc');
// });
// btnSupp.addEventListener("click", removeFromBasket.bind(null, 'truc'));
//  //Sélection du bouton supprimer
//   let childSupp = document.getElementsByClassName("cart__item__content__settings__delete");
//déléguation d'évènement
const cartItems = document.getElementById("cart__items");
if (cartItems) {
  cartItems.addEventListener("click", function (event) {
    const btn = event.target.closest(".deleteItem");
    if (!btn) return;
    const item = btn.closest(".cart__item");
    if (item) removeFromBasket(item);
  });
  cartItems.addEventListener("change", function (event) {
    const input = event.target.closest("input[type=number]");
    if (!input) return;
    const item = input.closest(".cart__item");
    if (item) changeQuantity(item, input);
  });
}


