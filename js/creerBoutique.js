document.getElementById("logo").addEventListener("change", function() {
    const logo = this.files[0]
    if (logo) {
        const reader = new FileReader()
        reader.addEventListener("load", function() {
            document.getElementById("preview").setAttribute("src", this.result)
        });
        reader.readAsDataURL(logo);
    } else {
        document.getElementById("preview").setAttribute("src", "../graphics/nologo.png");
    }
});
