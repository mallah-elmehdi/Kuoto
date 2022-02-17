$(document).ready(function () {
  $(function () {
    $('[data-toggle="popover"]').popover();
  });
  if ($("#footer")) {
    var r = 0;
    $.getJSON("/../json/cities.json", function (result) {
      $.each(result, function (i) {
        if (i % 56 === 0) {
          r++;
          $("#list-cities").append(`<div class="col-lg-3 col-md-4 col-sm-6 mb-3"><div id='item-${r}' class="row"></div></div>`);
        }
        $(`#item-${r}`).append(`<div class="col-12"><form action="/" method="post"><input class="d-none" type="text" name="secteur" value="all"><input class="d-none" type="text" name="marque" value="all"><input class="d-none" type="text" name="modele" value="all"><button type="submit" name="ville" value='${JSON.stringify(result[i])}' class="btn btn-sm btn-link text-dark">${result[i].fr}</button></form></div>`);
      });
    });

    var q = 0;
    $.getJSON("/../json/cars.json", function (result) {
      $.each(result, function (i) {
        if (i % 16 === 0) {
          q++;
          $("#list-brands").append(`<div class="col-lg-3 col-md-4 col-sm-6 mb-3"><div id='atem-${q}' class="row"></div></div>`);
        }
        $(`#atem-${q}`).append(`<div class="col-12"><form action="/" method="post"><input class="d-none" type="text" name="secteur" value="all"><input class="d-none" type="text" name="ville" value="all"><input class="d-none" type="text" name="modele" value="all"><button type="submit" name="marque" value='${JSON.stringify(result[i])}' class="btn btn-sm btn-link text-dark">${result[i].fr}</button></form></div>`);
      });
    });
  }

  if ($(".car-card")) {
    const carCard = $(".car-card");
    carCard.mouseover(function () {
      $(this).addClass("shadow");
      carCard.mouseout(function () {
        $(this).removeClass("shadow");
      });
    });
  }

  if ("#copy") {
    var scrollbar = document.getElementsByTagName("body")[0].scrollHeight;

    if (scrollbar < window.innerHeight) $("#copy").addClass("fixed-bottom");
    if (scrollbar >= window.innerHeight) $("#copy").removeClass("fixed-bottom");
  }
});
