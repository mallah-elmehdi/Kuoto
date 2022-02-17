$(document).ready(function () {
const star = $("input[name=star]")
  // ======================================= EMAIL CHECKING
  function validateComm(name) {
    const re = /^[a-zA-Z0-9àâçéèêëîïôûùüÿñæœ .-]{1,200}$/;
    return re.test(name);
  }
  const ivld = "is-invalid";
  // =========== ON SUBMIT
  $("#add").click(function () {
    if ($("input:checked").length === 0) {
      document.getElementById("1star").setCustomValidity("ce champ est obligatoire");
      document.getElementById("2star").setCustomValidity("ce champ est obligatoire");
      document.getElementById("3star").setCustomValidity("ce champ est obligatoire");
      document.getElementById("4star").setCustomValidity("ce champ est obligatoire");
      document.getElementById("5star").setCustomValidity("ce champ est obligatoire");
      star.addClass(ivld);
    }
  });
  // =========== ON TYPING

  $("#commentaire").keyup(function () {
    if (!validateComm($(this).val())) {
      document.getElementById("commentaire").setCustomValidity("commentaire invalide");
      $(this).addClass(ivld);
    }

    if (validateComm($(this).val()) || !$(this).val().length ) {
      document.getElementById("commentaire").setCustomValidity("");
      $(this).removeClass(ivld);
    }
  });
  
  $(".custom-control-input").click(function(){
    document.getElementById("1star").setCustomValidity("");
    document.getElementById("2star").setCustomValidity("");
    document.getElementById("3star").setCustomValidity("");
    document.getElementById("4star").setCustomValidity("");
    document.getElementById("5star").setCustomValidity("");
    star.removeClass(ivld);
})

});
