var btns = document.getElementById("sett").getElementsByClassName("part");
for (var i = 0; i <= 2; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("on");
        current[0].className = current[0].className.replace(" on", "");
        this.className += " on";
    });
};

// ===== 

$(".carBox").hide();

$("#add").click(function () {
    $(".carBox").show();
});
$(".dlt").click(function () {
    $(".carBox").hide();
});