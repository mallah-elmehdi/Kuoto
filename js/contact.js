$(document).ready(function () {
  // ======================================= EMAIL CHECKING
  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  const ivld = "is-invalid";
  const email = $("#email");
  const subject = $("#subject");
  const text = $("#text");
  // =========== ON SUBMIT
  $("#submit").click(function () {
    if (email.val().length === 0) {
      document.getElementById("email").setCustomValidity("ce champ est obligatoire");
      email.addClass(ivld);
    }

    if (subject.val().length === 0) {
      document.getElementById("subject").setCustomValidity("ce champ est obligatoire");
      subject.addClass(ivld);
    }

    if (text.val().length === 0) {
      document.getElementById("text").setCustomValidity("ce champ est obligatoire");
      text.addClass(ivld);
    }
  });
  // =========== ON TYPING

  email.keyup(function () {
    if (!validateEmail(email.val())) {
      document.getElementById("email").setCustomValidity("email invalide");
      email.addClass(ivld);
    }

    if (validateEmail(email.val())) {
      document.getElementById("email").setCustomValidity("");
      email.removeClass(ivld);
    }
  });

  subject.keyup(function () {
      $("#subject-text").text(`${subject.val().length}/50`)
      if (subject.val().length <= 50) {
      document.getElementById("subject").setCustomValidity("");
      subject.removeClass(ivld);
      $("#subject-text").removeClass(ivld)
    } else {
      document.getElementById("subject").setCustomValidity("plus de 50 lettres");
      subject.addClass(ivld);
      $("#subject-text").addClass(ivld)
    }
  });
  text.keyup(function () {
      $("#text-text").text(`${text.val().length}/200`)
      if (text.val().length <= 200) {
      document.getElementById("text").setCustomValidity("");
      text.removeClass(ivld);
      $("#text-text").removeClass(ivld)
    } else {
      document.getElementById("text").setCustomValidity("plus de 200 lettres");
      text.addClass(ivld);
      $("#text-text").addClass(ivld)
    }
  });
});
