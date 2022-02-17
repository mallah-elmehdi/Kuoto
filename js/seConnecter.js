$(document).ready(function () {
  // ======================================= EMAIL CHECKING
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return re.test(password);
  }
  const ivld = "is-invalid";
  // =========== ON SUBMIT
  $("#se-connecter").click(function () {
    var email = $("#email");
    var password = $("#password");

    if (password.val().length === 0) {
      document.getElementById("password").setCustomValidity("ce champ est obligatoire");
      password.addClass(ivld);
    }

    if (email.val().length === 0) {
      document.getElementById("email").setCustomValidity("ce champ est obligatoire");
      email.addClass(ivld);
    }
  });
  // =========== ON TYPING

  $("#email").keyup(function () {
    var email = $("#email");

    if (!validateEmail(email.val())) {
      document.getElementById("email").setCustomValidity("email invalide");
      email.addClass(ivld);
    }

    if (validateEmail(email.val())) {
      document.getElementById("email").setCustomValidity("");
      email.removeClass(ivld);
    }
  });

  $("#password").keyup(function () {
    var password = $("#password");
    if (validatePassword(password.val())) {
      document.getElementById("password").setCustomValidity("");
      password.removeClass(ivld);
    } else {
      document.getElementById("password").setCustomValidity("au moins 8 caractères + 1 lettre majuscule + 1 lettre minuscule + 1 chiffre");
      password.addClass(ivld);
    }
  });
});
