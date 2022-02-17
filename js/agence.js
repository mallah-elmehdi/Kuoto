$(document).ready(function () {
  const listText = $(".list-text");
  const carCard = $(".car-card");

  if ($(window).width() >= 500) {
    listText.show();
  } else {
    listText.hide();
  }
  
  carCard.mouseover(function () {
    $(this).addClass("shadow");
    carCard.mouseout(function () {
      $(this).removeClass("shadow");
    });
  });
});
