/*jshint esversion: 6 */

const authBaseUrl="http://127.0.0.1:5000/api/v2";

if(document.getElementById("loginUser")){
	document.getElementById("loginUser").addEventListener("submit", loginUser);
}

function getUserToken(){
	if(localStorage.getItem("token")){
		return `Bearer ${localStorage.getItem("token")}`;
	}else{
		return false;
	}
}

function loginUser(e){
	e.preventDefault();

	const email = document.getElementById("email").value;
	const password = document.getElementById('password').value;

	fetch(`${authBaseUrl}/auth/login`,{
		method:'POST',
		headers:{
		'Access-Control-Allow-Origin':'*',
		'Access-Control-Request-Method': '*',
		'Content-Type': 'application/json'
		},
		body:JSON.stringify({email, password})
	})
	.then((res) => res.json())
	.then((data) => {
		if(data.message == `Logged in as ${email}`){
			localStorage.setItem('token', data.access_token);
			window.location.href='products.html';
		}else{
			throw new Error(data.message);
		}
	})
	.catch((err) => {
		document.getElementById('response').style.color = 'red';
		document.getElementById('response').innerHTML = err.message;
	});

}

if(document.getElementById("logOut")){
	document.getElementById("logOut").addEventListener("click", logOut);
}

function logOut(){
	fetch(`${authBaseUrl}/auth/logout`, {
		method:'DELETE',
		headers:{
			'Access-Control-Allow-Origin':'*',
			'Access-Control-Request-Method': '*',
			'Content-Type': 'application/json',
			'Authorization':getUserToken()
			}

	})
	.then(res => res.json())
	.then(data => {	
		console.log(data);	
		if(data.message == "Successfully logged out"){
			localStorage.removeItem('token');
			window.location.replace('index.html');
	}else{
		throw new Error(data.message);
	}
})
	.catch((err) => {
	document.getElementById('response').style.color = 'red';
	document.getElementById('response').innerHTML = err.message;
	});
}


