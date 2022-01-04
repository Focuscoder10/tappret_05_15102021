if (!localStorage.getItem("panier")) {
  console.log("création du panier");
  let init = [];
  localStorage.setItem("panier", JSON.stringify(init));
} else {
  console.log("panier existant");
}

let params = new URL(document.location).searchParams;
let id = params.get("id");
// console.log(id);

let panier = JSON.parse(localStorage.getItem("panier"));
console.log(panier);

fetch("http://localhost:3000/api/products/" + id)
  .then((res) => res.json())
  .then((data) => {
    let title = document.getElementById("title"),
      image = document.querySelector("article > .item__img"),
      newImg = document.createElement("img"),
      price = document.getElementById("price"),
      description = document.getElementById("description"),
      colors = document.getElementById("colors");
    newImg.setAttribute("src", `${data.imageUrl}`);
    newImg.setAttribute("alt", `${data.altTxt}`);
    image.appendChild(newImg);
    title.innerHTML = `${data.name}`;
    price.innerHTML = `${data.price}`;
    description.innerHTML = `${data.description}`;
    data.colors.forEach((color) => {
      const newColor = document.createElement("option");
      newColor.setAttribute("value", `${color}`);
      newColor.textContent = `${color}`;
      colors.appendChild(newColor);
    });

    let selectColor = document.getElementById("colors");
    let quantity = document.getElementById("quantity");
    let btn = document.getElementById("addToCart");
    btn.addEventListener("click", function () {
      let qty = parseInt(quantity.value, 10);
      if(qty < 1) {
        alert("La quantité n'est pas correcte");
        return;
      }
      if(!selectColor.value.length) {
        alert("Veuillez choisir une couleur");
        return;
      }
      let newData = {
        id: data._id,
        name: data.name,
        price: data.price,
        description: data.description,
        image: data.imageUrl,
        txt: data.altTxt,
        quantity: qty,
        color: selectColor.value,
      };
      //  let tryId = panier.find(element => element.id == newData.id && element.color == newData.color);
      let tryId = panier.find(function (element) {
        return element.id == newData.id && element.color == newData.color;
      });

      if (tryId) {
        tryId.quantity += qty;
        console.log("append");
      } else {
        panier.push(newData);
        console.log("new");
      }
      localStorage.setItem("panier", JSON.stringify(panier));
      console.log(panier);
      // panier.forEach(select =>
      //   items.appendChild())
    });
  })

  .catch((err) => console.error(err));

/*Partie bouton et panier*/
