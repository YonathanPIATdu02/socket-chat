

let socketClient = io();

let signin = document.forms.namedItem('signin');
signin.addEventListener("submit", (event) => {
  event.preventDefault();
  let nickname = signin.elements.namedItem("nickname").value;
  socketClient.emit(">signin", nickname);
});

socketClient.on('<connected', pseudo => {
  signin.style.display = 'none';

  send.style.display = 'block';
  document.querySelector('span').textContent = pseudo;
  displayError.style.display = 'none';
});

let displayNotif = document.querySelector('div#display');
socketClient.on('<notification', pseudoNotification => { 
  displayNotif.append( 'L\'utilisateur ' + pseudoNotification + ' est connecté ');
});

let displayError = document.querySelector("div.toast-error")
socketClient.on('<error', messageErreur => {
  displayError.style.display = 'block';
  displayError.textContent = (messageErreur);
})


let send = document.forms.namedItem('send');
send.addEventListener("submit", (event) => {
  event.preventDefault();
  let message = send.elements.namedItem("message").value;
  socketClient.emit(">message", message);
  send.elements.namedItem("message").value = '';
});