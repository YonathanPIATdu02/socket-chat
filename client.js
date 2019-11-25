

let socketClient = io();

let signin = document.forms.namedItem('signin');
signin.addEventListener("submit", (event) => {
  let nickname = signin.elements.namedItem("nickname").value;
  event.preventDefault();
  console.log(nickname);
  socketClient.emit(nickname >signin);
});

