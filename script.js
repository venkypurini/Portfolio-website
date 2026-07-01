document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. MOBILE NAVIGATION MENU
    // ==========================================================================
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const toggleMobileMenu = () => {
        hamburgerBtn.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuOverlay.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu on resize if open
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenuOverlay.classList.contains('open')) {
            toggleMobileMenu();
        }
    });

    // ==========================================================================
    // 2. NAVBAR SCROLL EFFECT & ACTIVE LINKS
    // ==========================================================================
    const navbar = document.getElementById('main-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Navbar shrink
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on load

    // ==========================================================================
    // 3. TYPEWRITER EFFECT
    // ==========================================================================
    const typewriterText = document.getElementById('typewriter-text');
    const words = [
        "Computer Science Student",
        "Data Analyst",
        "Python & Java Programmer",
        "Problem Solver"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Pause at completion
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to next word
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    };

    if (typewriterText) {
        setTimeout(type, 1000);
    }

    // ==========================================================================
    // 4. CANVAS PARTICLE BACKGROUND
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let particleCount = 70;
    let mouse = { x: null, y: null, radius: 150 };

    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Adjust particle count for mobile screens
        if (window.innerWidth < 768) {
            particleCount = 30;
        } else {
            particleCount = 75;
        }
        initParticles();
    };

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#00f2fe' : '#9b51e0';
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Interaction with mouse
            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= dx * force * 0.03;
                    this.y -= dy * force * 0.03;
                }
            }

            this.draw();
        }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const drawConnections = () => {
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => p.update());
        drawConnections();
        
        requestAnimationFrame(animateParticles);
    };

    // Events for Canvas
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    setCanvasSize();
    animateParticles();

    // ==========================================================================
    // 5. SCROLL INTERSECTION OBSERVERS (Skills Fill & Slide Animations)
    // ==========================================================================
    // Skill Fill animation trigger
    const skillBars = document.querySelectorAll('.progress-fill');
    const skillSection = document.getElementById('skills');

    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                // Unobserve once animated
                observer.unobserve(entry.target);
            }
        });
    };

    const skillObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.15
    });

    if (skillSection) {
        skillObserver.observe(skillSection);
    }

    // Scroll fade-in animations for section items
    const animElements = [
        '.about-info-card',
        '.education-timeline-card',
        '.skill-category-card',
        '.project-card',
        '.cert-card',
        '.contact-info-panel',
        '.contact-form-panel'
    ];

    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('scroll-animate');
            elementObserver.observe(el);
        });
    });

    // ==========================================================================
    // 6. CONTACT FORM VALIDATION & SIMULATED TOAST NOTIFICATION
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const toastContainer = document.getElementById('toast-container');

    const showToast = (title, message) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <svg class="toast-success-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <div class="toast-content">
                <span class="toast-title">${title}</span>
                <span class="toast-message">${message}</span>
            </div>
        `;
        toastContainer.appendChild(toast);
        
        // Trigger show animation
        setTimeout(() => toast.classList.add('show'), 50);

        // Remove toast after 4s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (!name || !email || !subject || !message) {
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitText = submitBtn.querySelector('span');
            
            submitBtn.disabled = true;
            submitText.textContent = "Sending...";
            
            setTimeout(() => {
                showToast("Message Sent!", `Thank you, ${name}. I will get back to you shortly.`);
                contactForm.reset();
                submitBtn.disabled = false;
                submitText.textContent = "Send Message";
            }, 1200);
        });
    }

    // ==========================================================================
    // 7. PROJECT DETAILS MODAL INTERACTIVITY
    // ==========================================================================
    const projectData = {
        vms: {
            title: "Smart Visitor Management System (Smart VMS)",
            badge: "Full-Stack Enterprise App",
            tags: ["MongoDB", "Express.js", "React.js", "Node.js", "Socket.io", "REST API", "Mongoose"],
            desc: "Smart VMS (VizTrack) is an enterprise-grade MERN-stack application designed to automate organization visitor log operations, manage meeting schedules, and facilitate real-time visitor checking. The application completely digitizes paper registries, adding security and efficiency to facilities management.",
            bullets: [
                "Designed and built secure, robust backend REST APIs using Node.js, Express.js, and MongoDB/Mongoose schema modeling.",
                "Created responsive dashboard UI in React.js for administrators, employees, and receptionists to manage logs.",
                "Implemented Socket.io integration to deliver real-time notifications to employees when visitors check in for scheduled meetings.",
                "Created pre-registration flow allowing hosts to register visitor details beforehand, generating pre-filled codes.",
                "Developed real-time Check-In/Check-Out event trackers with instant validation checks.",
                "Engineered emergency reporting module to aggregate current building headcounts for safety compliance."
            ],
            codeLink: "https://github.com/venkypurini/SmartVMS"
        },
        portfolio: {
            title: "Personal Portfolio Website",
            badge: "Frontend & UI Design",
            tags: ["HTML5", "CSS3", "JavaScript", "Canvas API", "Responsive Web Design"],
            desc: "A custom designed developer portfolio website that features visual aesthetics, micro-animations, and interactive components. Constructed from scratch to showcase development skills, education, and professional credentials with maximum speed and style.",
            bullets: [
                "Designed and developed a personal portfolio website from scratch to showcase skills, projects, and technical background.",
                "Implemented a clean, professional, and fully responsive UI using HTML5, vanilla CSS3, and JavaScript.",
                "Built an interactive HTML5 Canvas background drawing floating particle space constellations that react to mouse hover.",
                "Created scroll-triggered intersection observers to animate skill progress fills and section fading.",
                "Designed a fully custom glassmorphism modal popup that dynamically renders project details on click.",
                "Focused on user-friendly navigation, accessibility standards, and professional design aesthetics."
            ],
            codeLink: "https://github.com/purini-venkatesh"
        }
    };

    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    
    const modalTitle = document.getElementById('modal-title');
    const modalBadge = document.getElementById('modal-badge');
    const modalTags = document.getElementById('modal-tags');
    const modalDesc = document.getElementById('modal-desc');
    const modalBullets = document.getElementById('modal-bullets');
    const modalCodeLink = document.getElementById('modal-code-link');

    const openModal = (projectId) => {
        const data = projectData[projectId];
        if (!data) return;

        // Populate fields
        modalTitle.textContent = data.title;
        modalBadge.textContent = data.badge;
        modalDesc.textContent = data.desc;
        modalCodeLink.href = data.codeLink;

        // Tags
        modalTags.innerHTML = '';
        data.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            modalTags.appendChild(span);
        });

        // Bullets
        modalBullets.innerHTML = '';
        data.bullets.forEach(bullet => {
            const li = document.createElement('li');
            li.textContent = bullet;
            modalBullets.appendChild(li);
        });

        // Show Modal
        projectModal.classList.add('open');
        document.body.classList.add('no-scroll');
        projectModal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        projectModal.classList.remove('open');
        document.body.classList.remove('no-scroll');
        projectModal.setAttribute('aria-hidden', 'true');
    };

    // Attach listeners
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const projectId = btn.getAttribute('data-project');
            openModal(projectId);
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Close on click outside card
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('open')) {
            closeModal();
        }
    });
});
