/*jshint esversion: 6 */

const baseUrl="http://127.0.0.1:5000/api/v2";

document.getElementById("loginUser").addEventListener("submit", loginUser);

function loginUser(e){
	e.preventDefault();

	let email = document.getElementById("email").value;
	let password = document.getElementById('password').value;

	fetch(`${baseUrl}/auth/login`,{
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