var input = document.getElementById('inputChangeBg');
var lockscreen = document.getElementsByClassName('lockscreen')[0]

var background = document.getElementById('background');

var loginPrompt = document.getElementById('login-container');

var passInput = document.getElementById('password')
var submitButton = document.getElementById('submit-login')

$('#password')[0].value = ''
$('#username')[0].value = ''
// var time = new Date();

var lockscreenActive = true;

//slidable lockscreen
var mouseStart = 0
var mousePos = (0,0)
var mouseDown = false

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
	return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

var loadingFunc

function attemptLogin() {
	$('.vanish-on-load').each(function(index,elem) {
		elem.style.display = 'none'
	})

	$('#sign-in-loading')[0].style.display = 'flex'
	
	var randomTimeout = Math.floor((Math.random() * 5000) + 3000)
	console.log(randomTimeout)

	setTimeout(function() {
		$('#sign-in-loading')[0].style.display = 'none'
		$('#incorrect-password')[0].style.display = 'grid'
	}, randomTimeout)
}

function resetLogin() {
	$('#incorrect-password')[0].style.display = 'none'

	$('.vanish-on-load').each(function(index,elem) {
		elem.style.display = ''
	})

	$('#password')[0].value = ''
}

function openLogin() {
	passInput.value = ''
	
	submitButton.style.borderColor = ''

	mouseStart = 0
	mousePos = (0,0)
	mouseDown = false
	
	lockscreenActive = false

	lockscreen.classList.add('lockscreen-animate')
	lockscreen.style.bottom = '100vh';
	lockscreen.style.opacity = '0';
	background.style.filter = 'brightness(60%) blur(10px)'
	background.style.transform = 'scale(1.07)'

	loginPrompt.style.opacity = 1;

	setTimeout(function() {
		$('#username')[0].focus()
		$('#username')[0].value = ''
	},100)

	setTimeout(function() {
		lockscreen.offsetHeight;
		lockscreen.classList.remove('lockscreen-animate')
	},500)
}

function exitLogin() {
	mouseStart = 0
	mousePos = (0,0)
	mouseDown = false

	lockscreenActive = true

	

	lockscreen.classList.add('lockscreen-animate')
	lockscreen.style.bottom = '0';
	lockscreen.style.opacity = '1';
	background.style.filter = 'brightness(100%)'
	background.style.transform = 'scale(1.05)'

	loginPrompt.style.opacity = 0;
}

lockscreen.addEventListener('transitionend',function() {
	lockscreen.offsetHeight;
	lockscreen.classList.remove('lockscreen-animate')
})

document.onkeydown = function (e) {
	if (lockscreenActive == true && e.keyCode == 32) {
		openLogin()
	} else if (lockscreenActive == false && e.keyCode == 27) {
		exitLogin()
	}
	// console.log(lockscreenActive)
}




var lockscreen_image = document.getElementById('lockscreen-image')
document.onmousedown = function (e) {
	if (lockscreenActive) {
		mouseStart = e.clientY
		mouseDown = true

	}
}

//when onmouseup, check if mouse exceeds threshold, if not
//return to normal
document.onmouseup = function (e) {
	if (lockscreenActive) {
		if ((mouseStart-mousePos) < 10) {
			openLogin()
		}
		mouseDown = false
		mouseStart = e.clientY
		
		lockscreen.classList.add('lockscreen-animate')
		if (parseInt(lockscreen.style.bottom.replace('vh')) > 40) {
			openLogin()
		} else {
			exitLogin()
		}
	}
}

document.onkeydown = function (e) {
	if (lockscreenActive) {
		openLogin()
	}
}

//when mouse is moved, move the lockscreen if mouse is down
//if the distance passes a certain threshold, automatically open
document.onmousemove = function (e) {
	if (lockscreenActive) {
		mousePos = e.clientY
		if (parseInt(lockscreen.style.bottom.replace('vh')) > 40 && mouseDown) {
			openLogin()
		} else if (mouseDown) {
			var val = Math.max(Math.min(mouseStart - mousePos,10000000),1)
			lockscreen.style.bottom = (val/11) + 'vh';
			lockscreen.style.opacity = val.map(500,0,0,1)
		}
	}
}

