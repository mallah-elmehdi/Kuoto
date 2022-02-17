$(document).ready(function () {
  const brand = $("#brands");
  const modele = $("#modele");
  const ville = $("#ville");
  const secteur = $("#secteur");
  const max = $("#max");
  const min = $("#min");

  const progress = $(".progress");
  const progressBar = $(".progress-bar");

  const HasClimat = $("#has-climat");
  const HasCarburant = $("#has-carburant");
  const HasBoite = $("#has-boite");
  const HasType = $("#has-type");
  const HasBrand = $("#has-brand");
  const HasPrice = $("#has-price-range");

  const checkbox = $("input[type=checkbox]");

  // ===================================================

  const Ac = function (ele) {
    ele.addClass("text-primary").removeClass("text-warning");
  };

  const Rc = function (ele) {
    ele.removeClass("text-primary").addClass("text-warning");
  };

  const FuncProgress = function () {
    let a = 0;
    progress.fadeIn();
    while (a <= 90) {
      setTimeout(function () {
        progressBar.attr("style", `width : ${a}%`);
      }, 500);
      a++;
    }
  };
  
  $("form").submit(function() {
      FuncProgress();
  })

  // ======================================= MODEL - BRAND

  for (let s = 0; s < $("input:checked").length; s++) {
    var list = [];
    list = $("input:checked")[s].name.split("-");

    if (list[0] === "climat") Ac(HasClimat);
    if (list[0] === "carburant") Ac(HasCarburant);
    if (list[0] === "boite") Ac(HasBoite);
    if (list[0] === "type") Ac(HasType);
    if (list[0] === "marque") Ac(HasBrand);
  }
  // ======================================= MODEL - BRAND

  brand.change(function () {
    modele.empty().append("<option value='all'>Tous les modèles</option>");

    if ($(this).val() != "all") {
      $.getJSON(`/../json/models/${JSON.parse($(this).val()).id}.json`, function (result) {
        $.each(result, function (i) {
          modele.append(`<option value='${JSON.stringify(result[i])}'>${result[i].fr}</option>`);
        });
      });
    }
  });

  // ======================================= CITY - SECTEUR

  ville.change(function () {
    secteur.empty().append("<option value='all'>Tous les secteurs</option>");

    if ($(this).val() != "all" && JSON.parse($(this).val()).id) {
      $.getJSON(`/../json/city/${JSON.parse($(this).val()).id}.json`, function (result) {
        $.each(result, function (i) {
          secteur.append(`<option value='${JSON.stringify(result[i])}'>${result[i].fr}</option>`);
        });
      });
    }
  });

  checkbox.click(function () {
    Rc(HasClimat);
    Rc(HasCarburant);
    Rc(HasBoite);
    Rc(HasType);
    Rc(HasBrand);

    // =============================== COLLECT ELEMENTS

    for (let s = 0; s < $("input:checked").length; s++) {
      var list = [];
      list = $("input:checked")[s].name.split("-");

      if (list[0] === "climat") Ac(HasClimat);
      if (list[0] === "carburant") Ac(HasCarburant);
      if (list[0] === "boite") Ac(HasBoite);
      if (list[0] === "type") Ac(HasType);
      if (list[0] === "marque") Ac(HasBrand);
    }
  });

  max.change(function () {
    Ac(HasPrice);
  });
  min.change(function () {
    Ac(HasPrice);
  });
});
