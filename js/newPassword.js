$(document).ready(function () {
  // ======================================= EMAIL CHECKING
  function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return re.test(password);
  }
  const ivld = "is-invalid";
  const vld = "is-valid";
  const password = $("#password");
  const repassword = $("#repassword");

  // =========== ON SUBMIT

  $("#new-password").click(function () {

    if (password.val().length === 0) {
      document.getElementById("password").setCustomValidity("ce champ est obligatoire");
      password.addClass(ivld).removeClass(vld);
    }

    if (repassword.val().length === 0) {
      document.getElementById("repassword").setCustomValidity("ce champ est obligatoire");
      repassword.addClass(ivld).removeClass(vld);
    }

  });

  // =========== ON TYPING

  $("#password").keyup(function () {

    if (validatePassword(password.val())) {
      document.getElementById("password").setCustomValidity("");
      password.removeClass(ivld).addClass(vld);
    } 
    
    else {
      document.getElementById("password").setCustomValidity("au moins 8 caractères + 1 lettre majuscule + 1 lettre minuscule + 1 chiffre");
      password.addClass(ivld).removeClass(vld);
    }

  });

  $("#repassword").keyup(function () {

    if (password.val() === repassword.val()) {
      document.getElementById("repassword").setCustomValidity("");
      repassword.removeClass(ivld).addClass(vld);
    } 
    
    else {
      document.getElementById("repassword").setCustomValidity("ce mot de passe ne correspond pas");
      repassword.addClass(ivld).removeClass(vld);
    }

  });
});
