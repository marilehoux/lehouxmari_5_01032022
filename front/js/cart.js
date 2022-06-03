panierDisplay();

/** la fonction modifyQuantity est appelée depuis la fonction panierDisplay et sert à modifier la quantité d'un produit 
 * @param {string} id id du produit
 * @param {string} color couleur du produit
 * @param {number} quantity quantité du produit
 */
function modifyQuantity(id, color, quantity) {
	var products = JSON.parse(localStorage.getItem('products'));
	let product = products.find(p => p.id === id && p.color === color );

	if (product) {
		if (quantity == 0 || quantity > 100) {
			alert ('La quantité du doit être comprise entre 1 et 100')
		}
		else { 
		product.quantity = quantity;
		}
	};
	localStorage.setItem('products', JSON.stringify(products));


	const cartItems = document.getElementById("cart__items");
	let children = cartItems.children;
	
	for( let i of children ) {
		cartItems.removeChild(i);
	};

	panierDisplay();
}
/** la fonction supprItem est appelée depuis la fonction panierDisplay et sert à supprimer un produit
 * 
 * @param {string} id 
 * @param {string} color 
 */
function supprItem(id, color) {
	var products = JSON.parse(localStorage.getItem('products'));
	let product = products.find(p => p.id === id && p.color === color);
	if (product) {
		product.quantity = 'O';
	};

	var myIndex = products.indexOf(product);
	if (myIndex !== -1) {
		products.splice(myIndex, 1);
	};
	
	localStorage.setItem('products', JSON.stringify(products));
	const cartItems = document.getElementById("cart__items");
	let children = cartItems.children;

	for( let i of children ) {
		cartItems.removeChild(i);
	};
	panierDisplay();
}

/** 
 * Affichage des produits du panier, utilise Localstorage et fetch api
  */
function panierDisplay() {
	const cartItems = document.getElementById("cart__items");
	var productSaved = JSON.parse(localStorage.getItem('products'));
	// si le panier est vide
	if (productSaved == null || productSaved == [] || productSaved.length < 1) {
		cartItems.innerHTML = 'Votre panier est vide.';
		//calculPrixTotal();
		document.getElementById('order').addEventListener('click', function(e) {
		e.preventDefault();
		alert('Commande impossible, votre panier est vide.');
		})
	} 
	else {
		cartItems.innerHTML = "";
		let quantiteTotal = 0;
		let prixTotal = 0;
		let positionPrixTotal = document.getElementById("totalPrice");
		let positionQuantiteTotal = document.getElementById("totalQuantity");
		//on boucle sur chaque élément du tableau et on crée un objet produit comprenant tous les attributs
		productSaved.forEach(oneProduct => {
			let productId = oneProduct.id;
			fetch('http://localhost:3000/api/products/'+productId)
			.then(function(response) {
				return response.json();
			})
			.then(function(resolve) {
				let product = {
					'color': oneProduct.color,
					'quantity': parseInt(oneProduct.quantity),
					'name': resolve.name,
					'price': resolve.price,
					'imgUrl': resolve.imageUrl,
					'id': productId,
					'alt': resolve.altTxt,
				};

				quantiteTotal += product.quantity;
				prixTotal += product.quantity * product.price;

				// création des éléments dans le DOM
				let article = document.createElement("article");
				let divImg = document.createElement("div");
				let img = document.createElement("img");
				let divItemContent = document.createElement("div");
				let divItemDescrip = document.createElement ("div");
				let nomh2 = document.createElement ("h2");
				let couleur = document.createElement ("p");
				let prix = document.createElement ("p");
				let divSettings = document.createElement("div");
				let divQuantity = document.createElement("div");
				let libelleQte = document.createElement("p");
				let modifQuantity = document.createElement("input");
				let divDelete = document.createElement("div");
				let suppr = document.createElement("p");
				// création des attributs des éléments
				article.classList.add("cart__item");
				article.dataset.id = product.id;
				article.dataset.color= product.color;
				divImg.classList.add("cart__item__img");
				img.src = product.imgUrl;
				img.alt = product.alt;
				divItemContent.classList.add("cart__item__content");
				divItemDescrip.classList.add("cart__item__content__description");
				nomh2.innerText = product.name;
				couleur.innerText = product.color;
				prix.innerText = product.price + ' €';
				divSettings.classList.add("cart__item__content__settings");
				divQuantity.classList.add("cart__item__content__settings__quantity");
				libelleQte.innerText = 'Qté :';
				modifQuantity.classList.add("itemQuantity");
				modifQuantity.type = "number";
				modifQuantity.name = "itemQuantity";
				modifQuantity.min = "1";
				modifQuantity.max = "100";
				modifQuantity.value = product.quantity;
				divDelete.classList.add("cart__item__content__settings__delete");
				suppr.classList.add("deleteItem");
				suppr.innerText = 'Supprimer';
				//affichage des élements
				divDelete.appendChild(suppr);
				divQuantity.appendChild(libelleQte);
				divQuantity.appendChild(modifQuantity);
				divSettings.appendChild(divQuantity);
				divSettings.appendChild(divDelete);
				divItemDescrip.appendChild(nomh2);
				divItemDescrip.appendChild(couleur);
				divItemDescrip.appendChild(prix);
				divItemContent.appendChild(divItemDescrip);
				divItemContent.appendChild(divSettings);
				divImg.appendChild(img);
				article.appendChild(divImg);
				article.appendChild(divItemContent);
				cartItems.appendChild(article);

				positionPrixTotal.innerText = prixTotal;
				positionQuantiteTotal.innerText = quantiteTotal;
				// console.log(prixTotal);console.log(quantiteTotal);console.log(productSaved);

				suppr.addEventListener('click', e => {
					supprItem(product.id, product.color);
				});
				modifQuantity.addEventListener('change', e => {
					modifyQuantity(product.id, product.color, modifQuantity.value);
				});

			});
		});
	};
};

