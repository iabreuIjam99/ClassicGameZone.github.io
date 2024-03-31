var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  centeredSlides: true,
  loop: true,
  spaceBetween: 30,
  grabCursor: true,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    991: {
      slidesPerView: 3,
    },
  },
});

document.getElementById("randomButton").addEventListener("click", function () {
  var randomNumber = Math.floor(Math.random() * 4);

  switch (randomNumber) {
    case 0:
      window.location.href = "tictactoe/index.html";
      break;
    case 1:
      window.location.href = "ahorcado/index.html";
      break;
    case 2:
      window.location.href = "suma/Index.html";
      break;
    case 3:
      window.location.href = "QUIZ/index.html";
      break;
    default:
      alert("Ocurrió un error al seleccionar el juego.");
  }
});
