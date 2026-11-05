
/* =========================================
   SLOW POUR — INTERACTIONS & ANIMATIONS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const header = document.querySelector(".header");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("main section[id]");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    document.documentElement.classList.add("js-ready");


    /* 01. PAGE ENTRANCE */

    requestAnimationFrame(() => {
        body.classList.add("page-loaded");
    });


    /* 02. SCROLL PROGRESS BAR */

    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.setAttribute("aria-hidden", "true");
    document.body.appendChild(progressBar);


    /* 03. AUTOMATIC SCROLL REVEALS */

    const revealElements = document.querySelectorAll(`
        .intro-label,
        .intro-content,
        .intro-signature,
        .story-image,
        .story-content,
        .menu-heading,
        .menu-card,
        .menu-footer,
        .feature-content,
        .gallery-heading,
        .gallery-item,
        .visit-content,
        .visit-image,
        .footer-top,
        .footer-bottom
    `);

    revealElements.forEach((element, index) => {
        element.dataset.reveal = "";

        if (
            element.classList.contains("menu-card") ||
            element.classList.contains("gallery-item")
        ) {
            element.style.setProperty(
                "--reveal-delay",
                `${(index % 4) * 100}ms`
            );
        }
    });

    if ("IntersectionObserver" in window && !reduceMotion) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {
        revealElements.forEach(element => {
            element.classList.add("is-visible");
        });
    }


    /* 04. STICKY HEADER + SCROLL PROGRESS */

    let ticking = false;

    function updateScrollEffects() {

        const scrollTop = window.scrollY;

        const scrollableHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;

        const progress = scrollableHeight > 0
            ? (scrollTop / scrollableHeight) * 100
            : 0;

        progressBar.style.width = `${progress}%`;

        if (header) {
            header.classList.toggle(
                "is-scrolled",
                scrollTop > 40
            );
        }

        if (!reduceMotion) {
            document.querySelectorAll("[data-parallax]").forEach(image => {

                const rect = image.getBoundingClientRect();

                if (
                    rect.bottom > 0 &&
                    rect.top < window.innerHeight
                ) {
                    const movement = (rect.top - window.innerHeight / 2) * -0.035;

                    image.style.setProperty(
                        "--parallax-y",
                        `${movement}px`
                    );
                }

            });
        }

        ticking = false;
    }

    window.addEventListener("scroll", () => {

        if (!ticking) {
            window.requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }

    }, { passive: true });

    updateScrollEffects();


    /* 05. ACTIVE NAVIGATION */

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        const activeId = entry.target.id;

                        navLinks.forEach(link => {

                            const isActive =
                                link.getAttribute("href") === `#${activeId}`;

                            link.classList.toggle("active", isActive);

                        });

                    }

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );

        sections.forEach(section => {
            sectionObserver.observe(section);
        });

    }


    /* 06. SUBTLE MENU CARD TILT */

    const menuCards = document.querySelectorAll(".menu-card");

    const canHover = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (canHover && !reduceMotion) {

        menuCards.forEach(card => {

            card.addEventListener("pointermove", event => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -2;
                const rotateY = ((x - centerX) / centerX) * 2;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-5px)
                `;

            });

            card.addEventListener("pointerleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* 07. PARALLAX IMAGES */

    if (!reduceMotion) {

        const parallaxImages = document.querySelectorAll(`
            .hero-image,
            .story-image img,
            .feature > img,
            .visit-image img
        `);

        parallaxImages.forEach(image => {
            image.dataset.parallax = "";
        });

    }


    /* 08. BACK TO TOP */

    const backToTop = document.querySelector(".back-top");

    if (backToTop) {

        backToTop.addEventListener("click", event => {

            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });

        });

    }


    /* 09. SMOOTH NAVIGATION */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            history.replaceState(null, "", targetId);

        });

    });

});
