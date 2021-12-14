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

  fetch("http://localhost:3000/api/products/")
  .then(res => res.json())
  .then(data => 
    data.forEach(article =>
      items.appendChild(createArticle(article))
    ))
  .catch(err => console.error(err));
  
  