$(document).ready(function () {
  // ======================================= EMAIL CHECKING
  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return re.test(password);
  }
  const ivld = "is-invalid";
  const password = $("#password");
  const repassword = $("#repassword");
  // =========== ON SUBMIT
  $("#enregistrer").click(function () {
    if (password.val().length === 0) {
      document.getElementById("password").setCustomValidity("ce champ est obligatoire");
      password.addClass(ivld);
    }

    if (repassword.val().length === 0) {
      document.getElementById("repassword").setCustomValidity("ce champ est obligatoire");
      repassword.addClass(ivld);
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

  $("#repassword").keyup(function () {
    if (password.val() === repassword.val()) {
      document.getElementById("repassword").setCustomValidity("");
      repassword.removeClass(ivld);
    } else {
      document.getElementById("repassword").setCustomValidity("ce mot de passe ne correspond pas");
      repassword.addClass(ivld);
    }
  });
});
