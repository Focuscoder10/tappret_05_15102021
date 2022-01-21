// si pas de panier dans le localstorage alors création de ce dernier
if (!localStorage.getItem("panier")) {
  console.log("création du panier");
  let init = [];
  localStorage.setItem("panier", JSON.stringify(init));
} else {
  console.log("panier existant");
}

//fonction de redirection vers la page d'acceuil en cas de soucis
function redirect(url = "http://127.0.0.1:5500/front/html/index.html"){
  location = url;
}

let params = new URL(document.location).searchParams;
let id = params.get("id");

//initialise le panier 
let panier = JSON.parse(localStorage.getItem("panier"));
console.log(panier);

// methode fetch avec récupération de l'id via la variable "id" créer en amont
fetch("http://localhost:3000/api/products/" + id)
  .then((res) => res.json())
  .then((data) => {
    let title = document.getElementById("title"),
      image = document.querySelector("article > .item__img"),
      newImg = document.createElement("img"),
      price = document.getElementById("price"),
      description = document.getElementById("description"),
      colors = document.getElementById("colors");
    newImg.setAttribute("src", `${data.imageUrl}`); // newImg.src = data.imageUrl
    newImg.setAttribute("alt", `${data.altTxt}`);
    image.appendChild(newImg);
    title.innerHTML = `${data.name}`;
    price.innerHTML = `${data.price}`;
    description.innerHTML = `${data.description}`;
    //function qui crée un element option lui ajoute l'attribut value et la variable color
    data.colors.forEach((color) => {
      const newColor = document.createElement("option");
      newColor.setAttribute("value", `${color}`);
      newColor.textContent = `${color}`;
      colors.appendChild(newColor);
    });

    let selectColor = document.getElementById("colors");
    let quantity = document.getElementById("quantity");
    let btn = document.getElementById("addToCart");
    //function avec écouteur d'évènements au clic qui vérifie la quantité et la couleur
    btn.addEventListener("click", function () {
      let qty = parseInt(quantity.value, 10);
      if (qty < 1) {
        alert("La quantité n'est pas correcte");
        return;
      }
      if (!selectColor.value.length) {
        alert("Veuillez choisir une couleur");
        return;
      }
      //object "newData" contenant les informations produits
      let newData = {
        id: data._id,
        // name: data.name,
        // price: data.price,
        // description: data.description,
        // image: data.imageUrl,
        // txt: data.altTxt,
        quantity: qty,
        color: selectColor.value,
      };
      //  let tryId = panier.find(element => element.id == newData.id && element.color == newData.color);
      let tryId = panier.find(function (element) {
        //find permet de chercher un élement dans un tableau
        //ici la function parcours un tableau et retourne newData.id et newData.color
        return element.id == newData.id && element.color == newData.color;
      });
      //condition si l'tryId existe déjà ou ajoute à la quantité existante sinon on envoie le nouvelle objet
      if (tryId) {
        tryId.quantity += qty; // tryId.quantity = tryId.quantity + qty;
        console.log("append");
      } else {
        panier.push(newData);
        console.log("new");
      }
      localStorage.setItem("panier", JSON.stringify(panier));
      console.log(panier);
    });
    
  })

  .catch(e => redirect());
