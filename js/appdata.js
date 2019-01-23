function cart_add(prodId, successCallback) {
	$.post(
			'/addtocart',
			{
				productId: prodId
			},
			function(data, status) {
					if(status === "success") {
						if(successCallback) successCallback();
					}
					else {
						alert("Não foi possível adicionar o item ao carrinho!");
					}
			}
	);
	alert("Produto adicionado ao carrinho!");
}

function cart_remove(prodId, successCallback) {
	$.post(
		'/removefromcart',
		{
			productId: prodId
		},
		function(data, status) {
				if(status === "success") {
					if(successCallback) successCallback();
				}
				else {
					alert("Não foi possível remover o item ao carrinho!");
				}
		}
);
}