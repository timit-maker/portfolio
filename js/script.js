document.addEventListener('DOMContentLoaded', () => {
    // --- 0. MENU MOBILE (BURGER) ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            
            // Animation Burger
            burger.classList.toggle('toggle');
            
            // Animation des liens (fade in)
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
        
        // Fermer le menu quand on clique sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(l => l.style.animation = '');
            });
        });
    }
    // --- 1. BARRE DE PROGRESSION & RETOUR HAUT ---
    const backToTopButton = document.getElementById('backToTop');
    const progressBar = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        // Calcul du scroll
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        // Mise à jour barre
        if (progressBar) { progressBar.style.width = scrollPercent + '%'; }

        // Affichage bouton
        if (scrollTop > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });

    if(backToTopButton){
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 2. TERMINAL TYPEWRITER ---
    const terminalBody = document.getElementById('typewriter');
    if (terminalBody) {
        const lines = [
            { text: "root@timeo:~$ ./init_portfolio.sh", type: "cmd" },
            { text: "Loading system modules...", type: "log" },
            { text: "[OK] Active Directory services started", type: "success" },
            { text: "[OK] Proxmox VE hypervisor connected", type: "success" },
            { text: "[OK] Loading TryHackMe profile...", type: "success" },
            { text: "Decrypting user profile...", type: "log" },
            { text: "Access Granted. Welcome, Admin.", type: "highlight" }
        ];

        let lineIndex = 0;
        let charIndex = 0;

        function typeLine() {
            if (lineIndex < lines.length) {
                const line = lines[lineIndex];
                if (charIndex === 0) {
                    const p = document.createElement('div');
                    p.className = 'terminal-line';
                    if (line.type === 'cmd') p.style.color = '#58a6ff';
                    if (line.type === 'success') p.style.color = '#238636';
                    if (line.type === 'highlight') { p.style.color = '#fff'; p.style.fontWeight = 'bold'; }
                    else p.style.color = '#8b949e';
                    p.id = `line-${lineIndex}`;
                    terminalBody.appendChild(p);
                }
                const currentElement = document.getElementById(`line-${lineIndex}`);
                currentElement.textContent += line.text.charAt(charIndex);
                charIndex++;
                
                if (charIndex < line.text.length) {
                    setTimeout(typeLine, 30);
                } else {
                    lineIndex++;
                    charIndex = 0;
                    setTimeout(typeLine, 200);
                }
            } else {
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                cursor.textContent = ' █';
                terminalBody.appendChild(cursor);
            }
        }
        setTimeout(typeLine, 500);
    }

    // --- 3. DASHBOARD VEILLE MULTI-COLONNES ---
    
    // Fonction générique pour charger un flux dans une colonne spécifique
    function loadRSS(url, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`)
            .then(response => response.json())
            .then(data => {
                container.innerHTML = ''; // Vide le "Chargement..."
                
                if (data.status === 'ok' && data.items.length > 0) {
                    // On prend les 10 derniers articles pour avoir de quoi scroller
                    data.items.slice(0, 10).forEach(item => {
                        const cleanTitle = item.title.replace(/<[^>]*>?/gm, ''); // Nettoyage HTML
                        const dateObj = new Date(item.pubDate);
                        const dateStr = dateObj.toLocaleDateString('fr-FR');
                        
                        const cardHTML = `
                            <a href="${item.link}" target="_blank" class="mini-rss-card">
                                <div class="mini-rss-title">${cleanTitle}</div>
                                <span class="mini-rss-date"><i class="fa-regular fa-clock"></i> ${dateStr}</span>
                            </a>
                        `;
                        container.innerHTML += cardHTML;
                    });
                } else {
                    container.innerHTML = '<p style="font-size:0.8rem; color:#888; text-align:center;">Flux vide ou indisponible.</p>';
                }
            })
            .catch(err => {
                console.error(err);
                container.innerHTML = '<p style="font-size:0.8rem; color:#e4192d; text-align:center;">Erreur de connexion API.</p>';
            });
    }

    // Chargement des 3 colonnes
    // 1. IT-Connect (Tutos SysAdmin)
    loadRSS('https://www.it-connect.fr/feed/', 'col-it-connect');

    // 2. CERT-FR (Alertes critiques)
    loadRSS('https://www.cert.ssi.gouv.fr/feed/', 'col-cert-fr');

    // 3. Undernews (Source indépendante fiable)
    loadRSS('https://www.undernews.fr/feed', 'col-undernews');

    // --- 4. SMOOTH SCROLL ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });
});

// Fonction de copie d'email
function copyEmail() {
    const email = "timeo.beloeil@gmail.com"; 
    navigator.clipboard.writeText(email).then(() => {
        alert("Email copié : " + email);
    }).catch(err => {
        prompt("Copiez l'email manuellement :", email);
    });
}