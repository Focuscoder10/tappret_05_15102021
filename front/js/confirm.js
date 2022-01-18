const params = new URLSearchParams(location.search);
document.getElementById("orderId").textContent = params.get('orderId');
alert("Votre commande a bien été effectuée, Merci de votre confiance!");
