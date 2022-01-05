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
    try {
      // permet d'éviter une cassure dans l'exécution du code
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
const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

document
  .querySelector(".cart__order__form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;
    for (const input of this.elements) {
      const errorMsg = input.nextElementSibling;
      switch (input.type) {
        case "text":
          if (!input.value.length) {
            switch (input.name) {
              case "firstName":
                errorMsg.textContent = "Veuillez saisir votre prénom";
                break;
              case "lastName":
                errorMsg.textContent = "Veuillez saisir votre nom";
                break;
              case "address":
                errorMsg.textContent = "Veuillez saisir votre adresse";
                break;
              case "city":
                errorMsg.textContent = "Veuillez saisir votre ville";
                break;
            }
            isValid = false;
          } else {
            errorMsg.textContent = null;
          }
          break;
        case "email":
          if (!emailRegex.test(input.value)) {
            errorMsg.textContent = "Veuillez saisir une adresse email valide";
            isValid = false;
          } else {
            errorMsg.textContent = null;
          }
          break;
      }
    }

    if (isValid) {
      const obj = {
        contact: {
          firstName: this.elements.firstName.value,
          lastName: this.elements.lastName.value,
          address: this.elements.address.value,
          city: this.elements.city.value,
          email: this.elements.email.value,
        },
        products: getBasket().map(function(item) { //map retourne un tableau avec seulement l'élement précisé
          return item.id
        }),
      };
      // console.log(obj);

      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        location = 'confirmation.html?orderId=' + data.orderId;
      });
    }
  });
