/*jshint esversion: 6 */

const baseUrl="http://127.0.0.1:5000/api/v2";

function retrieveUserToken(){
	if(localStorage.getItem("token")){
		return `Bearer ${localStorage.getItem("token")}`;
	}else{
		return false;
	}
}

function getProducts(){
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
			if (data.role == "admin"){
				data.products.forEach(product => {
					products.innerHTML +=`<tr>
					<td><a id="productDetails" href="product-details.html?id=${product.id}">${product.name}</a></td>
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
				<a href="new-product-form.html"><button name="button" class="btn btn-success" id="addProduct">Add product</button></a>`;
			}else{
				data.products.forEach(product => {
					products.innerHTML +=`<tr>
					<td><a id="productDetails" href="product-details.html?id=${product.id}"><span>${product.name}</span></a></td>
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
		document.getElementById('response').innerHTML = err.message;
		window.setTimeout(function(){window.location.replace("index.html");}, 2000);
	});
}


function getSingleProduct(){
	const product = document.getElementById('productDetails');
	const admin = document.getElementById('admin');
	const productId = new URLSearchParams(window.location.search).get("id");
	fetch(`${baseUrl}/products/${productId}`, {
		method:'GET',
		headers:{
			'Access-Control-Allow-Origin':'*',
			'Access-Control-Request-Method':'*',
			'Content-Type':'application/json',
			'Authorization':retrieveUserToken()
		}
	})
	.then(res => res.json())
	.then(data => {
		console.log(data);
		const productInfo = data.product;
	
		if(data.message == "Retrieved successfully"){
			if(data.role == "admin"){
				product.innerHTML += `
				<p><span class="text-heavy">Product Name : </span>${productInfo.name}</p>
				<p><span class="text-heavy">Category : </span>${productInfo.category}</p>
				<p><span class="text-heavy">Price : Ksh</span> ${productInfo.price} </p>
				<p><span class="text-heavy">Quantity : </span>${productInfo.quantity} </p>
				<p><span class="text-heavy">Description : </span> </p>
				<p class="text-justified-align">
				  ${productInfo.description}
				</p>`;
				admin.innerHTML +=`<hr>
				<a href="new-product-form.html"><button name="button" class="btn btn-warning">Update</button></a>
				<a href="products.html"><button name="button" class="btn btn-danger"> Delete</button></a>`;
			}else{
				product.innerHTML += `
				<p><span class="text-heavy">Product Name : </span>${productInfo.name}</p>
				<p><span class="text-heavy">Category : </span>${productInfo.category}</p>
				<p><span class="text-heavy">Price : Ksh</span> ${productInfo.price} </p>
				<p><span class="text-heavy">Quantity : </span>${productInfo.quantity} </p>
				<p><span class="text-heavy">Description : </span> </p>
				<p class="text-justified-align">
				  ${productInfo.description}
				</p>`;	
			}
		}else if(data.msg){
			throw new Error(data.msg);
		}else{
			throw new Error(data.message);
		}
	})
	.catch(err => {
		console.log(err.message);
		if(err.message =="Token has expired"){
			document.getElementById('response').style.color = 'red';
			document.getElementById('response').innerHTML = "Session timed out please login";
			window.setTimeout(function(){window.location.replace("index.html");}, 2000);	
		}else{
			document.getElementById('response').style.color = 'red';
			document.getElementById('response').innerHTML = err.message;
		}
	
	});
}

if(window.location.href.includes("products.html")){
	getProducts();
}else if(window.location.href.includes("product-details.html")){ 				
	getSingleProduct();
}