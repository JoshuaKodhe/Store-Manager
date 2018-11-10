/*jshint esversion: 6 */

const baseUrl="http://127.0.0.1:5000/api/v2";

function retrieveUserToken(){
	if(localStorage.getItem("token")){
		return `Bearer ${localStorage.getItem("token")}`;
	}else{
		return false;
	}
}


const products = document.getElementById('productsTable');
const admin = document.getElementById('admin');

fetch(`${baseUrl}/products`, {
	method:'GET',
	headers:{
	'Access-Control-Allow-Origin':'*',
	'Access-Control-Request-Method':'*',
	'Content-Type':'application/json',
	'Authorization':retrieveUserToken()
	},
})
.then(res => res.json())
.then(data => {
	if(data.products.products == "No products live here currently"){
		document.getElementById('response').style.color = 'red';
		document.getElementById('response').innerHTML = data.products.products;
	}else if(data.products.length > 0){
		if (data.role = "admin"){
			data.products.forEach(product => {
				products.innerHTML +=`<tr>
				<td><a href="product-details.html?id=${product.id}">${product.name}</a></td>
				<td>Ksh ${product.price}</td>
				<td>${product.category}</td>
				<td>${product.quantity}</td>
				<td>-</td>
				<td>
				  <span class="text-heavy">Quantity:</span>
				  <input type="number" name="quantity" min="1" />
				  <a href="shopping-cart.html"><button name="button" class="btn btn-success">Add to cart</button></a>
				</td>
			  </tr>`;
			});
			admin.innerHTML+=`<hr>
			<a href="new-product-form.html"><button name="button" class="btn btn-success">Add product</button></a>`;
		}else{
			data.products.forEach(product => {
				products.innerHTML +=`<tr>
				<td><a href="product-details.html?id=${product.id}">${product.name}</a></td>
				<td>Ksh ${product.price}</td>
				<td>${product.category}</td>
				<td>${product.quantity}</td>
				<td>-</td>
				<td>
				  <span class="text-heavy">Quantity:</span>
				  <input type="number" name="quantity" min="1" />
				  <a href="shopping-cart.html"><button name="button" class="btn btn-success">Add to cart</button></a>
				</td>
			  </tr>`;
			});
		}
	}else{
		throw new Error(data.message);
	}
})
.catch((err) => {
	window.location.replace("index.html");
	document.getElementById('response').innerHTML = err.message;
});