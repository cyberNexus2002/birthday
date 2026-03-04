/* ============================================
   ROMANTIC BIRTHDAY WEBSITE — MAIN SCRIPT
   Three.js 3D Hearts, GSAP ScrollTrigger, 
   Typewriter, Confetti, and Music
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER (waits for user click to start music) ==========
    const preloader = document.getElementById('preloader');
    const bgMusic = document.getElementById('bg-music');
    let musicPlaying = false;
    let animationsStarted = false;

    function enterSite() {
        if (animationsStarted) return;
        animationsStarted = true;

        // Start music immediately on user interaction
        if (bgMusic) {
            bgMusic.volume = 0.5;
            bgMusic.play().then(() => {
                musicPlaying = true;
                const mb = document.getElementById('music-toggle');
                if (mb) mb.classList.add('playing');
            }).catch(() => { });
        }

        // Hide preloader
        preloader.classList.add('loaded');
        initAnimations();
    }

    // Wait for user click/tap to enter (required for audio autoplay)
    preloader.addEventListener('click', enterSite);
    preloader.addEventListener('touchend', enterSite);

    // Also allow keyboard
    document.addEventListener('keydown', function onKey() {
        enterSite();
        document.removeEventListener('keydown', onKey);
    });


    // ========== THREE.JS — 3D FLOATING HEARTS & PARTICLES ==========
    const canvas = document.getElementById('hero-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff2d55, 2, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x9b59b6, 1.5, 100);
    pointLight2.position.set(-10, -10, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffd700, 1, 100);
    pointLight3.position.set(0, 15, -5);
    scene.add(pointLight3);

    // -- Create Heart Shape --
    function createHeartShape() {
        const shape = new THREE.Shape();
        const x = 0, y = 0;
        shape.moveTo(x, y + 0.5);
        shape.bezierCurveTo(x, y + 0.5, x - 0.5, y, x - 0.5, y);
        shape.bezierCurveTo(x - 0.5, y - 0.35, x, y - 0.6, x, y - 0.9);
        shape.bezierCurveTo(x, y - 0.6, x + 0.5, y - 0.35, x + 0.5, y);
        shape.bezierCurveTo(x + 0.5, y, x, y + 0.5, x, y + 0.5);
        return shape;
    }

    // -- 3D Hearts --
    const hearts = [];
    const heartShape = createHeartShape();
    const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.05, bevelSegments: 4 };
    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);

    const heartColors = [0xff2d55, 0xff6b8a, 0xff69b4, 0xffb3c6, 0xc9a0dc, 0xff4d6d];

    for (let i = 0; i < 18; i++) {
        const color = heartColors[Math.floor(Math.random() * heartColors.length)];
        const material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            transparent: true,
            opacity: 0.6 + Math.random() * 0.35,
        });

        const heart = new THREE.Mesh(heartGeometry, material);
        const scale = 0.4 + Math.random() * 1.2;
        heart.scale.set(scale, scale, scale);
        heart.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 20 - 5
        );
        heart.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        heart.userData = {
            speedX: (Math.random() - 0.5) * 0.005,
            speedY: 0.003 + Math.random() * 0.008,
            speedRotX: (Math.random() - 0.5) * 0.008,
            speedRotY: (Math.random() - 0.5) * 0.01,
            speedRotZ: (Math.random() - 0.5) * 0.006,
            initialY: heart.position.y,
            floatAmplitude: 0.5 + Math.random() * 2,
            floatSpeed: 0.5 + Math.random() * 1.5,
        };

        scene.add(heart);
        hearts.push(heart);
    }

    // -- Star Particles --
    const starCount = 600;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 100;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
        starSizes[i] = Math.random() * 2 + 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.15,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // -- Rose Petal Particles --
    const petalCount = 80;
    const petalGeometry = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);

    for (let i = 0; i < petalCount; i++) {
        petalPositions[i * 3] = (Math.random() - 0.5) * 60;
        petalPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 5;
    }

    petalGeometry.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));

    const petalMaterial = new THREE.PointsMaterial({
        color: 0xff6b8a,
        size: 0.3,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
    });

    const petals = new THREE.Points(petalGeometry, petalMaterial);
    scene.add(petals);

    // -- Mouse Interaction --
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Touch support
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            targetMouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
            targetMouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2;
        }
    }, { passive: true });

    // -- Animation Loop --
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse follow
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Animate hearts
        hearts.forEach((heart) => {
            const d = heart.userData;
            heart.rotation.x += d.speedRotX;
            heart.rotation.y += d.speedRotY;
            heart.rotation.z += d.speedRotZ;
            heart.position.y = d.initialY + Math.sin(time * d.floatSpeed) * d.floatAmplitude;
            heart.position.x += d.speedX;

            // Wrap around
            if (heart.position.x > 30) heart.position.x = -30;
            if (heart.position.x < -30) heart.position.x = 30;
            if (heart.position.y > 25) {
                heart.position.y = -25;
                d.initialY = -25;
            }
        });

        // Rotate stars slowly
        stars.rotation.y += 0.0003;
        stars.rotation.x += 0.0001;

        // Animate petals falling
        const petalPos = petals.geometry.attributes.position.array;
        for (let i = 0; i < petalCount; i++) {
            petalPos[i * 3 + 1] -= 0.015;
            petalPos[i * 3] += Math.sin(time + i) * 0.005;
            if (petalPos[i * 3 + 1] < -30) {
                petalPos[i * 3 + 1] = 30;
                petalPos[i * 3] = (Math.random() - 0.5) * 60;
            }
        }
        petals.geometry.attributes.position.needsUpdate = true;

        // Camera mouse parallax
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    // -- Resize Handler --
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });


    // ========== GSAP SCROLL ANIMATIONS ==========
    function initAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Animate all [data-animate] elements
        const animElements = document.querySelectorAll('[data-animate]');
        animElements.forEach((el, index) => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        once: true,
                    },
                    delay: index % 3 * 0.15,
                    onComplete: () => el.classList.add('animated'),
                }
            );
        });

        // Hero entrance animation
        const heroTl = gsap.timeline({ delay: 0.3 });
        heroTl
            .from('.hero-sparkle', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)' })
            .from('.hero-line-1', { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2')
            .from('.hero-line-2', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
            .from('.heart-pulse', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(3)' }, '-=0.3')
            .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
            .from('.hero-cta', { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
            .from('.scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.1');

        // Timeline line drawing
        gsap.fromTo('.timeline-line', {
            scaleY: 0, transformOrigin: 'top center'
        }, {
            scaleY: 1,
            duration: 1.5,
            ease: 'none',
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 70%',
                end: 'bottom 50%',
                scrub: 1,
            }
        });

        // Parallax scroll on canvas
        gsap.to('#hero-canvas', {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
            },
            opacity: 0.2,
            ease: 'none',
        });

        // Init typewriter
        initTypewriter();
    }


    // ========== TYPEWRITER EFFECT ==========
    function initTypewriter() {
        const textEl = document.getElementById('typewriter-text');
        if (!textEl) return;

        const fullText = textEl.textContent.trim();
        textEl.textContent = '';
        textEl.classList.add('typing');
        let charIndex = 0;
        let started = false;

        ScrollTrigger.create({
            trigger: textEl,
            start: 'top 80%',
            once: true,
            onEnter: () => {
                if (started) return;
                started = true;
                typeChar();
            }
        });

        function typeChar() {
            if (charIndex < fullText.length) {
                textEl.textContent += fullText.charAt(charIndex);
                charIndex++;
                const delay = fullText.charAt(charIndex - 1) === '.' ? 80 :
                    fullText.charAt(charIndex - 1) === ',' ? 50 :
                        18 + Math.random() * 18;
                setTimeout(typeChar, delay);
            } else {
                textEl.classList.remove('typing');
            }
        }
    }


    // ========== WISH BUTTON & CONFETTI ==========
    const wishBtn = document.getElementById('wish-btn');
    const wishMsg = document.getElementById('wish-message');
    const flames = document.querySelectorAll('.flame');
    let wished = false;

    if (wishBtn) {
        wishBtn.addEventListener('click', () => {
            if (wished) return;
            wished = true;

            // Blow out flames
            flames.forEach((flame, i) => {
                setTimeout(() => {
                    flame.classList.add('blown');
                }, i * 200);
            });

            // Show message
            setTimeout(() => {
                wishBtn.style.display = 'none';
                wishMsg.classList.remove('hidden');

                // Fire confetti
                fireConfetti();
            }, 800);
        });
    }

    function fireConfetti() {
        const duration = 4000;
        const end = Date.now() + duration;

        const colors = ['#ff2d55', '#ff6b8a', '#ffd700', '#ff69b4', '#c9a0dc', '#ffb3c6'];

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 60,
                origin: { x: 0, y: 0.7 },
                colors: colors,
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 60,
                origin: { x: 1, y: 0.7 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 90,
                spread: 120,
                origin: { x: 0.5, y: 0.4 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();

        // Big burst
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.5, y: 0.6 },
            colors: colors,
        });
    }


    // ========== FLOATING HEARTS ON CLICK ==========
    document.addEventListener('click', (e) => {
        createClickHeart(e.clientX, e.clientY);
    });

    function createClickHeart(x, y) {
        const heart = document.createElement('span');
        heart.textContent = ['❤️', '💕', '💖', '💗', '💝', '🌹'][Math.floor(Math.random() * 6)];
        heart.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: ${16 + Math.random() * 16}px;
            pointer-events: none;
            z-index: 9998;
            animation: clickHeart 1.2s ease-out forwards;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1200);
    }

    // Add click heart animation style
    const clickHeartStyle = document.createElement('style');
    clickHeartStyle.textContent = `
        @keyframes clickHeart {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5) rotate(0deg); }
            50% { opacity: 1; transform: translate(-50%, -120%) scale(1.2) rotate(15deg); }
            100% { opacity: 0; transform: translate(-50%, -200%) scale(0.8) rotate(-10deg); }
        }
    `;
    document.head.appendChild(clickHeartStyle);


    // ========== MUSIC TOGGLE BUTTON ==========
    const musicBtn = document.getElementById('music-toggle');
    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (musicPlaying) {
                bgMusic.pause();
                musicBtn.classList.remove('playing');
                musicPlaying = false;
            } else {
                bgMusic.play().then(() => {
                    musicPlaying = true;
                    musicBtn.classList.add('playing');
                }).catch(() => { });
            }
        });
    }


    // ========== SMOOTH ANCHOR SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ========== CURSOR TRAIL (Desktop) ==========
    if (window.matchMedia('(hover: hover)').matches) {
        let trail = [];
        const trailLength = 8;

        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                width: ${6 - i * 0.5}px;
                height: ${6 - i * 0.5}px;
                background: radial-gradient(circle, rgba(255,45,85,${0.8 - i * 0.08}), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9997;
                transition: transform 0.1s ease;
                opacity: 0;
            `;
            document.body.appendChild(dot);
            trail.push({ el: dot, x: 0, y: 0 });
        }

        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        function animateTrail() {
            let x = cursorX, y = cursorY;
            trail.forEach((dot, i) => {
                const nextX = x;
                const nextY = y;
                dot.x += (nextX - dot.x) * (0.3 - i * 0.02);
                dot.y += (nextY - dot.y) * (0.3 - i * 0.02);
                dot.el.style.left = dot.x + 'px';
                dot.el.style.top = dot.y + 'px';
                dot.el.style.opacity = '1';
                x = dot.x;
                y = dot.y;
            });
            requestAnimationFrame(animateTrail);
        }
        animateTrail();
    }

});
