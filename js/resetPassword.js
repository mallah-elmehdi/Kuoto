$(document).ready(function () {

  // ======================================= EMAIL CHECKING
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  const ivld = "is-invalid";
  // =========== ON SUBMIT
  $("#reset").click(function () {
    var email = $("#email");

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

});
