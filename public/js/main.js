(function (){
	var id = ['info', 'rule', 'form'];
	var about_btn = document.getElementById('info-btn');
	var rule_btn = document.getElementById('rule-btn');
	var reg_btn = document.getElementById('form-btn');
	function change_button(button_id){
		for(var i = 0; i < id.length; i++)
			document.getElementById(id[i] + '-btn').style.backgroundColor = 'transparent';
		document.getElementById(button_id).style.backgroundColor = '#fff';
	}
	about_btn.addEventListener('click', function (){
		for(var i = 0; i < id.length; i++)
			document.getElementById(id[i]).style.display = 'none';
		document.getElementById(id[0]).style.display = 'block';
		change_button('info-btn');
	});
	rule_btn.addEventListener('click', function (){		
		for(var i = 0; i < id.length; i++)
			document.getElementById(id[i]).style.display = 'none';
		document.getElementById(id[1]).style.display = 'block';
		change_button('rule-btn');		
	});
	reg_btn.addEventListener('click', function (){
		for(var i = 0; i < id.length; i++)
			document.getElementById(id[i]).style.display = 'none';
		document.getElementById(id[2]).style.display = 'block';
		change_button('form-btn');
	});
	var submit = document.getElementById('form-submit');
	submit.addEventListener('click', function (){
		var flag = 1;
		var ids = ['teamname', 'member1_name', 'member1_ph', 'member2_name', 'member2_ph','year'];
		var values = [];
		for(var i = 0; i < ids.length; i++){
			values = values.concat(document.getElementById(ids[i]).value);
			values[i] = values[i].trim();
			values[i] = html_sanitize(values[i]);
		}
		if(values[2].length < 10 || isNaN(values[2])){
			document.getElementById(ids[2]).style.borderColor = 'Red';
			document.getElementById(ids[2]).style.borderRadius = '4px';
			flag = 0;
		}
		if(values[4].length < 10 || isNaN(values[4])){
			document.getElementById(ids[4]).style.borderColor = 'Red';
			document.getElementById(ids[4]).style.borderRadius = '4px';
			flag = 0;
		}
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST","/team_details", false);
		var	details = "teamname=" + values[0];
		for(var i = 1; i < 6; i++){
			details += "&" + ids[i] + "=" + values[i];
		}
		xmlhttp.onreadystatechange=function(){
        	if (xmlhttp.readyState==4 && xmlhttp.status==200){        		
        		 document.getElementById(id[2]).innerHTML = xmlhttp.responseText;    	
   			}
   		}
		xmlhttp.send(details);
	});
})()