/** 
 * fonction activée à lors de la commande du client, utilise Fetch et api
 */

sendOrder();

function sendOrder () { 
	const order = document.getElementById('order');

	order.addEventListener('click', (e) => {
		// Vérification avec Regex des champs du formulaire. variable témoin isGood passé à true
		let isGood = true;
		e.preventDefault(); // pour empêcher le GET du Form HTML
		alert (isGood);
		let firstname = document.getElementById("firstName").value;
			if (/^[a-zA-Zàâäéèêëïîôöùûüç'-]/.test(firstname) === false){
				document.getElementById('firstNameErrorMsg').textContent ='Erreur de saisie!';
				isGood = false;
			};

		let lastname = document.getElementById("lastName").value;
			if (/^[a-zA-Zàâäéèêëïîôöùûüç'-]/.test(lastname) === false){
				document.getElementById('lastNameErrorMsg').textContent ='Erreur de saisie!';
				isGood = false;
			};

		let address = document.getElementById("address").value;
			if (/^[a-zA-Zàâäéèêëïîôöùûüç' ,0-9]+$/.test(address) === false){
				document.getElementById('addressErrorMsg').textContent ='Erreur de saisie!';
				isGood = false;
			}

		let city = document.getElementById("city").value;
			if (/^[a-zA-Zàâäéèêëïîôöùûüç'-]/.test(city) === false){
				document.getElementById('cityErrorMsg').textContent ='Erreur de saisie!';
				isGood = false;
			}

		let email = document.getElementById("email").value;
			if (/^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-_]+.[a-z]{2,10}/.test(email) === false){
				document.getElementById('emailErrorMsg').textContent ='Erreur de saisie!';
				isGood = false;
			}
			alert(isGood);
		if (isGood == true) { 
		
			let contact = {
				firstName : firstname,
				lastName : lastname,
				address : address,
				city : city,
				email : email,
			}
			alert(isGood);
			console.dir(contact);
			console.log (email); console.log(isGood);

			var produitCommande = JSON.parse(localStorage.getItem('products'));

			console.log(produitCommande);// contrôle du tableau de produits
			console.dir(produitCommande);

			let productId = [];
			for (let i = 0; i < produitCommande.length; i++) {
				productId.push(produitCommande[i].id);
			}
			console.log (productId);

			let products = {
				products: productId,
			}
			//console.log(products);

			let order = {
				contact : contact,
				products : productId,
			}
			console.log(order); // contrôle du tableau à envoyer
			alert ('fectch ok ?');

			fetch("http://localhost:3000/api/products/order", { 
				method:"POST",
				headers: {
					'Accept': 'application/json', 
					'Content-Type': 'application/json' 
				},
				body: JSON.stringify(order),
			})
			.then((res) => {
				console.log(res);
				return res.json();
			})
			.then((data) => {
				console.log(data);
				const orderId = data.orderId;
				console.log(orderId);
				//alert('avant la confirmation'); //contrôle des console.log avant confirmation
				window.location.href = 'confirmation.html'+'?orderId=' +orderId;
			})
		}
	});
	
};
      
 