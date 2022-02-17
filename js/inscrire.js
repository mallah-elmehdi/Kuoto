$(document).ready(function () {

    // ======================================= EMAIL CHECKING
    function validateEmail(email) {
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    function validateName(name) {
        const re = /^[a-zA-Z\ ]{3,20}$/;
        return re.test(name);
    }
    function validatePassword(password) {
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
        return re.test(password);
    }
    const ivld = "is-invalid";
    const email = $("#email");
    const password = $("#password");
    const repassword = $("#repassword");
    const name = $("#name");
    // =========== ON SUBMIT
    $("#inscrire").click(function () {

    if (password.val().length === 0) {
        document.getElementById("password").setCustomValidity("ce champ est obligatoire");
        password.addClass(ivld);
      }
  
      if (name.val().length === 0) {
        document.getElementById("name").setCustomValidity("ce champ est obligatoire");
        name.addClass(ivld);
      }

      if (email.val().length === 0) {
        document.getElementById("email").setCustomValidity("ce champ est obligatoire");
        email.addClass(ivld);
      }

      if (repassword.val().length === 0) {
        document.getElementById("repassword").setCustomValidity("ce champ est obligatoire");
        repassword.addClass(ivld);
      }
    });
    // =========== ON TYPING
  
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
  
    $("#password").keyup(function () {
  
      if (validatePassword(password.val())) {
        document.getElementById("password").setCustomValidity("");
        password.removeClass(ivld);
      }
  
      else {
        document.getElementById("password").setCustomValidity("au moins 8 caractères + 1 lettre majuscule + 1 lettre minuscule + 1 chiffre");
        password.addClass(ivld);
      }
    });

    $("#repassword").keyup(function () {
  
        if (password.val() === repassword.val()) {
          document.getElementById("repassword").setCustomValidity("");
          repassword.removeClass(ivld);
        }
    
        else {
          document.getElementById("repassword").setCustomValidity("ce mot de passe ne correspond pas");
          repassword.addClass(ivld);
        }
      });
  });
  