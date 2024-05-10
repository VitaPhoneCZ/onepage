let last_known_scroll_position = 0;
let ticking = false;

function doSomething(scroll_pos) {
    let sections = document.querySelectorAll('.section');
    for (let i = 0; i < sections.length; i++) {
        let rect = sections[i].getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            if (scroll_pos > last_known_scroll_position && i < sections.length - 1) {
                sections[i + 1].scrollIntoView({behavior: "smooth"});
            } else if (scroll_pos < last_known_scroll_position && i > 0) {
                sections[i - 1].scrollIntoView({behavior: "smooth"});
            }
            break;
        }
    }
}

window.addEventListener('scroll', function(e) {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(function() {
            doSomething(last_known_scroll_position);
            ticking = false;
        });

        ticking = true;
    }
});
