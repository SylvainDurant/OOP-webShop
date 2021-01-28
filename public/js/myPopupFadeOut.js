function fadeOutEffect() {
    let fadeTarget = document.getElementById("PopupMessages");
    let fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.05;
        } else {
            clearInterval(fadeEffect);
        }
    }, 100);
}

if (target != null) {
    setTimeout(function(){
        fadeOutEffect(); 
    }, 3000);
}
