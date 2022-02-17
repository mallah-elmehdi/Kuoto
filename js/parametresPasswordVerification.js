$(document).ready(function () {
  const password = $("#password");
  const ivld = "is-invalid";
  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return re.test(password);
  }

  // =========== ON SUBMIT

  $("#edit").click(function () {
    if (password.val().length === 0) {
      document.getElementById("password").setCustomValidity("ce champ est obligatoire");
      password.addClass(ivld);
    }
  });
  // =========== ON TYPING

  $("#password").keyup(function () {
    if (validatePassword(password.val())) {
      document.getElementById("password").setCustomValidity("");
      password.removeClass(ivld);
    } else {
      document.getElementById("password").setCustomValidity("au moins 8 caractères + 1 lettre majuscule + 1 lettre minuscule + 1 chiffre");
      password.addClass(ivld);
    }
  });
});
