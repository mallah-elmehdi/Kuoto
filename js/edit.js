$(document).ready(function () {
  // ======================================= EMAIL CHECKING

  function validatePrice(password) {
    const re = /^[0-9]+$/;
    return re.test(password);
  }

  const ivld = "is-invalid";
  const marque = $("#marque");
  const model = $("#model");
  const carburant = $("#carburant");
  const porte = $("#porte");
  const place = $("#place");
  const boite = $("#boite");
  const climat = $("#climat");
  const price = $("#price");
  const addPics = $("#addPics");
  const prePics = $("#preview-pics");
  const preContent = $("#preview-content");
  const remove = $("#remove");
  const carType = $(".car-type");
  const carTypes = $("#car-types");
  const type = $("#type");
  const priceDiscount = $("#priceDiscount");

  // =========== TYPES

  carType.click(function () {
    carTypes.get(0).innerText = $(this).get(0).innerText;
    type.attr("value", $(this).get(0).innerText);
    document.getElementById("type").setCustomValidity("");
    carTypes.removeClass(ivld);
  });
  
  // =========== ON SUBMIT
  $("#add-car").click(function () {
    if (!marque.val()) {
      document.getElementById("marque").setCustomValidity("ce champ est obligatoire");
      marque.addClass(ivld);
    }

    if (!model.val()) {
      document.getElementById("model").setCustomValidity("ce champ est obligatoire");
      model.addClass(ivld);
    }

    if (!carburant.val()) {
      document.getElementById("carburant").setCustomValidity("ce champ est obligatoire");
      carburant.addClass(ivld);
    }

    if (!porte.val()) {
      document.getElementById("porte").setCustomValidity("ce champ est obligatoire");
      porte.addClass(ivld);
    }
    if (!place.val()) {
      document.getElementById("place").setCustomValidity("ce champ est obligatoire");
      place.addClass(ivld);
    }

    if (!boite.val()) {
      document.getElementById("boite").setCustomValidity("ce champ est obligatoire");
      boite.addClass(ivld);
    }

    if (!climat.val()) {
      document.getElementById("climat").setCustomValidity("ce champ est obligatoire");
      climat.addClass(ivld);
    }

    if (!price.val()) {
      document.getElementById("price").setCustomValidity("ce champ est obligatoire");
      price.addClass(ivld);
    }

  });

  // =========== ON TYPING

  marque.change(function () {
    document.getElementById("marque").setCustomValidity("");
    marque.removeClass(ivld);

    model.empty().append("<option value='' selected disabled>Le modèle de voiture</option>");

    $.getJSON(`/../json/models/${JSON.parse($(this).val()).id}.json`, function (result) {
      $.each(result, function (i) {
        model.append(`<option value='${JSON.stringify(result[i])}'>${result[i].fr}</option>`);
      });
    });
  });

  model.change(function () {
    document.getElementById("model").setCustomValidity("");
    model.removeClass(ivld);
  });

  carburant.change(function () {
    document.getElementById("carburant").setCustomValidity("");
    carburant.removeClass(ivld);
  });

  porte.change(function () {
    document.getElementById("porte").setCustomValidity("");
    porte.removeClass(ivld);
  });

  place.change(function () {
    document.getElementById("place").setCustomValidity("");
    place.removeClass(ivld);
  });

  boite.change(function () {
    document.getElementById("boite").setCustomValidity("");
    boite.removeClass(ivld);
  });

  climat.change(function () {
    document.getElementById("climat").setCustomValidity("");
    climat.removeClass(ivld);
  });

  price.keyup(function () {
    if (!validatePrice(price.val()) || price.val() * 1 > 30000 || price.val().length > 8) bad();
    else good();
  });
  
  priceDiscount.change(function () {
    FunDiscount();
  });

  function bad() {
    $("#new-price").text("0 Dh");
    $("#old-price").hide();
    priceDiscount.attr("disabled", true);
    document.getElementById("price").setCustomValidity("certains caractères ne sont pas autorisés");
    price.addClass(ivld);
  }

  function good() {
    $("#new-price").text(price.val() + " Dhs");
    priceDiscount.removeAttr("disabled");
    document.getElementById("price").setCustomValidity("");
    price.removeClass(ivld);

    if (priceDiscount.val()) FunDiscount();
  }

  function FunDiscount() {
    $("#new-price").text(Prix(price.val(), priceDiscount.val()) + " Dhs");
    $("#old-price").show().text(price.val() + " Dhs");
  }

  function Prix(prix, discount) {
    var FinalPrice = prix * 1 - (prix * 1 * discount * 1) / 100;
    return parseInt(FinalPrice);
  }

  addPics.change(function (e) {

    preContent.empty();

    prePics.show();
    const files = e.target.files;
    const filesLength = files.length;

    for (var i = 0; i < filesLength; i++) {
      var f = files[i];
      var fileReader = new FileReader();
      var type = f.type.split("/");

      if (type[0] != "image" && type[1] != "png" && type[1] != "jpg" && type[1] != "jpeg") {
        $(this).addClass(ivld);
        this.setCustomValidity("Les images PNG, JPG ou JPEG sont acceptées");
        preContent.empty();
        prePics.hide();
        return 0;
      }

      fileReader.onload = function (e) {
        preContent.append(`<div class="w-100 my-2 p-2 border border-success"> <img src="${e.target.result}" class="w-25" ></div>`);
      };
      fileReader.readAsDataURL(f);
    }

    remove.click(function () {
      preContent.empty();
      prePics.hide();
      document.getElementById("addPics").setCustomValidity("Ce champ est obligatoire");
      addPics.addClass(ivld);
      return 0;
    });

    document.getElementById("addPics").setCustomValidity("");
    addPics.removeClass(ivld);
  });
  remove.click(function () {
    preContent.empty();
    prePics.hide();
    document.getElementById("addPics").setCustomValidity("Ce champ est obligatoire");
    addPics.addClass(ivld);
  });
  const modelCheck = model.data("model")
  const brandCheck = marque.data("marque")
  
  model.empty().append("<option value='' selected disabled>Le modèle de voiture</option>");
  $.getJSON(`/../json/models/${brandCheck}.json`, function (result) {
    $.each(result, function (i) {
        if (result[i].fr === JSON.parse(modelCheck))
            model.append(`<option value='${JSON.stringify(result[i])}' selected>${result[i].fr}</option>`);
        else
            model.append(`<option value='${JSON.stringify(result[i])}'>${result[i].fr}</option>`);
    });
  });
});