const params = new URLSearchParams(location.search);
document.getElementById('orderId').textContent = params.get('orderId');