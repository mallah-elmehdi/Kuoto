$(document).ready(function () {
    const whatsapp = $("#whatsapp");
    const location = $("#location").data("location");
    const position = { lat: location[1], lng: location[0] }
    var marker, i;
  
    //   ==================== Whatsapp
  
    $(".whatsapp").click(function () {
      if (whatsapp.hasClass("floating-wpp")) {
        whatsapp.empty();
      }
      whatsapp.floatingWhatsApp({
        phone: `${$(this).data("phone")}`,
        headerTitle: "WhatsApp",
        popupMessage: "Salut comment pouvons-nous vous aider",
        showPopup: true,
        autoOpenTimeout: 10,
        position: "left",
      });
    });
  
    //   ==================== Google Maps
  
    var map = new google.maps.Map(document.getElementById("location"), {
      zoom: 16,
      center: position,
    });
  
    marker = new google.maps.Marker({
      position: position,
      map: map,
    });
  
    map.addListener("click", function () {
      if (navigator.platform.indexOf("iPhone") != -1 || navigator.platform.indexOf("iPod") != -1 || navigator.platform.indexOf("iPad") != -1) window.open(`maps://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${location[1]},${location[0]}`);
      else window.open(`https://www.google.com/maps/dir/?api=1&travelmode=driving&layer=traffic&destination=${location[1]},${location[0]}`);
    });
  });
  