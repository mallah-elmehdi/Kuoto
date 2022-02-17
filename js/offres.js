$(document).ready(function () {
  const checkbox = $("input[type=checkbox]");
  const cars = $(".the-car");
  var carss = $(".the-car:visible");
  const progress = $(".progress");
  const progressBar = $(".progress-bar");
  const HasClimat = $("#has-climat");
  const HasCarburant = $("#has-carburant");
  const HasBoite = $("#has-boite");
  const HasType = $("#has-type");
  const HasBrand = $("#has-brand");
  const HasPrice = $("#has-price-range");
  const resultat = $("#resultat");
  const sorting = $(".sorting");
  const searching = $("#searching");
  const chercher = $("input[name=chercher]");

  // ================================== SEARCHING

  searching.click(function () {
    var a = 0;
    var b = 0;
    if (chercher.val().length) {
      var list = chercher.val().trim().toLowerCase().split(" ");
      while (a < cars.length) {
        var car = cars[a].children[1].children[1].children[0].children[0].children[1].innerText.toLowerCase().split(" ");
        b = 0;
        while (b < list.length) {
          if (!car.includes(list[b])) {
            $(`#${cars[a].id}`).hide();
            break;
          }
          b++;
        }
        if (b === list.length) $(`#${cars[a].id}`).fadeIn();
        a++;
      }
      $("#keywords").empty().append(`<div class='my-1 fn-13 text-secondary'>résultat pour "${chercher.val()}"</div>`);
    } else {
      $("#keywords").empty();
      cars.fadeIn();
    }
    carss = $(".the-car:visible");
    FuncProgress();
    FuncVoid();
  });

  // ================================== SHADOW

  const Dac = function (ele) {
    ele.addClass("list-group-item-primary").removeClass("list-group-item-dark");
  };
  const Drc = function (ele) {
    ele.removeClass("list-group-item-primary").addClass("list-group-item-dark");
  };

  const prix = $("#sort-Prix");
  const porte = $("#sort-Porte");
  const place = $("#sort-Place");

  sorting.click(function () {
    if ($(this).text() === "Prix") {
      if (prix.hasClass("list-group-item-dark")) {
        Dac(prix);
        Drc(porte);
        Drc(place);
        cars.sort(function (a, b) {
          return parseInt(a.children[1].children[1].children[0].children[2].innerText.split(" ")[0]) - parseInt(b.children[1].children[1].children[0].children[2].innerText.split(" ")[0]);
        });
      } else {
        Drc(prix);
        cars.sort(function (a, b) {
          return parseInt(b.children[1].children[1].children[0].children[2].innerText.split(" ")[0]) - parseInt(a.children[1].children[1].children[0].children[2].innerText.split(" ")[0]);
        });
      }
      $("#car-Sorting").html(cars);
    }

    if ($(this).text() === "Porte") {
      if (porte.hasClass("list-group-item-dark")) {
        Dac(porte);
        Drc(place);
        Drc(prix);
        cars.sort(function (a, b) {
          return parseInt(a.children[1].children[1].children[0].children[1].children[1].innerText.split(" ")[0]) - parseInt(b.children[1].children[1].children[0].children[1].children[1].innerText.split(" ")[0]);
        });
      } else {
        Drc(porte);
        cars.sort(function (a, b) {
          return parseInt(b.children[1].children[1].children[0].children[1].children[1].innerText.split(" ")[0]) - parseInt(a.children[1].children[1].children[0].children[1].children[1].innerText.split(" ")[0]);
        });
      }
      $("#car-Sorting").html(cars);
    }

    if ($(this).text() === "Place") {
      if (place.hasClass("list-group-item-dark")) {
        Dac(place);
        Drc(prix);
        Drc(porte);
        cars.sort(function (a, b) {
          return parseInt(a.children[1].children[1].children[0].children[1].children[0].innerText.split(" ")[0]) - parseInt(b.children[1].children[1].children[0].children[1].children[0].innerText.split(" ")[0]);
        });
      } else {
        Drc(place);
        cars.sort(function (a, b) {
          return parseInt(b.children[1].children[1].children[0].children[1].children[0].innerText.split(" ")[0]) - parseInt(a.children[1].children[1].children[0].children[1].children[0].innerText.split(" ")[0]);
        });
      }
      $("#car-Sorting").html(cars);
    }
    FuncProgress();
    FuncVoid();
  });

  // ================================== SHADOW



  const Ac = function (ele) {
    ele.addClass("text-primary").removeClass("text-warning");
  };

  const Rc = function (ele) {
    ele.removeClass("text-primary").addClass("text-warning");
  };

  // ================================== CHECKBOXS

  checkbox.click(function () {
    var climat = [];
    var carburant = [];
    var boite = [];
    var type = [];
    var brand = [];

    Rc(HasClimat);
    Rc(HasCarburant);
    Rc(HasBoite);
    Rc(HasType);
    Rc(HasPrice);
    Rc(HasBrand);

    // =============================== COLLECT ELEMENTS

    for (let s = 0; s < $("input:checked").length; s++) {
      var list = [];
      list = $("input:checked")[s].name.split("-");

      if (list[0] === "climat") climat.push(list[1]) && Ac(HasClimat);
      if (list[0] === "carburant") carburant.push(list[1]) && Ac(HasCarburant);
      if (list[0] === "boite") boite.push(list[1]) && Ac(HasBoite);
      if (list[0] === "type") type.push(list[1]) && Ac(HasType);
      if (list[0] === "brand") brand.push(list[1]) && Ac(HasBrand);
    }

    let i = 0;

    if ($("input:checked").length === 0) {
      carss.fadeIn();
      i = carss.length;
    }

    // ================================== FILTERING

    const FuncCheck = function (list, car) {
      var j = 0;
      if (car === "Auto") car = "Automatique";
      if (!list.length) return true;

      while (j < list.length) {
        if (car === list[j]) return true;
        j++;
      }
      return false;
    };

    while (i < carss.length) {
      var typeVar = carss[i].children[1].children[1].children[0].children[1].children[2].innerText;
      var climatVar = carss[i].children[1].children[1].children[0].children[1].children[3].innerText;
      var boiteVar = carss[i].children[1].children[1].children[0].children[1].children[4].innerText;
      var carburantVar = carss[i].children[1].children[1].children[0].children[1].children[5].innerText;
      var brandVar = carss[i].children[1].children[1].children[0].children[0].children[0].innerText.split("-")[0].trim();
      var prixVar = carss[i].children[1].children[1].children[0].children[2].innerText.split(" ")[0];

      if (FuncCheck(brand, brandVar) && FuncCheck(climat, climatVar) && FuncCheck(carburant, carburantVar) && FuncCheck(boite, boiteVar) && FuncCheck(type, typeVar) && FuncPrice(prixVar)) $(`#${carss[i].id}`).fadeIn();
      else $(`#${carss[i].id}`).hide();

      i++;
    }
    FuncProgress();
    FuncVoid();
  });

  const FuncPrice = function (i) {
    i = i * 1;
    if (i <= $("input[type=range]").val() || i <= $("#maxPriceinput").val()) return true;
    return false;
  };

  $("input[type=range]").on("input", function () {
    var i = 0;
    Ac(HasPrice);
    $("#maxPriceinput").val(`${$(this).val()}`);
    while (i < carss.length) {
      var prixVar = carss[i].children[1].children[1].children[0].children[2].innerText.split(" ")[0];
      if (FuncPrice(prixVar)) $(`#${carss[i].id}`).fadeIn();
      else $(`#${carss[i].id}`).hide();
      i++;
    }
    FuncVoid();
  });

  $("#maxPriceinput").on("input", function () {
    var i = 0;
    Ac(HasPrice);
    $("input[type=range]").val(`${$(this).val()}`);
    while (i < carss.length) {
      var prixVar = carss[i].children[1].children[1].children[0].children[2].innerText.split(" ")[0];
      if (FuncPrice(prixVar)) $(`#${carss[i].id}`).fadeIn();
      else $(`#${carss[i].id}`).hide();
      i++;
    }
    FuncVoid();
  });

  // ================================== PROGRESS LOADING

  const FuncProgress = function () {
    let a = 0;
    progress.fadeIn();
    while (a <= 100) {
      setTimeout(function () {
        progressBar.attr("style", `width : ${a}%`);
      }, 200);
      a++;
    }
    setTimeout(function () {
      progress.hide();
    }, 1000);
  };

  const FuncVoid = function () {
    if (!$(".the-car:visible").length) {
      $("#zero-filter").empty().append('<div class="text-center pb-3 m-auto"><img src="/../graphics/no-res.png" alt="zero favorits" width="80px" /><br/><span class="fn-18">Aucun résultat pour cette demande</span><p class="mt-2 text-secondary">Vous pouvez trouver plus de résultat, cliquez ci-dessous</p><a class="btn btn-warning rounded-0 shadow" href="/">Retour à la page d\'accueil</a></div>');
    } else $("#zero-filter").empty();
    resultat.text($(".the-car:visible").length);
  };


});
