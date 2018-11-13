/*jshint esversion: 6 */

const baseUrl="http://127.0.0.1:5000/api/v2";

function retrieveUserToken(){
	if(localStorage.getItem("token")){
		return `Bearer ${localStorage.getItem("token")}`;
	}else{
		return false;
	}
}

function checkAccessTokenStatus(){
	accessToken = localStorage.getItem("token");
	if(!accessToken){
		document.getElementsByClassName("main").innerHTML=`<div class="login">
		<h1 class="login-heading">Login</h1>
		<div id="response"></div>
        <form id="loginUser">
          <p><input type="text" class="form-control" id="email" name="login" placeholder="Email"></p>
          <p><input type="password" id="password" class="form-control" name="password" placeholder="Password"></p>
          <p class="remember-me">
            <label id="remember-me">
              <input type="checkbox" name="remember-me">
              Remember me
            </label>
		  </p>
		  <input type="submit" value="submit" class="btn btn-success btn-large btn-long">
		</form>
      </div>`;
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
				<a href="new-product-form.html"><button name="button" class="btn btn-success">Add product</button></a>`;
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


if(window.location.href.includes("new-product-form.html")){
	document.getElementById("addProduct").addEventListener("submit", addProduct);
}

function addProduct(e){
	e.preventDefault();
	const name = document.getElementById("productName").value;
	const price = parseFloat(document.getElementById("productPrice").value);
	const quantity = parseInt(document.getElementById("productQuantity").value);
	const description = document.getElementById("productDescription").value;
	const category = document.getElementById("productCategory").value;

	console.log(JSON.stringify({name, price, quantity, description, category}));

	fetch(`${baseUrl}/products`, {
		method:'POST',
		headers:{
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Request-Method':'*',
		'Content-Type':'application/json',
		'Authorization':retrieveUserToken()	
		},
		body:JSON.stringify({name, price, quantity, description, category})
	})
	.then(res => res.json())
	.then(data =>
		{ console.log(data);
			if(data.message == "Successfully added"){
				console.log(data.product);
			}else if(data.msg){
				throw new Error(data.msg);
			}else{
				throw new Error(data.message);
			}
		})
	.catch(err => {
		console.log(err);
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
	checkAccessTokenStatus();
	getProducts();
}

if(window.location.href.includes("product-details.html")){ 		
	checkAccessTokenStatus();		
	getSingleProduct();
}
