fetch("http://localhost:3000/api/products")
// appelle le serveur et demande la liste des produits

.then(function(res) {
	if (res.ok) {
	console.log(res.json);
	return res.json();      
}
})

// récupère l'input précédent
.then(function(value) {
	console.log(value);
	afficherProduit(value);
})
.catch(function(err) {
	alert('il n\'est pas possible d\'afficher les produits')
});
/**
 * boucle sur tableau produit pour affichage des produits
 * @param {array} tableauProduit  liste des produits
 */
function afficherProduit (tableauProduit){
	let sectionProduit = document.getElementById('items');
	tableauProduit.forEach(function(unProduit){
		//ici création des balises dans "document"
		let lien = document.createElement("a");
		let article = document.createElement("article");
		let image = document.createElement("img");
		let productName = document.createElement("h3");
		let productDescription = document.createElement("p");
		// on a construit les balises, on écrit maintenant leurs propriétés
		lien.href = './product.html?id='+ unProduit._id;   
		image.src = unProduit.imageUrl;
		image.alt = unProduit.altTxt;
		productName.innerHTML =  unProduit.name;
		productName.classList.add("productName");
		productDescription.innerHTML = unProduit.description;
		productDescription.classList.add("productDescription");
		// on crée les éléments et les imbrications des éléments en commencant par le plus profond et en remontant
		article.appendChild(image);
		article.appendChild(productName);
		article.appendChild(productDescription);
		lien.appendChild(article);
		sectionProduit.appendChild(lien);
	});
}

