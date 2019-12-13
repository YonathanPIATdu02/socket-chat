
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
  document.querySelector("#chatColumn").classList.toggle('col-12');
  document.querySelector("div#chatColumn").classList.toggle('col-10');
});

let displayNotif = document.querySelector('div#display');
socketClient.on('<notification', pseudoNotification => { 
  divNotif = document.createElement("DIV");
  divNotif.innerHTML = '<span class="text-gray">L\'utilisateur ' + pseudoNotification + '</span>'
  displayNotif.prepend(divNotif);
});

let displayError = document.querySelector("div.toast-error")
socketClient.on('<error', messageErreur => {
  displayError.style.display = 'block';
  displayError.textContent = (messageErreur);
});


let send = document.forms.namedItem('send');
send.addEventListener("submit", (event) => {
  event.preventDefault();
  let message = send.elements.namedItem("message").value;
  socketClient.emit(">message", message);
  send.elements.namedItem("message").value = '';
});

let displayMessage = document.querySelector("div#display");
socketClient.on("<message", message => {
    console.log(message);
    let displayUser = document.createElement("DIV");
    let displayText = document.createElement("DIV");
    let date = new Date();
    let jour = date.toLocaleDateString(undefined,{ hour12 : true, day: '2-digit', month: '2-digit' , year: 'numeric',  hour: '2-digit', minute: '2-digit' , second: '2-digit'});
    displayUser.innerHTML = `<span class="label label-rounded label-primary">${message.sender}</span>` + `<span class="text-gray"> ${jour}</span>`;
    displayText.innerHTML = `<span> ${message.text}</span>`;
    displayMessage.prepend(displayText);
    displayMessage.prepend(displayUser);
});

let displayUsersNumber = document.querySelector("#usersNumber");
let displayUsersList = document.querySelector("#usersList");
socketClient.on('<users', users => {
  console.log(users.length);
  displayUsersNumber.innerHTML = users.length + " " + ((users.length > 1) ? "users connected" : "user connected");
  let usersList = "";
  users.forEach(user => {
     usersList += `<tr><td>${user}</td></tr>`;
  });
  displayUsersList.innerHTML = usersList;
});