

let socketClient = io();

let signin = document.forms.namedItem('signin');
signin.addEventListener("submit", (event) => {
  event.preventDefault();
  let nickname = signin.elements.namedItem("nickname").value;
  console.log(nickname);
  socketClient.emit(">signin", nickname);
});

socketClient.on('<connected', pseudo => {
  console.log(pseudo);
})
