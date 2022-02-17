$(document).ready(function () {
	const brand = $("#brand");
	const modele = $("#modele");
	const ville = $("#ville");
	const secteur = $("#secteur");
	const bgSearch = $("#bg-search");
	const card = $(".card");
	const storeLink = $(".str-link");
	const maps = $("#map");
	const positions = maps.data("locations");

	// ======================================= MODEL - BRAND

	brand.change(function () {
		modele.empty().append("<option value='all'>Tous les modèles</option>");

		if ($(this).val() != "all") {
			$.getJSON(`/../json/models/${JSON.parse($(this).val()).id}.json`, function (result) {
				$.each(result, function (i) {
					modele.append(`<option value='${JSON.stringify(result[i])}'>${result[i].fr}</option>`);
				});
			});
		}
	});

	// ======================================= CITY - SECTEUR

	ville.change(function () {
		secteur.empty().append("<option value='all'>Tous les secteurs</option>");

		if ($(this).val() != "all" && JSON.parse($(this).val()).id) {
			$.getJSON(`/../json/city/${JSON.parse($(this).val()).id}.json`, function (result) {
				$.each(result, function (i) {
					secteur.append(`<option value='${JSON.stringify(result[i])}'>${result[i].fr}</option>`);
				});
			});
		}
	});

	// ======================================= GRID SELECTION

	if ($(window).width() >= 780) {
		bgSearch.addClass("grid-0");
		brand.addClass("border-top-0 border-bottom-0 border-right border-left").removeClass("border-top border-bottom border-right-0 border-left-0");
		secteur.addClass("border-top-0 border-left").removeClass("border-top border-left-0");
	} else {
		bgSearch.removeClass("grid-0");
		brand.addClass("border-top border-bottom border-right-0 border-left-0").removeClass("border-top-0 border-bottom-0 border-right border-left");
		secteur.addClass("border-top border-left-0").removeClass("border-top-0 border-left");
	}

	// ======================================= CARD SHADOW

	card.mouseover(function () {
		$(this).addClass("shadow").removeClass("shadow-sm");
		card.mouseout(function () {
			$(this).addClass("shadow-sm").removeClass("shadow");
		});
	});

	storeLink.mouseover(function () {
		$(this).addClass("shadow").removeClass("shadow-sm");
		storeLink.mouseout(function () {
			$(this).addClass("shadow-sm").removeClass("shadow");
		});
	});

	// ======================================= MAPS
	//   var marker, i;
	//   var map = new google.maps.Map(document.getElementById("map"), {
	//     zoom: 10,
	//     center: { lat: 33.5731, lng: -7.5898 },
	//   });
	//   for (i = 0; i < positions.length; i++) {
	//     marker = new google.maps.Marker({
	//       position: new google.maps.LatLng(positions[i].coordinates[1], positions[i].coordinates[0]),
	//       icon: {
	//         url: "/../graphics/marker1.png",
	//         labelOrigin: new google.maps.Point(26.5, 16.5),
	//       },
	//       label: {
	//         color: "#fff",
	//         fontWeight: "bold",
	//         fontSize: "12px",
	//         text: `${positions[i].price} DH`,
	//         link: positions[i].id
	//       },
	//       map: map,
	//     });
	//     marker.addListener("click", toggleBounce);
	//   }
	
	var map = new ol.Map({
		target: 'map',
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM()
			})
		],
		view: new ol.View({
			center: ol.proj.fromLonLat([-7.7898, 31.5731]),
			zoom: 6
		})
	});

	function toggleBounce() {
		window.location.href = `/voiture/${this.label.link}`
	}
});