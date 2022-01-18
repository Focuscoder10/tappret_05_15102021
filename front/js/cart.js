// boucle sur le panier et function qui crée un des éléments html avec les variables requises type img, id name etc
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
//appel de function pour le calcul du prix et de la quantité
calcBasket();

totalQuantity = document.getElementById("totalQuantity");
totalPrice = document.getElementById("totalPrice");

//enregistrement des données sur le localstorage
function saveBasket(panier) {
  localStorage.setItem("panier", JSON.stringify(panier));
  calcBasket();
}
//récupération du local storage de la clé panier
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
//function permettant de changer la quantité d'un produit(ajout et supp) via l'id de ce dernier
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
//function parcourant le panier et ajoutant à count la quantité d'item présent ainsi qu'à somme le prix par multiplication du prix par la quantité
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

//function visant à supprimer un produit du panier
function removeFromBasket(product) {
  let panier = getBasket();
  panier = panier.filter((i) => i.id != product.dataset.id); //! = retire seulement l'id demandé
  saveBasket(panier);
  product.remove();
}

const cartItems = document.getElementById("cart__items");
if (cartItems) {
  //function qui permet de supprimer un produit si pas de btn trouvé on arrête le code sinon on suprimme .cart__item grâce à l'appel de function removeFromBasket
  cartItems.addEventListener("click", function (event) {
    const btn = event.target.closest(".deleteItem");
    if (!btn) return;
    const item = btn.closest(".cart__item");
    if (item) removeFromBasket(item);
  });
  //function qui permet de modifier la quantité si pas de bouton on arrête le code sinon on change la quantité via un appel de function sur l'input
  cartItems.addEventListener("change", function (event) {
    const input = event.target.closest("input[type=number]");
    if (!input) return;
    const item = input.closest(".cart__item");
    if (item) changeQuantity(item, input);
  });
}

//regex
const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

//regex excluante
const numberRegex = /\d/; // \d -> [0-9]


// function qui vérifie si une des deux conditions est remplit (il n'y a pas de valeur ou un nombre est présent)
function isInvalid(input) {
  return !input.value.length || numberRegex.test(input.value);
}

document
  .querySelector(".cart__order__form")
  //la function à la souscription si après appel de la function isInvalid celle ci trouve une occurence alors le msg d'erreur s'affiche
  // sauf pour le cas de l'adresse ou c'est uniquement l'absence de remplissage du champ qui retourne une erreur.
  // et pour l'adresse email ou il y a une retour d'erreur si les règles de l'emailRegex ne son pas respectées.
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;
    for (const input of this.elements) {
      // ne prend que ce qui sera soumis par le formulaire
      const errorMsg = input.nextElementSibling;
      if (!errorMsg) continue;
      errorMsg.textContent = null;
      switch (input.name) {
        case "firstName":
          if (isInvalid(input)) {
            errorMsg.textContent = "Veuillez saisir votre prénom";
            isValid = false;
          }
          break;
        case "lastName":
          if (isInvalid(input)) {
            errorMsg.textContent = "Veuillez saisir votre nom";
            isValid = false;
          }
          break;
        case "city":
          if (isInvalid(input)) {
            errorMsg.textContent = "Veuillez saisir votre ville";
            isValid = false;
          }
          break;
        case "address":
          if (!input.value.length) {
            errorMsg.textContent = "Veuillez saisir votre adresse";
            isValid = false;
          }
          break;
        case "email":
          if (!emailRegex.test(input.value)) {
            errorMsg.textContent = "Veuillez saisir une adresse email valide";
            isValid = false;
          }
          break;
      }
    }
    //si isValid après exécution du code ci-dessus est "true" alors on crée l'objet avec les sous-objets contact et products.
    if (isValid) {
      const obj = {
        contact: {
          firstName: this.elements.firstName.value,
          lastName: this.elements.lastName.value,
          address: this.elements.address.value,
          city: this.elements.city.value,
          email: this.elements.email.value,
        },
        //function avec map qui retourne un tableau avec seulement l'élement précisé
        products: getBasket().map(function (item) {
          return item.id;
        }),
      };
      console.log(obj);

      //method post pour envoyer une app/json sur notre API
      fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          //représente l'emplacement de l'objet à laquelle elle est lié
          location = "confirmation.html?orderId=" + data.orderId;
        })
        .catch((err) => console.error(err));
    }
  });
