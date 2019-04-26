class Login extends HTMLFormElement
{
	// Set up all the functionality of a form element, and then make sure that we control how the form is submitted.
	constructor()
	{
		super();
		this.onsubmit = (event) => {event.preventDefault(); this.submit();}
	}

	submit()
	{

		// Get the data that the user has entered.
		var data = {
			username:this.elements['username'].value,
			password:this.elements['password'].value,
			type:this.querySelector('input[name="option"]:checked').value
		}

		// Check data against regular expressions.
		var errormsg= `Username and password must be between 6 and 15 characters and only contain numbers and letters.
		Passwords must have at least 1 number and 1 letter.
		`;

		// Username and password must only have alphanumerical values.
		if(/[^\w]/.test(data.username) || /[^\w]/.test(data.password)){
			alert(errormsg);
			return;
		}

		// Passwords must have at least one number and at least one letter..
		if((/\d/.test(data.password)==false) || (/[A-Za-z]/.test(data.password)==false) ){
			alert(errormsg);
			return;
		}

		// The user's input is valid so make a http post request to validate their login details / create their account.
		httpRequest('post',data, function(response){
			// This code will execute if the request is a success. HTTP Status code 200.
			// Give the user the option to logout.
			login.innerHTML="<button onclick='window.location.reload()'>Logout</button>";
			// Give the user the message attached to the response.
			alert(response);
			// The user details are valid so let the user enter the game.
			game.lobby(data.username);
		});
	}
	}
