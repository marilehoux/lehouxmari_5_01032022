let params = (new URL(document.location)).searchParams;
let idProduct = params.get('id');
console.log(idProduct);

fetch("http://localhost:3000/api/products/"+idProduct)
// appelle le serveur et demande la liste des produits

.then(function(res) {
	if (res.ok) {
	console.log(res.json);
	return res.json();      
	}
	else {
	alert ('le serveur ne répond pas')
	}
})

// récupère l'input précédent
.then(function(value) {
	console.log(value);
	afficherProduit(value);
})
.catch(function(err) {
	alert('il n\'est pas possible d\'afficher votre produit actuellement')
});
/**
 * permet d'affficher le produit sur la page
 * @param {array} unProduit 
 */

function afficherProduit (unProduit){
	let image = document.createElement("img");
	image.src = unProduit.imageUrl;
	image.alt = unProduit.altTxt;
	let divImg = document.getElementsByClassName ('item__img');
	divImg[0].appendChild(image);
	let nomProduit = document.getElementById('title');
	nomProduit.innerText = unProduit.name;
	let prixProduit = document.getElementById('price');
	prixProduit.innerText = unProduit.price;
	let descriptProduit = document.getElementById ('description');
	descriptProduit.innerText = unProduit.description;
	let colorProduit = document.getElementById('colors');
/**
 * boucle sur les différentes valeurs de colors pour afficher le choix d'option
 * @param {array} couleurs
 */
	unProduit.colors.forEach(function(couleurs){
		let option = document.createElement("option");
		option.value = couleurs;
		option.innerText = couleurs;
		colorProduit.appendChild(option);
	});

	console.log(unProduit)
}



// je mets l'écouteur sur le bouton ajouter au panier
let elt = document.getElementById('addToCart');    // je récupère l'élément sur lequel je veux  détecter le clic
elt.addEventListener('click', () => {          // j'écoute l'événement click
	let id = params.get('id');
	let cc = document.querySelector("#colors");	// je récupère dans cc l'élément colors
	let couleurProduit = cc.value; // je récupère la couleur sélectionnée
	let cq = document.querySelector("#quantity"); // même chose pour la quantité
	let quantiteProduit = cq.value;



	if (!couleurProduit) {
		alert('vous n\'avez pas sélectionné la couleur de votre canapé');
	} //fin de si pas de couleur
	else {
		//alert('OK vous avez choisi la couleur ' + cc.value)

		if (quantiteProduit < 1 || quantiteProduit > 100){
			alert('votre quantité doit être comprise entre 1 et 100')
		} // fin de si quantité hors bornes
		else {
			//alert ('vous avez choisi ' + cq.value +' Kanap')
			//alert ('Souhaitez-vous ajouter cet article à votre panier?')
			//elt.innerHTML = "Article ajouté !"; // je change le contenu de l'élément pour afficher le message
      let products = JSON.parse(localStorage.getItem('products'));
      let product ={'id':id,'color':couleurProduit, 'quantity':quantiteProduit};
      if (products === null){
        products = [];
        products.push(product);
      }
      else{
        let verification = false;
        products.forEach (prod =>{
          if (prod.id === id && prod.color === couleurProduit){
            verification = true;
            prod.quantity = parseInt(quantiteProduit) + parseInt(prod.quantity);
          }
        });
        if(!verification){
          products.push(product);
        }
      }
      localStorage.setItem('products', JSON.stringify(products));
      addToCart.innerText = 'Produit ajouté'

      if(confirm('Votre produit a été ajouté dans le panier, voulez-vous ajouter un autre produit?')==true){
        window.location.href = 'index.html';
      }
      else{
        window.location.href = 'cart.html';
      }
		}; // fin de else de si quantité hors bornes
	}; //fin de else de si pas de couleur
});

    
    


   
  
 





