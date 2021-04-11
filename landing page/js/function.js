window.onload = function() {

    window.addEventListener('resize', function(){
        if (window.screen.width > 680) {
            document.querySelector("header .main-menu").style.display = 'flex';
        } else {
            document.querySelector("header .main-menu").style.display = 'none';
        }
    });

    document.querySelector(".main-menu-mobile").addEventListener("click", function(){
        if (document.querySelector("header .main-menu").style.display == "flex") {
            document.querySelector("header .main-menu").style.display = "none";
        } else {
            document.querySelector("header .main-menu").style.display = "flex";
        }
    });
};