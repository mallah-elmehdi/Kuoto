$(document).ready(function () {


  var map;
  var marker;
  const location = $("#location");
  const ivld = "is-invalid";
  const email = $("#email");
  const name = $("#name");
  const storename = $("#storename");
  const adresse = $("#adresse");
  const phone = $("#phone");
  const ville = $("#ville");
  const secteur = $("#secteur");
  const logo = $("#logo-");
  const lnglat = $("#lnglat");
  const edit = $("#edit");
  const editForm = $("#edit-form");
  const cancel = $("#cancel");
  const save = $("#save");
  const secteurData = secteur.data("secteur")
  const cityData = ville.data("city")
  const locationData = location.data("location")
  var centerOfMap = { lat: locationData[1], lng: locationData[0]};
  const messenger = $("#messenger");
  const whatsapp = $("#whatsapp");
  
    //==================================================

    $("#ville").change(function () {
        if ($(this).val() && JSON.parse($(this).val()).id) {
          $("#secteur").empty();
          $.getJSON(`/../json/city/${JSON.parse($(this).val()).id}.json`, function (result) {
            $.each(result, function (i) {
              $("#secteur").append(`<option value='${JSON.stringify(result[i])}'>${result[i].fr}</option>`);
            });
          });
        } else {
          $("#secteur").empty().append("<option value=null selected disabled>Choisissez le secteur</option>");
        }
      });
    
    
      //==================================================
  
  if (cityData) {
    $("#secteur").empty();
    $.getJSON(`/../json/city/${cityData}.json`, function (result) {
      $.each(result, function (i) {
        if (secteurData === result[i].fr)
            $("#secteur").append(`<option value='${JSON.stringify(result[i])}' selected>${result[i].fr}</option>`);
        else
            $("#secteur").append(`<option value='${JSON.stringify(result[i])}' >${result[i].fr}</option>`);
      });
    });
  } else {
    $("#secteur").empty().append("<option value=null selected disabled>Choisissez le secteur</option>");
  }
  

  //   =================================================== GOOGLE MAPS

  $("#map-store").click(function () {
    if (navigator.geolocation) {
      var showPosition = function (position) {
        centerOfMap = { lat: position.coords.latitude, lng: position.coords.longitude };
        googleMap();
        location.attr("value", JSON.stringify(centerOfMap));
        document.getElementById("location").setCustomValidity("");
        lnglat.removeClass(ivld);
      };

      var errorHandler = function (errorObj) {
        alert(errorObj.code + ": " + errorObj.message);
      };

      navigator.geolocation.getCurrentPosition(showPosition, errorHandler, { enableHighAccuracy: true, maximumAge: 10000 });
    }
  });

  var googleMap = function () {
    map = new google.maps.Map(document.getElementById("map-preview"), { zoom: 13, center: centerOfMap });
    marker = new google.maps.Marker({ position: centerOfMap, map: map });

    google.maps.event.addListener(map, "click", function (event) {
      var clickedLocation = event.latLng;
      marker.setPosition(clickedLocation);
      markerLocation();
    });
  };

  googleMap();

  function markerLocation() {
    location.attr("value", JSON.stringify(marker.getPosition()));
    document.getElementById("location").setCustomValidity("");
    lnglat.removeClass(ivld);
  }

  //   =================================================== EDIT BUTTONS

  edit.click(function () {
    editForm.removeAttr("disabled");
    save.show();
    cancel.show();
    edit.hide();
  });

  // ====================================================  VALIDATION

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function validateName(name) {
    const re = /^[a-zA-Z\ ]{3,20}$/;
    return re.test(name);
  }
  function validateFB(name) {
    const re = /^[a-zA-Z0-9\-_.]{1,200}$/;
    return re.test(name);
  }
  function validateStoreName(name) {
    const re = /^[a-zA-Z0-9\ ]{2,50}$/;
    return re.test(name);
  }
  function validateAdress(name) {
    const re = /^[a-zA-Z0-9\ ,-]{5,100}$/;
    return re.test(name);
  }
  function validatePhone(phone) {
    const re = /^[0-9]{9,9}$/;
    return re.test(phone);
  }
  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return re.test(password);
  }

  // =========== ON SUBMIT

  $("#save").click(function () {
    if (name.val().length === 0) {
      document.getElementById("name").setCustomValidity("ce champ est obligatoire");
      name.addClass(ivld);
    }

    if (email.val().length === 0) {
      document.getElementById("email").setCustomValidity("ce champ est obligatoire");
      email.addClass(ivld);
    }

    if (storename.val().length === 0) {
      document.getElementById("storename").setCustomValidity("ce champ est obligatoire");
      storename.addClass(ivld);
    }

    if (adresse.val().length === 0) {
      document.getElementById("adresse").setCustomValidity("ce champ est obligatoire");
      adresse.addClass(ivld);
    }

    if (phone.val().length === 0) {
      document.getElementById("phone").setCustomValidity("ce champ est obligatoire");
      phone.addClass(ivld);
    }

    if (!ville.val()) {
      document.getElementById("ville").setCustomValidity("ce champ est obligatoire");
      ville.addClass(ivld);
      secteur.addClass(ivld);
    }

    if (logo.val().length === 0) {
      document.getElementById("logo").setCustomValidity("ce champ est obligatoire");
      logo.addClass(ivld);
    }

    if (location.val().length === 0) {
      document.getElementById("location").setCustomValidity("ce champ est obligatoire");
      lnglat.addClass(ivld);
    }
  });
  // =========== ON TYPING
  
  messenger.keyup(function () {
    if (!validateFB(messenger.val())) {
      document.getElementById("messenger").setCustomValidity("certains caractères ne sont pas autorisés");
      messenger.addClass(ivld);
    }

    if (validateFB(messenger.val()) || !messenger.val().length) {
      document.getElementById("messenger").setCustomValidity("");
      messenger.removeClass(ivld);
    }
  });

  whatsapp.keyup(function () {
    if (!validatePhone(whatsapp.val())) {
      document.getElementById("whatsapp").setCustomValidity("certains caractères ne sont pas autorisés");
      whatsapp.addClass(ivld);
    }

    if (validatePhone(whatsapp.val()) || !whatsapp.val().length) {
      document.getElementById("whatsapp").setCustomValidity("");
      whatsapp.removeClass(ivld);
    }

    if (whatsapp.val()[0] != "6" && whatsapp.val()[0] != "5" && whatsapp.val()[0] != "7") {
      document.getElementById("whatsapp").setCustomValidity("numéro incorrect");
      whatsapp.addClass(ivld);
    }
  });

  $("#name").keyup(function () {
    if (!validateName(name.val())) {
      document.getElementById("name").setCustomValidity("nom incorrect");
      name.addClass(ivld);
    }

    if (validateName(name.val())) {
      document.getElementById("name").setCustomValidity("");
      name.removeClass(ivld);
    }
  });

  $("#email").keyup(function () {
    if (!validateEmail(email.val())) {
      document.getElementById("email").setCustomValidity("email invalide");
      email.addClass(ivld);
    }

    if (validateEmail(email.val())) {
      document.getElementById("email").setCustomValidity("");
      email.removeClass(ivld);
    }
  });

  $("#logo").change(function () {
    const picture = $(this)[0].files[0];
    const logo = $("#logo");
    const remove = $("#remove");
    const preview = $("#logo-preview");

    if (!picture) {
      logo.addClass(ivld);
      preview.attr("src", "/../graphics/logo-preview.png");
      this.setCustomValidity("Ce champ est obligatoire");
      return 0;
    }

    const type = picture.type.split("/");

    if (type[0] != "image" && type[1] != "png" && type[1] != "jpg" && type[1] != "jpeg") {
      $(this).addClass(ivld);
      this.setCustomValidity("Les images PNG, JPG ou JPEG sont acceptées");
      return 0;
    }
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      preview.attr("src", this.result);
    });

    $(this).removeClass(ivld);
    this.setCustomValidity("");
    reader.readAsDataURL(picture);
    remove.show();

    remove.click(function () {
      logo.addClass(ivld);
      preview.attr("src", "/../graphics/logo-preview.png");
      document.getElementById("logo").setCustomValidity("Ce champ est obligatoire");
      remove.hide();
    });
  });

  $("#storename").keyup(function () {
    if (!validateStoreName(storename.val())) {
      document.getElementById("storename").setCustomValidity("certains caractères ne sont pas autorisés");
      storename.addClass(ivld);
    }

    if (validateStoreName(storename.val())) {
      document.getElementById("storename").setCustomValidity("");
      storename.removeClass(ivld);
    }
  });

  $("#adresse").keyup(function () {
    if (!validateAdress(adresse.val())) {
      document.getElementById("adresse").setCustomValidity("certains caractères ne sont pas autorisés");
      adresse.addClass(ivld);
    }

    if (validateAdress(adresse.val())) {
      document.getElementById("adresse").setCustomValidity("");
      adresse.removeClass(ivld);
    }
  });

  $("#phone").keyup(function () {
    if (!validatePhone(phone.val())) {
      document.getElementById("phone").setCustomValidity("certains caractères ne sont pas autorisés");
      phone.addClass(ivld);
    }

    if (validatePhone(phone.val())) {
      document.getElementById("phone").setCustomValidity("");
      phone.removeClass(ivld);
    }

    if (phone.val()[0] != "6" && phone.val()[0] != "5" && phone.val()[0] != "7") {
      document.getElementById("phone").setCustomValidity("numéro incorrect");
      phone.addClass(ivld);
    }
  });

  $("#ville").change(function () {
    document.getElementById("ville").setCustomValidity("");
    ville.removeClass(ivld);
    secteur.removeClass(ivld);
  });

  $("#location").keyup(function () {
    document.getElementById("location").setCustomValidity("");
    lnglat.removeClass(ivld);
  });
});