setInterval(function() {
	if (mouseDown) {
		lockscreen.style.bottom = mouseStart[1] - mousePos[1] + 'vh';
	} 
},25)

function getOrdinalNum(dom) {
    if (dom == 31 || dom == 21 || dom == 1) return dom + "st";
    else if (dom == 22 || dom == 2) return dom + "nd";
    else if (dom == 23 || dom == 3) return dom + "rd";
    else return dom + "th";
};

// update time on lockscreen
var textElements = document.getElementById('lockscreen-text')
function updateTime() {
	textElements.childNodes.forEach(element => {
		var time = new Date()
		
		if (time.getMinutes().toString().length == 1 ) { var minutes = '0' + time.getMinutes() }
		else { var minutes = time.getMinutes() } 

		if (element.id == 'lockscreen-minutes') {
			let hours = time.getHours()
			if (( hours % 12) == 0) {	hours = 12} 
			else {hours = hours % 12}
	
			element.innerHTML =  hours + ':' + minutes
		} else {
			element.innerHTML = time.toLocaleDateString('default', { weekday: 'long' })   + ', ' + time.toLocaleString('default', { month: 'long' }) + ' ' + getOrdinalNum(time.getDate())
		}
		
	})
}
updateTime()
setInterval(updateTime,1000)


function callInput() {
	input.click();
	document.activeElement.blur()
}

function changeBackground() {
	bg = document.getElementsByClassName('lockscreen')[0]
	
	console.log(bg)
	
	var reader = new FileReader();
	reader.readAsDataURL(input.files[0]); // this is reading as data url

	// here we tell the reader what to do when it's done reading...
	reader.onload = readerEvent => {
		var content = readerEvent.target.result; // this is the content!
		bg.style.backgroundImage = 'url('+ content +')';
	}
}


// when submit button is hovered, add outline to password
submitButton.onmouseenter = function() {
	passInput.classList.add('forceHover')
}
submitButton.onmouseleave = function() {
	passInput.classList.remove('forceHover')
}

// when input is in focus, add outline to submit button
passInput.onfocus = function() {
	// submitButton.classList.add('forceHover')

	if ($('#password')[0].value == '') {
		$('#show-password')[0].classList.add('hide')
	} else {
		$('#show-password')[0].classList.remove('hide')
	}
}

// when input looses focus, remove outline to submit button
passInput.addEventListener('focusout', function() {
	// submitButton.classList.remove('forceHover')
})

// when input is hovered, add outline to submit button
passInput.onmouseenter = function() {
	submitButton.classList.add('forceHover')
}
passInput.onmouseleave = function() {
	if (passInput != document.activeElement) {
		submitButton.classList.remove('forceHover')
	} else {
		submitButton.classList.remove('forceHover')
		submitButton.classList.remove('forceFocus')
	}
}

$('#show-password')[0].onmouseenter = function() {
	submitButton.classList.add('forceHover')
	passInput.classList.add('forceHover')
}
$('#show-password')[0].onmouseleave = function() {
	submitButton.classList.remove('forceHover')
	passInput.classList.remove('forceHover')
}

$('#password')[0].addEventListener('input', function () {
	if ($('#password')[0].value == '') {
		$('#show-password')[0].classList.add('hide')
	} else {
		$('#show-password')[0].classList.remove('hide')
	}
})
$('#show-password')[0].addEventListener('mousedown', function () {
	passInput.style.backgroundColor = '#fff';
	passInput.style.color = '#313131';
	passInput.style.borderColor = '#9f9f9f';
	
	// submitButton.style.borderColor = '#fff'
	

	passInput.type = 'text'
})

$('#show-password')[0].addEventListener('mouseup', function () {
	passInput.focus()
	passInput.type = 'password'
	
	// submitButton.style.borderColor = ''

	passInput.style.backgroundColor = '';
	passInput.style.color = '';
	passInput.style.borderColor = '';
})

function submitDetails() {
	if ($('#username')[0].value != '' && $('#password')[0].value != '') {
		console.log('something')
		attemptLogin()
	} else {
		console.log('nothing')
	}
}

