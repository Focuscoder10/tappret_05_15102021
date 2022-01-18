// cette fonction crée un élement template dans lequel est injecté une structure html,
 //à l'intérieur de laquel on récupère des informations transmise par notre api
function createArticle(article) {
  const template = document.createElement("template");
  template.innerHTML = `
    <a href="product.html?id=${article._id}">
      <article>
        <img src="${article.imageUrl}" alt="${article.altTxt}">
        <h3>${article.name}</h3>
        <p>${article.description}</p>
      </article>
    </a>`;
  return template.content;
}

const items = document.getElementById("items");

//fonction de redirection vers la page d'acceuil en cas de soucis
function redirect(url = "http://127.0.0.1:5500/front/html/index.html"){
  location = url;
}

// on effectue notre requête fetch on passe la réponse au format json pour pouvoir la lire
// on parcours ensuite nos données récupérées grace à une boucle forEach.
//on lui dit d'ajouter un enfant à l'id (sélecteur)"items"puis on effectue un appel de la function crée plus haut
//afin d'avoir un affiche de notre structure
  fetch("http://localhost:3000/api/products/")
  .then(res => res.json())
  .then(data => 
    data.forEach(article =>
      items.appendChild(createArticle(article))
    ))
  .catch(e => redirect());
  
  