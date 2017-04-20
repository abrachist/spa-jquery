var $ = require('jquery');

$(function(){

	// GET DATA FROM SERVER
	$("body").on("click", "#get-data", function() {
		var token = localStorage.getItem("token");
		$.ajax({
			url: "http://apidev.app/api/lesson",
			contentType: "application/json",
        	headers: {
        		'Authorization':'Bearer '+token,
		        'X-Requested-With':'XMLHttpRequest',
		    },
			success: function(response) {

				var theadElem = $("thead");
				theadElem.html('');

				var tbodyElem = $("tbody");
				tbodyElem.html('');

				theadElem.append('<tr>'+
									'<th>No</th>'+
									'<th>Title</th>'+
									'<th>Body</th>'+
									'<th>Action</th>'+
								'</tr>');

				response.data.forEach(function(item,index) {
					index++;
					tbodyElem.append('<tr>' +
							'<td id="'+item.id+'" class="id">'+ index +'</td>'+
							'<td><input type="text" class="art-title" value="'+ item.title +'"></input></td>'+
							'<td><input type="text" class="art-body" value="'+ item.body +'"></input></td>'+
							'<td>'+
								'<button class="update-data">Update</button>'+
							    '<button class="delete-data">Delete</button>'+
							'</td>'+
						'</tr>');
				});
			},
			error: function(err) {
				localStorage.removeItem("token");
				getAuth();
			}
		});
	});

	// SHOW CREATE FORM 
	$("body").on("click", "#show-create-form", function() {
		$("#create").html('<form id="create-form">'+
			'<input type="text" id="article-title" placeholder="title"></input>&nbsp;'+
			'<input type="text" id="article-body" placeholder="content"></input>&nbsp;'+
			'<button>Create</button>'+
		'</form><br><br><hr>');
	});

	// SUBMIT CREATE DATA TO SERVER
	$("body").on("submit", "#create-form", function(event) {
		event.preventDefault();
		var token = localStorage.getItem("token");

		var title = $("#article-title");
		var body = $("#article-body");

		$.ajax({
			url: "http://apidev.app/api/lesson",
			method: "post",
			contentType: "application/json",
        	headers: {
        		'Authorization':'Bearer '+token,
		        'X-Requested-With':'XMLHttpRequest',
		    },
			data: JSON.stringify({title: title.val(), body: body.val()}),
			success: function(response) {
				console.log(response);
				title.val('');
				body.val('');
				$("#get-data").click();
			},
			error: function(err) {
				localStorage.removeItem("token");
				getAuth();
			}
		});
	});

	// UPDATE DATA ON SERVER
	$("table").on("click",".update-data", function() {
		var token = localStorage.getItem("token");
		var rowElem = $(this).closest("tr");
		var id = rowElem.find(".id").attr('id');
		var title = rowElem.find(".art-title").val();
		var body = rowElem.find(".art-body").val();

		$.ajax({
			url: "http://apidev.app/api/lesson/" + id,
			method: "put",
			contentType: "application/json",
        	headers: {
        		'Authorization':'Bearer '+token,
		        'X-Requested-With':'XMLHttpRequest',
		    },
			data: JSON.stringify({ title: title, body: body }),
			success: function(response) {
				console.log(response);
				$("#get-data").click();
			},
			error: function(err) {
				localStorage.removeItem("token");
				getAuth();
			}
		});
	});

	// DELETE DATA ON SERVER
	$("table").on("click",".delete-data", function() {
		var token = localStorage.getItem("token");
		var rowElem = $(this).closest("tr");
		var id = rowElem.find(".id").attr('id');

		$.ajax({
			url: "http://apidev.app/api/lesson/" + id,
			method: "delete",
			contentType: "application/json",
        	headers: {
        		'Authorization':'Bearer '+token,
		        'X-Requested-With':'XMLHttpRequest',
		    },
			success: function(response) {
				console.log(response);
				$("#get-data").click();
			},
			error: function(err) {
				localStorage.removeItem("token");
				getAuth();
			}
		});
	});

	checkAuth();

	//AUTHENTICATION CHECK
	function checkAuth() {
		if (typeof(Storage) !== "undefined") {
			var token = localStorage.getItem("token");
			if(token != null){
		        $.ajax({
	            	url: "http://apidev.app/credential",
	            	method: "get",
	            	headers: {
	            		'Authorization':'Bearer '+token,
				        'X-Requested-With':'XMLHttpRequest',
				    },
	            	success: function(response) {
	            		if(response == null){
	            			getAuth();
	            		}

	            		var strToken = "'token'";

	            		$("#menu").html('<button id="get-data"> Get Data</button>'+
    			            			' <button id="show-create-form"> Create Data</button> &nbsp;&nbsp;&nbsp;'+
    			            			' <button onClick="localStorage.removeItem('+ strToken +');"> Logout</button> <br><br><hr>');
	            	},
	            	error: function(err) {
	            		if(err.status == 401 ) {
	            			alert("Not Authenticated");
	            		}
	            		localStorage.removeItem("token");
	            		getAuth();
	            	}
	            });
			} else {
				getAuth();
			}
	        	        
		} else {
		    alert("Sorry! No Web Storage support..");
		}	    
	}

	//GET AUTHENTICATION TOKEN OR LOGIN
	function getAuth() {
		if (typeof(Storage) !== "undefined") {
		    user = prompt("Please enter your name:", "");
	        password = prompt("Please enter your password:", "");

	        if (user != "" && user != null && password != "" && password != null) {
	        	var data = {"email": user, "password": password };

	            $.ajax({
	            	url: "http://apidev.app/credential/signin",
	            	method: "post",
	            	headers: {
				        'X-Requested-With':'XMLHttpRequest',
				        'Content-Type':'application/json'
				    },
				    data:JSON.stringify(data),
	            	success: function(response) {
	            		localStorage.setItem("token",response.token);

	            		var strToken = "'token'";

	            		$("#menu").html('<button id="get-data"> Get Data</button>'+
	            			' <button id="show-create-form"> Create Data</button> &nbsp;&nbsp;&nbsp;'+
	            			' <button onClick="localStorage.removeItem('+ strToken +');"> Logout</button> <br><br><hr>');
	            	},
	            	error: function(err) {
	            		if(err.status == 422 ) {
	            			alert("Wrong credential");
	            		}
	            		getAuth();
	            	}
	            });	        
	        } else {
		    	alert("Please insert username and password..");
			}
		} else {
		    alert("Sorry! No Web Storage support..");
		}	    
	}

	
});
