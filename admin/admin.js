/**
 * ==========================================================================
 * ZONA DIGITALARG - LÓGICA DEL PANEL DE ADMINISTRACIÓN (admin.js)
 * ==========================================================================
 */

let allGames = [];
let currentGameToDelete = null;
let selectedCoverFile = null;
let currentAuthenticatedUserId = null;
let isLoadingGames = false;

// Fallback SVG data-URI seguro e instantáneo (nunca falla ni requiere internet)
const FALLBACK_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%3E%3Crect%20fill%3D%22%23161b27%22%20width%3D%2280%22%20height%3D%2280%22%2F%3E%3Ctext%20fill%3D%22%2394A3B8%22%20font-size%3D%2230%22%20x%3D%2250%25%22%20y%3D%2255%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%3E%F0%9F%8E%AE%3C%2Ftext%3E%3C%2Fsvg%3E";

function resolveGameCover(image, title) {
    let p = (image || '').trim();
    const t = (title || '').toLowerCase().trim();

    // Corregir errores conocidos de extensión
    if (p.toLowerCase() === 'bttle1.wedp' || p.includes('bttle1.wedp')) {
        return 'bttle1.webp';
    }

    // Si tiene un enlace genérico de Unsplash o está vacío, mapear a su portada local real
    if (!p || p.includes('unsplash.com')) {
        if (t.includes('mortal kombat 1') && !t.includes('xl')) return 'mk1.jpg';
        if (t.includes('mortal kombat xl')) return 'mkxl.webp';
        if (t.includes('battlefield 1')) return 'bttle1.webp';
        if (t.includes('battlefield 6')) return 'battle6.avif';
        if (t.includes('fc 25') || t.includes('fifa 25')) return 'fc25.jpg';
        if (t.includes('spider-man 2')) return 'spiderman2.jpg';
        if (t.includes('god of war ragnar')) return 'gow-ragnarok.jpg';
        if (t.includes('sparking')) return 'sparking-zero.jpg';
        if (t.includes('last of us')) return 'tlou-part1.jpg';
        if (t.includes('elden ring')) return 'elden-ring.jpg';
        if (t.includes('resident evil 4')) return 're4-remake.jpg';
        if (t.includes('hogwarts')) return 'hogwarts-legacy.jpg';
        if (t.includes('black ops iii') || t.includes('black ops 3')) return 'cod-bo3.jpg';
        if (t.includes('black ops ii') || t.includes('black ops 2')) return 'cod-bo2.jpg';
        if (t.includes('trilogía completa') || (t.includes('god of war') && t.includes('trilog'))) return 'gow-trilogy-ps3.jpg';
        if (t.includes('need for speed carbon') || t.includes('nfs carbon')) return 'nfs-carbon.jpg';
        if (t.includes('grand theft auto v') || t.includes('gta 5') || t.includes('gta v')) return 'gta 5.jpg';
        // 14 Nuevos juegos
        if (t.includes('arc raiders')) return 'arc-raiders.jpg';
        if (t.includes('borderlands 4')) return 'borderlands-4.jpg';
        if (t.includes('expedition 33') || t.includes('clair obscur')) return 'expedition-33.jpg';
        if (t.includes('lego') && t.includes('batman')) return 'lego-batman.jpg';
        if (t.includes('uncharted') && (t.includes('nathan drake') || t.includes('collection'))) return 'uncharted-collection.jpg';
        if (t.includes('unbound')) return 'nfs-unbound.jpg';
        if (t.includes('forza horizon 5')) return 'forza-horizon-5.jpg';
        if (t.includes('mafia') && t.includes('trilogy')) return 'mafia-trilogy.jpg';
        if (t.includes('mafia') && (t.includes('definitiva') || t.includes('definitive'))) return 'mafia-definitive.jpg';
        if (t.includes('god of war') && t.includes('deluxe')) return 'god-of-war-deluxe.jpg';
        if (t.includes('naruto') && t.includes('storm')) return 'naruto-storm-trilogy.jpg';
        if (t.includes('motogp')) return 'motogp-25.jpg';
        if (t.includes('little nightmares')) return 'little-nightmares-2.jpg';
        if (t.includes('modern warfare 4') || t.includes('mw4')) return 'call of duty.jpg';
        // 27 Nuevos juegos
        if (t.includes('dirt rally')) return 'dirt-rally-2.jpg';
        if (t.includes('until dawn')) return 'until-dawn-2015.jpg';
        if (t.includes('watch dogs') && !t.includes('watch dogs 2') && !t.includes('legion')) return 'watch-dogs.jpg';
        if (t.includes('legado de ladrones') || t.includes('legacy of thieves')) return 'uncharted-legado-ladrones.jpg';
        if (t.includes('infamous')) return 'infamous-second-son.jpg';
        if (t.includes('detroit')) return 'detroit-become-human.jpg';
        if (t.includes('forbidden west')) return 'horizon-forbidden-west.jpg';
        if (t.includes('cyberpunk')) return 'cyberpunk-2077.jpg';
        if (t.includes('wwe')) return 'wwe-2k26.jpg';
        if (t.includes("no man's sky") || t.includes("no mans sky")) return 'no-mans-sky.jpg';
        if (t.includes('heat') && t.includes('speed')) return 'nfs-heat.jpg';
        if (t.includes('resident evil 6') || t.includes('re6') || t.includes('resident evil vi')) return 're6.jpg';
        if (t.includes('storm 4')) return 'naruto-storm-4.jpg';
        if (t.includes('battlefront 2') || t.includes('battlefront ii')) return 'sw-battlefront-2.jpg';
        if (t.includes('super-villains') || t.includes('supervillains')) return 'lego-dc-super-villains.jpg';
        if (t.includes('jurassic')) return 'jurassic-world-evolution-2.jpg';
        if (t.includes('lote') && t.includes('red dead')) return 'lote-red-dead-redemption.jpg';
        if ((t.includes('last of us') || t.includes('tlou')) && (t.includes('parte 2') || t.includes('part 2') || t.includes('part ii'))) return 'tlou-part2.jpg';
        if (t.includes('outlast')) return 'outlast-trinity.jpg';
        if (t.includes('back 4 blood')) return 'back-4-blood-ultimate.jpg';
        if (t.includes('days gone')) return 'days-gone.jpg';
        if (t.includes('bloodborne')) return 'bloodborne.jpg';
        if (t.includes('mortal kombat 11') && !t.includes('injustice')) return 'mk11-ultimate.jpg';
        if (t.includes('mortal kombat 11') && t.includes('injustice')) return 'mk11-injustice2-bundle.jpg';
        if (t.includes('mortal kombat 1') && (t.includes('definitive') || t.includes('definitiva') || t.includes('edition'))) return 'mk1-definitive.jpg';
        if (t.includes('remake trilogy') || (t.includes('resident evil') && t.includes('trilogy') && !t.includes('village'))) return 're-remake-trilogy.jpg';
        if (t.includes('dead by daylight')) return 'dead-by-daylight.jpg';
        if (t.includes('silent hill')) return 'silent-hill-2.jpg';
        if (t.includes('fórmula 1') || t.includes('formula 1') || t.includes('f1 25') || t.includes('f1 24') || t.includes('f1 2026') || (t.includes('f1') && t.includes('pack'))) return 'formula-1-pack-2026.jpg';
    }

    return p;
}

function getUpdatedPriceForGame(game) {
    const t = (game.title || '').toLowerCase().trim();
    const id = Number(game.id);

    if (id === 32 || t.includes('witcher 3')) {
        return { price_primary: 25000, price_secondary: 18000, price_primary_ps4: 25000, price_secondary_ps4: 18000 };
    }
    if (id === 24 || t.includes('metro saga')) {
        return { price_primary: 8500, price_secondary: 6200, price_primary_ps4: 8500, price_secondary_ps4: 6200 };
    }
    if (id === 23 || t.includes('assetto corsa')) {
        return { price_primary: 11000, price_secondary: 7500, price_primary_ps4: 11000, price_secondary_ps4: 7500 };
    }
    // Ofertas desactivadas solicitadas por el usuario
    if (id === 1 || t.includes('modern warfare iii') || t.includes('modern warfare 3')) {
        return { is_offer: false, old_price_primary: null, discount: null };
    }
    if (id === 2 || t.includes('fc 25')) {
        return { is_offer: false, old_price_primary: null, discount: null };
    }
    if (t.includes('trilogy') && t.includes('grand theft auto')) {
        return { is_offer: false, old_price_primary: null, discount: null };
    }
    if (id === 6 || id === 4 || (t.includes('grand theft auto v') && !t.includes('trilogy'))) {
        return { price_primary: 16500, price_secondary: 9500, price_primary_ps4: 17500, price_secondary_ps4: 9500, is_offer: false, old_price_primary: null, discount: null };
    }
    if (id === 7 || (t.includes('god of war') && (t.includes('ragnarök') || t.includes('ragnarok')))) {
        return { price_primary: 25000, price_secondary: 17500, price_primary_ps4: 19000, price_secondary_ps4: 11000 };
    }
    if (id === 8 || t.includes('sparking')) {
        return { price_primary: 30000, price_secondary: 20000, price_primary_ps4: 30000, price_secondary_ps4: 20000 };
    }
    if (id === 15 || (t.includes('spider-man') && !t.includes('spider-man 2') && !t.includes('miles'))) {
        return { price_primary: 30000, price_secondary: 20000, price_primary_ps4: 30000, price_secondary_ps4: 20000 };
    }
    if (id === 33 || (t.includes('battlefield 1') && !t.includes('battlefield 6'))) {
        return { price_primary: 8900, price_secondary: 7000, price_primary_ps4: 8900, price_secondary_ps4: 7000 };
    }
    if (id === 31 || t.includes('valhalla')) {
        return { price_primary: 16500, price_secondary: 9500, price_primary_ps4: 16500, price_secondary_ps4: 9500 };
    }
    if (id === 28 || t.includes('fallout 4')) {
        return { price_primary: 9000, price_secondary: 8200, price_primary_ps4: 9000, price_secondary_ps4: 8200 };
    }
    if (id === 12 || id === 10 || (t.includes('resident evil 4') && !t.includes('raccoon'))) {
        return { price_primary: 11000, price_secondary: 7500, price_primary_ps4: 11000, price_secondary_ps4: 7500, is_offer: false, old_price_primary: null, discount: null };
    }
    if (id === 9 || id === 7 || (t.includes('mortal kombat 1') && !t.includes('xl') && !t.includes('definitive'))) {
        return { price_primary: 11000, price_secondary: 7500, price_primary_ps4: 11000, price_secondary_ps4: 7500, is_offer: false, old_price_primary: null, discount: null };
    }
    if (id === 13 || id === 11 || t.includes('hogwarts')) {
        return { price_primary: 11000, price_secondary: 7500, price_primary_ps4: 11000, price_secondary_ps4: 7500, is_offer: false, old_price_primary: null, discount: null };
    }
    if (id === 14 || id === 12 || (t.includes('red dead redemption 2') && !t.includes('lote'))) {
        return { is_offer: false, old_price_primary: null, discount: null };
    }
    // 14 Nuevos juegos
    if (t.includes('arc raiders')) {
        return { price_primary: 20000, price_secondary: 12000 };
    }
    if (t.includes('borderlands 4')) {
        return { price_primary: 35000, price_secondary: 20000 };
    }
    if (t.includes('expedition 33') || t.includes('clair obscur')) {
        return { price_primary: 38000, price_secondary: 20000 };
    }
    if (t.includes('lego') && t.includes('batman')) {
        return { price_primary: 49000, price_secondary: 30000, price_primary_ps4: 49000, price_secondary_ps4: 30000 };
    }
    if (t.includes('uncharted') && (t.includes('nathan drake') || t.includes('collection'))) {
        return { price_primary: 8200, price_secondary: 6800, price_primary_ps4: 8200, price_secondary_ps4: 6800 };
    }
    if (t.includes('unbound')) {
        return { price_primary: 9000, price_secondary: 7000 };
    }
    if (t.includes('forza horizon 5')) {
        return { price_primary: 32000, price_secondary: 25000 };
    }
    if (t.includes('mafia') && t.includes('trilogy')) {
        return { price_primary: 12500, price_secondary: 8500, price_primary_ps4: 12500, price_secondary_ps4: 8500 };
    }
    if (t.includes('mafia') && (t.includes('definitiva') || t.includes('definitive'))) {
        return { price_primary: 8500, price_secondary: 6300, price_primary_ps4: 8500, price_secondary_ps4: 6300 };
    }
    if (t.includes('god of war') && t.includes('deluxe')) {
        return { price_primary: 16500, price_secondary: 9500, price_primary_ps4: 16500, price_secondary_ps4: 9500 };
    }
    if (t.includes('naruto') && t.includes('storm') && !t.includes('storm 4')) {
        return { price_primary: 14500, price_secondary: 8000, price_primary_ps4: 14500, price_secondary_ps4: 8000 };
    }
    if (t.includes('motogp')) {
        return { price_primary: 11000, price_secondary: 7500, price_primary_ps4: 11000, price_secondary_ps4: 7500 };
    }
    if (t.includes('little nightmares')) {
        return { price_primary: 10000, price_secondary: 7500, price_primary_ps4: 10000, price_secondary_ps4: 7500 };
    }
    if (t.includes('modern warfare 4') || t.includes('mw4')) {
        return { price_primary: 35000, price_secondary: 20000, price_primary_ps4: 35000, price_secondary_ps4: 20000 };
    }
    // 27 Nuevos juegos (con las nuevas 7 ofertas activadas)
    if (t.includes('dirt rally')) {
        return { price_primary: 16500, price_secondary: 9500, price_primary_ps4: 16500, price_secondary_ps4: 9500, is_offer: true, old_price_primary: 22000, discount: "-25%" };
    }
    if (t.includes('until dawn')) {
        return { price_primary: 7500, price_secondary: 5900, price_primary_ps4: 7500, price_secondary_ps4: 5900, is_offer: true, old_price_primary: 10500, discount: "-28%" };
    }
    if (t.includes('watch dogs') && !t.includes('watch dogs 2') && !t.includes('legion')) {
        return { price_primary: 7500, price_secondary: 6000, price_primary_ps4: 7500, price_secondary_ps4: 6000 };
    }
    if (t.includes('legado de ladrones') || t.includes('legacy of thieves')) {
        return { price_primary: 20000, price_secondary: 10000 };
    }
    if (t.includes('infamous')) {
        return { price_primary: 7500, price_secondary: 6000, price_primary_ps4: 7500, price_secondary_ps4: 6000, is_offer: true, old_price_primary: 11000, discount: "-32%" };
    }
    if (t.includes('detroit')) {
        return { price_primary: 7500, price_secondary: 6000, price_primary_ps4: 7500, price_secondary_ps4: 6000, is_offer: true, old_price_primary: 11000, discount: "-32%" };
    }
    if (t.includes('forbidden west')) {
        return { price_primary: 16500, price_secondary: 9500, price_primary_ps4: 16500, price_secondary_ps4: 9500 };
    }
    if (t.includes('cyberpunk')) {
        return { price_primary: 19000, price_secondary: 10000, price_primary_ps4: 19000, price_secondary_ps4: 10000, is_offer: true, old_price_primary: 25000, discount: "-24%" };
    }
    if (t.includes('wwe')) {
        return { price_primary: 28000, price_secondary: 17000, price_primary_ps4: 28000, price_secondary_ps4: 17000 };
    }
    if (t.includes("no man's sky") || t.includes("no mans sky")) {
        return { price_primary: 24000, price_secondary: 15000, price_primary_ps4: 24000, price_secondary_ps4: 15000 };
    }
    if (t.includes('heat') && t.includes('speed')) {
        return { price_primary: 8200, price_secondary: 6000, price_primary_ps4: 8200, price_secondary_ps4: 6000 };
    }
    if (t.includes('resident evil 6') || t.includes('re6') || t.includes('resident evil vi')) {
        return { price_primary: 7800, price_secondary: 6000, price_primary_ps4: 7800, price_secondary_ps4: 6000 };
    }
    if (t.includes('storm 4')) {
        return { price_primary: 16500, price_secondary: 9500, price_primary_ps4: 16500, price_secondary_ps4: 9500, is_offer: true, old_price_primary: 22000, discount: "-25%" };
    }
    if (t.includes('battlefront 2') || t.includes('battlefront ii')) {
        return { price_primary: 7800, price_secondary: 6000, price_primary_ps4: 7800, price_secondary_ps4: 6000 };
    }
    if (t.includes('super-villains') || t.includes('supervillains')) {
        return { price_primary: 8200, price_secondary: 6800, price_primary_ps4: 8200, price_secondary_ps4: 6800 };
    }
    if (t.includes('jurassic')) {
        return { price_primary: 16000, price_secondary: 10000, price_primary_ps4: 16000, price_secondary_ps4: 10000 };
    }
    if (t.includes('lote') && t.includes('red dead')) {
        return { price_primary: 40000, price_secondary: 28000, price_primary_ps4: 40000, price_secondary_ps4: 28000 };
    }
    if ((t.includes('last of us') || t.includes('tlou')) && (t.includes('parte 2') || t.includes('part 2') || t.includes('part ii'))) {
        return { price_primary: 22000, price_secondary: 16000, price_primary_ps4: 22000, price_secondary_ps4: 16000, is_offer: true, old_price_primary: 29500, discount: "-25%" };
    }
    if (t.includes('outlast')) {
        return { price_primary: 11000, price_secondary: 7500, price_primary_ps4: 11000, price_secondary_ps4: 7500 };
    }
    if (t.includes('back 4 blood')) {
        return { price_primary: 10000, price_secondary: 7500, price_primary_ps4: 10000, price_secondary_ps4: 7500 };
    }
    if (t.includes('days gone')) {
        return { price_primary: 20000, price_secondary: 10000, price_primary_ps4: 20000, price_secondary_ps4: 10000 };
    }
    if (t.includes('bloodborne')) {
        return { price_primary: 11000, price_secondary: 7500, price_primary_ps4: 11000, price_secondary_ps4: 7500 };
    }
    if (t.includes('mortal kombat 11') && !t.includes('injustice')) {
        return { price_primary: 8200, price_secondary: 2000, price_primary_ps4: 8200, price_secondary_ps4: 2000 };
    }
    if (t.includes('mortal kombat 11') && t.includes('injustice')) {
        return { price_primary: 11000, price_secondary: 7500, price_primary_ps4: 11000, price_secondary_ps4: 7500 };
    }
    if (t.includes('mortal kombat 1') && (t.includes('definitive') || t.includes('definitiva') || t.includes('edition'))) {
        return { price_primary: 18500, price_secondary: 10000 };
    }
    if (t.includes('remake trilogy') || (t.includes('resident evil') && t.includes('trilogy') && !t.includes('village'))) {
        return { price_primary: 30000, price_secondary: 20000, price_primary_ps4: 30000, price_secondary_ps4: 20000 };
    }
    if (t.includes('dead by daylight')) {
        return { price_primary: 16000, price_secondary: 9500, price_primary_ps4: 16000, price_secondary_ps4: 9500 };
    }
    if (id === 84 || t.includes('silent hill')) {
        return { price_primary: 31000, price_secondary: 20000 };
    }
    if (id === 85 || t.includes('fórmula 1') || t.includes('formula 1') || t.includes('f1 25') || t.includes('f1 24') || t.includes('f1 2026') || (t.includes('f1') && t.includes('pack'))) {
        return { price_primary: 35000, price_secondary: 20000, price_primary_ps4: 35000, price_secondary_ps4: 20000 };
    }
    return null;
}


// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const sb = initSupabase();

    if (!sb) {
        showConfigAlert("Supabase no está configurado aún. Por favor completá tu URL y clave anónima en el archivo 'supabase-config.js'.");
        return;
    }

    // Escuchar cambios de sesión (login / logout)
    sb.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
            setupAuthenticatedView(session.user);
        } else {
            setupUnauthenticatedView();
        }
    });

    // Verificar si ya hay una sesión activa guardada
    try {
        const { data: { session } } = await sb.auth.getSession();
        if (session && session.user) {
            setupAuthenticatedView(session.user);
        } else {
            setupUnauthenticatedView();
        }
    } catch (err) {
        console.error("Error al obtener sesión:", err);
        setupUnauthenticatedView();
    }
});


/**
 * 1. GESTIÓN DE VISTAS (LOGIN VS DASHBOARD)
 */
function setupAuthenticatedView(user) {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    if (loginScreen) loginScreen.style.display = 'none';
    if (adminDashboard) adminDashboard.style.display = 'block';

    const emailEl = document.getElementById('currentAdminEmail');
    if (emailEl) emailEl.textContent = user.email || 'Administrador';

    // Evitar llamadas duplicadas concurrentes si ya se cargó la vista para este usuario
    const userId = user.id || user.email;
    if (currentAuthenticatedUserId !== userId) {
        currentAuthenticatedUserId = userId;
        loadGames();
    }
    renderAdminPsPlus();
}

function setupUnauthenticatedView() {
    currentAuthenticatedUserId = null;
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');
    if (loginScreen) loginScreen.style.display = 'flex';
    if (adminDashboard) adminDashboard.style.display = 'none';
}

function showConfigAlert(msg) {
    const box = document.getElementById('loginAlertBox');
    if (box) {
        box.style.display = 'block';
        box.style.background = 'rgba(239, 68, 68, 0.15)';
        box.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        box.style.color = '#FCA5A5';
        box.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Configuración requerida:</strong> ${msg}`;
    }
}


/**
let currentAuthMode = 'login'; // 'login' o 'register'

function setAuthMode(mode) {
    currentAuthMode = mode;
    const tabLogin = document.getElementById('btnTabLogin');
    const tabRegister = document.getElementById('btnTabRegister');
    const btnSubmitText = document.getElementById('btnSubmitText');
    const authHintText = document.getElementById('authHintText');
    const loginAlertBox = document.getElementById('loginAlertBox');

    if (loginAlertBox) loginAlertBox.style.display = 'none';

    if (mode === 'register') {
        if (tabRegister) {
            tabRegister.style.background = 'var(--color-primary)';
            tabRegister.style.color = '#000';
        }
        if (tabLogin) {
            tabLogin.style.background = 'transparent';
            tabLogin.style.color = 'var(--text-muted)';
        }
        if (btnSubmitText) btnSubmitText.textContent = 'Crear Administrador';
        if (authHintText) authHintText.textContent = 'Tu contraseña debe tener al menos 6 caracteres.';
    } else {
        if (tabLogin) {
            tabLogin.style.background = 'var(--color-primary)';
            tabLogin.style.color = '#000';
        }
        if (tabRegister) {
            tabRegister.style.background = 'transparent';
            tabRegister.style.color = 'var(--text-muted)';
        }
        if (btnSubmitText) btnSubmitText.textContent = 'Iniciar Sesión';
        if (authHintText) authHintText.textContent = 'Ingresá tu correo y contraseña autorizados.';
    }
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    if (currentAuthMode === 'register') {
        await handleRegister(e);
    } else {
        await handleLogin(e);
    }
}

async function handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('btnLoginSubmit');

    const sb = initSupabase();
    if (!sb) {
        showToast("Configurá 'supabase-config.js' con tu URL y clave anónima.", "error");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verificando...`;

    try {
        const loginPromise = sb.auth.signInWithPassword({ email, password });
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Tiempo de espera agotado. Verificá tu conexión a internet.")), 15000)
        );

        const { data, error } = await Promise.race([loginPromise, timeoutPromise]);
        if (error) {
            const isInvalid = error.message.toLowerCase().includes("invalid login") || error.message.toLowerCase().includes("invalid_grant");
            const isNotConfirmed = error.message.toLowerCase().includes("email not confirmed");
            
            if (isNotConfirmed) {
                showToast("El correo aún no ha sido confirmado. Revisá tu bandeja de entrada o confirmalo en Supabase.", "error");
            } else if (isInvalid) {
                showToast("Correo o contraseña incorrectos.", "error");
                const alertBox = document.getElementById('loginAlertBox');
                if (alertBox) {
                    alertBox.style.display = 'block';
                    alertBox.style.background = 'rgba(239, 68, 68, 0.12)';
                    alertBox.style.border = '1px solid rgba(239, 68, 68, 0.3)';
                    alertBox.style.color = '#FCA5A5';
                    alertBox.innerHTML = `<strong>¿No tenés usuario aún?</strong> Hacé clic en la pestaña <strong>"Crear Admin"</strong> para registrar tu cuenta con este correo y contraseña.`;
                }
            } else {
                showToast(error.message, "error");
            }
        } else {
            showToast("¡Bienvenido al panel de administración!", "success");
            setupAuthenticatedView(data.user);
        }
    } catch (err) {
        showToast("Error de conexión: " + err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Iniciar Sesión`;
    }
}

async function handleRegister(e) {
    if (e && e.preventDefault) e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('btnLoginSubmit');

    const sb = initSupabase();
    if (!sb) {
        showToast("Configurá 'supabase-config.js'.", "error");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creando cuenta...`;

    try {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) {
            showToast("Error al registrar: " + error.message, "error");
        } else if (data && data.session) {
            showToast("¡Cuenta creada e inicio de sesión exitoso!", "success");
            setupAuthenticatedView(data.user);
        } else {
            showToast("¡Usuario registrado con éxito!", "success");
            const alertBox = document.getElementById('loginAlertBox');
            if (alertBox) {
                alertBox.style.display = 'block';
                alertBox.style.background = 'rgba(16, 185, 129, 0.15)';
                alertBox.style.border = '1px solid rgba(16, 185, 129, 0.4)';
                alertBox.style.color = '#6EE7B7';
                alertBox.innerHTML = `<strong>¡Registro enviado!</strong> Si tenés la confirmación de email activada en Supabase, confirmá el correo que te llegó a <strong>${email}</strong> para poder iniciar sesión.`;
            }
        }
    } catch (err) {
        showToast("Error de conexión: " + err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-user-plus"></i> <span id="btnSubmitText">Crear Administrador</span>`;
    }
}

async function handleLogout() {
    currentAuthenticatedUserId = null;
    const sb = initSupabase();
    if (sb) {
        await sb.auth.signOut();
    }
    showToast("Sesión cerrada correctamente", "info");
    setupUnauthenticatedView();
}


/**
 * 3. CARGA DE JUEGOS DESDE SUPABASE
 */
async function loadGames() {
    if (isLoadingGames) return;
    isLoadingGames = true;

    const sb = initSupabase();
    if (!sb) {
        isLoadingGames = false;
        return;
    }

    try {
        const fetchPromise = sb
            .from('games')
            .select('*')
            .order('id', { ascending: false });

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Tiempo de espera agotado al conectar con Supabase.")), 15000)
        );

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

        if (error) {
            showToast("Error al cargar juegos: " + error.message, "error");
            return;
        }

        const validDbGames = [];
        (data || []).forEach(g => {
            if (g.title === '__ps_plus_plans__' || g.category === 'psplus_config') {
                try {
                    const customPlans = JSON.parse(g.description);
                    if (customPlans && typeof PS_PLUS_PLANS !== 'undefined') {
                        ['PS5', 'PS4'].forEach(platform => {
                            if (customPlans[platform]) {
                                ['essential', 'extra', 'deluxe'].forEach(tier => {
                                    if (customPlans[platform][tier] && customPlans[platform][tier].prices) {
                                        PS_PLUS_PLANS[platform][tier].prices = {
                                            ...PS_PLUS_PLANS[platform][tier].prices,
                                            ...customPlans[platform][tier].prices
                                        };
                                    }
                                });
                            }
                        });
                        renderAdminPsPlus();
                    }
                } catch(e) {}
            } else if (g.title === '__offers_showcase__' || g.category === 'offers_config') {
                try {
                    const customOffers = JSON.parse(g.description);
                    if (Array.isArray(customOffers)) {
                        OFERTAS_SHOWCASE_DATA = customOffers;
                        try {
                            localStorage.setItem('zd_offers_showcase', g.description);
                        } catch(e) {}
                    }
                } catch(e) {}
            } else {
                validDbGames.push(g);
            }
        });

        const dbGames = validDbGames.map(g => {
            const resolvedImg = resolveGameCover(g.image, g.title);
            const overridePrice = getUpdatedPriceForGame(g);
            return {
                ...g,
                image: resolvedImg,
                ...(overridePrice || {})
            };
        });

        // Fusionar con los juegos locales de games.js para que aparezcan de inmediato en el panel
        if (typeof GAMES_DATA !== 'undefined' && Array.isArray(GAMES_DATA)) {
            const dbTitles = new Set(dbGames.map(g => (g.title || '').toLowerCase().trim()));
            const missingLocal = GAMES_DATA
                .filter(g => !dbTitles.has((g.title || '').toLowerCase().trim()))
                .map(g => {
                    const override = getUpdatedPriceForGame(g);
                    return {
                        id: g.id,
                        title: g.title,
                        platforms: g.platforms || ["PS4", "PS5"],
                        category: g.category || "accion",
                        price_primary: override?.price_primary ?? (g.pricePrimary || 0),
                        price_secondary: override?.price_secondary ?? (g.priceSecondary || null),
                        price_primary_ps4: override?.price_primary_ps4 ?? (g.pricePrimaryPS4 || null),
                        price_secondary_ps4: override?.price_secondary_ps4 ?? (g.priceSecondaryPS4 || null),
                        price_ps3: null,
                        is_offer: Boolean(g.isOffer),
                        old_price_primary: g.oldPricePrimary || null,
                        discount: g.discount || null,
                        image: resolveGameCover(g.image, g.title),
                        description: g.description || "",
                        genre: g.genre || "",
                        languages: g.languages || "Español Latino, Inglés",
                        size: g.size || "Aprox. 50 GB",
                        availability: g.availability || (g.inStock === false ? 'sin_stock' : 'disponible'),
                        is_featured: Boolean(g.isFeatured)
                    };
                });

            allGames = [...dbGames, ...missingLocal];
        } else {
            allGames = dbGames;
        }

        // Sincronizar automáticamente en Supabase si el administrador está logueado
        syncFixedCoversToSupabase(sb, data || []);
        syncUpdatedPricesToSupabase(sb, data || []);
        syncMissingGamesToSupabase(sb, data || []);

        updateMetrics();
        filterGamesList();
        populateOfferGameSelect();
        renderAdminOffersView();
    } catch (err) {
        console.error("Error al obtener catálogo:", err);
        showToast("No se pudo conectar a la base de datos: " + (err.message || 'Error de red'), "error");
    } finally {
        isLoadingGames = false;
    }
}

async function syncMissingGamesToSupabase(sb, rawData) {
    try {
        const { data: { session } } = await sb.auth.getSession();
        if (!session || !session.user) return;

        const existingTitles = new Set((rawData || []).map(g => (g.title || '').trim().toLowerCase()));
        const toInsert = [];

        if (typeof GAMES_DATA !== 'undefined' && Array.isArray(GAMES_DATA)) {
            for (const g of GAMES_DATA) {
                const normTitle = (g.title || '').trim().toLowerCase();
                if (!existingTitles.has(normTitle)) {
                    const override = getUpdatedPriceForGame(g);
                    toInsert.push({
                        title: g.title,
                        platforms: g.platforms || ["PS4", "PS5"],
                        category: g.category || "accion",
                        price_primary: override?.price_primary ?? (g.pricePrimary || 0),
                        price_secondary: override?.price_secondary ?? (g.priceSecondary || null),
                        price_primary_ps4: override?.price_primary_ps4 ?? (g.pricePrimaryPS4 || null),
                        price_secondary_ps4: override?.price_secondary_ps4 ?? (g.priceSecondaryPS4 || null),
                        price_ps3: null,
                        is_offer: Boolean(g.isOffer),
                        old_price_primary: g.oldPricePrimary || null,
                        discount: g.discount || null,
                        image: resolveGameCover(g.image, g.title),
                        description: g.description || "",
                        genre: g.genre || "",
                        languages: g.languages || "Español Latino, Inglés",
                        size: g.size || "Aprox. 50 GB",
                        availability: g.availability || (g.inStock === false ? 'sin_stock' : 'disponible'),
                        is_featured: Boolean(g.isFeatured)
                    });
                    existingTitles.add(normTitle);
                }
            }
        }

        if (toInsert.length > 0) {
            console.log(`[ZONA DIGITAL] Guardando automáticamente ${toInsert.length} juegos nuevos en Supabase...`);
            const { error } = await sb.from('games').insert(toInsert);
            if (!error) {
                console.log(`[ZONA DIGITAL] ¡${toInsert.length} juegos nuevos sincronizados con Supabase!`);
            } else {
                console.warn("[ZONA DIGITAL] Aviso al insertar juegos nuevos:", error.message);
            }
        }
    } catch (e) {
        console.warn("Aviso al auto-sincronizar nuevos juegos en Supabase:", e);
    }
}

async function syncUpdatedPricesToSupabase(sb, rawData) {
    try {
        const { data: { session } } = await sb.auth.getSession();
        if (!session || !session.user) return;

        for (const g of rawData) {
            const override = getUpdatedPriceForGame(g);
            if (override) {
                const diff = 
                    (override.price_primary !== undefined && Number(g.price_primary) !== Number(override.price_primary)) ||
                    (override.price_secondary !== undefined && Number(g.price_secondary) !== Number(override.price_secondary)) ||
                    (override.price_primary_ps4 !== undefined && Number(g.price_primary_ps4) !== Number(override.price_primary_ps4)) ||
                    (override.price_secondary_ps4 !== undefined && Number(g.price_secondary_ps4) !== Number(override.price_secondary_ps4)) ||
                    (override.is_offer !== undefined && Boolean(g.is_offer) !== Boolean(override.is_offer));

                if (diff) {
                    await sb.from('games').update(override).eq('id', g.id);
                    console.log(`[ZONA DIGITAL] Precios actualizados en Supabase para "${g.title}"`);
                }
            }
        }
    } catch (e) {
        console.warn("Aviso al sincronizar precios en Supabase:", e);
    }
}

async function syncFixedCoversToSupabase(sb, rawData) {
    try {
        const { data: { session } } = await sb.auth.getSession();
        if (!session || !session.user) return;

        for (const g of rawData) {
            const resolved = resolveGameCover(g.image, g.title);
            if (resolved && resolved !== g.image) {
                await sb.from('games').update({ image: resolved }).eq('id', g.id);
                console.log(`[ZONA DIGITAL] Portada actualizada en Supabase para "${g.title}": ${resolved}`);
            }
        }
    } catch (e) {
        console.warn("Aviso al auto-sincronizar portadas en Supabase:", e);
    }
}


/**
 * 4. MÉTRICAS DEL PANEL
 */
function updateMetrics() {
    const total = allGames.length;
    const available = allGames.filter(g => (g.availability || 'disponible') === 'disponible').length;
    const out = allGames.filter(g => g.availability === 'sin_stock').length;
    const upcoming = allGames.filter(g => g.availability === 'proximamente').length;

    document.getElementById('statTotalGames').textContent = total;
    document.getElementById('statAvailableGames').textContent = available;
    document.getElementById('statOutGames').textContent = out;
    document.getElementById('statUpcomingGames').textContent = upcoming;
}


/**
 * 5. FILTRADO Y BÚSQUEDA
 */
function filterGamesList() {
    const query = (document.getElementById('adminSearchInput').value || '').toLowerCase().trim();
    const platFilter = document.getElementById('adminPlatformFilter').value;
    const availFilter = document.getElementById('adminAvailabilityFilter').value;

    let filtered = [...allGames];

    // Filtro texto
    if (query) {
        filtered = filtered.filter(g => 
            (g.title && g.title.toLowerCase().includes(query)) ||
            (g.genre && g.genre.toLowerCase().includes(query)) ||
            (g.category && g.category.toLowerCase().includes(query))
        );
    }

    // Filtro plataforma
    if (platFilter !== 'all') {
        filtered = filtered.filter(g => g.platforms && g.platforms.includes(platFilter));
    }

    // Filtro disponibilidad
    if (availFilter !== 'all') {
        filtered = filtered.filter(g => (g.availability || 'disponible') === availFilter);
    }

    renderGamesTable(filtered);
}


/**
 * 6. RENDERIZADO DE LA TABLA
 */
function renderGamesTable(games) {
    const tbody = document.getElementById('gamesTableBody');
    const emptyBox = document.getElementById('emptyStateBox');

    if (!games || games.length === 0) {
        tbody.innerHTML = '';
        emptyBox.style.display = 'block';
        return;
    }

    emptyBox.style.display = 'none';

    tbody.innerHTML = games.map(game => {
        // Badges de plataformas
        const platBadges = (game.platforms || []).map(p => {
            const cls = p.toLowerCase();
            return `<span class="plat-badge ${cls}">${p}</span>`;
        }).join('');

        // Resumen de precios
        let priceSummaryHtml = '';
        if (game.platforms && game.platforms.includes('PS3') && game.price_ps3) {
            priceSummaryHtml += `<div class="price-item"><span>PS3:</span> <strong>$ ${Number(game.price_ps3).toLocaleString('es-AR')}</strong></div>`;
        }
        
        const hasDiffPS4 = (game.price_primary_ps4 && Number(game.price_primary_ps4) !== Number(game.price_primary)) ||
                           (game.price_secondary_ps4 && Number(game.price_secondary_ps4) !== Number(game.price_secondary));

        if (hasDiffPS4) {
            priceSummaryHtml += `<div class="price-item"><span style="color:#60A5FA;">PS4:</span> Prim <strong>$ ${Number(game.price_primary_ps4 || game.price_primary).toLocaleString('es-AR')}</strong> / Sec $ ${Number(game.price_secondary_ps4 || game.price_secondary).toLocaleString('es-AR')}</div>`;
            priceSummaryHtml += `<div class="price-item"><span style="color:#A78BFA;">PS5:</span> Prim <strong>$ ${Number(game.price_primary).toLocaleString('es-AR')}</strong> / Sec $ ${Number(game.price_secondary || 0).toLocaleString('es-AR')}</div>`;
        } else {
            if (game.price_primary) {
                priceSummaryHtml += `<div class="price-item"><span>Primaria:</span> <strong>$ ${Number(game.price_primary).toLocaleString('es-AR')}</strong></div>`;
            }
            if (game.price_secondary) {
                priceSummaryHtml += `<div class="price-item"><span>Secundaria:</span> $ ${Number(game.price_secondary).toLocaleString('es-AR')}</div>`;
            }
        }

        if (!priceSummaryHtml) {
            priceSummaryHtml = `<span style="color: var(--text-dim); font-size: 0.8rem;">Sin precios definidos</span>`;
        }

        // Tags adicionales
        let extraTags = `<span class="pill-tag pill-cat">${escapeHtml((game.category || 'JUEGO').toUpperCase())}</span>`;
        if (game.is_offer) extraTags += `<span class="pill-tag pill-offer">OFERTA ${escapeHtml(game.discount || '')}</span>`;
        if (game.is_featured) extraTags += `<span class="pill-tag pill-featured">DESTACADO</span>`;

        // Disponibilidad actual
        const currentAvail = game.availability || 'disponible';

        return `
            <tr data-id="${game.id}">
                <td>
                    <img src="${getImageUrl(game.image, game.title)}" alt="${escapeHtml(game.title)}" class="game-thumb" loading="lazy" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';">
                </td>
                <td>
                    <div class="game-title-text">${escapeHtml(game.title)}</div>
                    <div class="game-meta-tags">${extraTags}</div>
                </td>
                <td>
                    <div class="plat-badges">${platBadges}</div>
                </td>
                <td>
                    <div class="price-cell-box">${priceSummaryHtml}</div>
                </td>
                <td>
                    <select class="availability-select ${currentAvail}" onchange="changeAvailability(${game.id}, this.value, this)">
                        <option value="disponible" ${currentAvail === 'disponible' ? 'selected' : ''}>🟢 Disponible</option>
                        <option value="sin_stock" ${currentAvail === 'sin_stock' ? 'selected' : ''}>🔴 Sin Stock</option>
                        <option value="proximamente" ${currentAvail === 'proximamente' ? 'selected' : ''}>🟣 Próximamente</option>
                    </select>
                </td>
                <td style="text-align: right;">
                    <div class="action-buttons" style="justify-content: flex-end;">
                        <button type="button" class="btn-action-icon edit" onclick="openGameModal(${game.id})" title="Editar juego">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="btn-action-icon delete" onclick="confirmDeleteGame(${game.id}, '${escapeHtml(game.title)}')" title="Eliminar juego">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}


/**
 * 7. CAMBIO RÁPIDO DE DISPONIBILIDAD DIRECTO DESDE LA TABLA
 */
async function changeAvailability(gameId, newStatus, selectElement) {
    const sb = initSupabase();
    if (!sb) return;

    selectElement.disabled = true;

    try {
        const { error } = await sb
            .from('games')
            .update({ availability: newStatus, updated_at: new Date().toISOString() })
            .eq('id', gameId);

        if (error) {
            showToast("No se pudo actualizar el estado: " + error.message, "error");
            loadGames(); // revertir visualmente
            return;
        }

        // Actualizar datos en memoria
        const game = allGames.find(g => g.id === gameId);
        if (game) game.availability = newStatus;

        selectElement.className = `availability-select ${newStatus}`;
        updateMetrics();
        showToast(`Estado de "${game ? game.title : 'juego'}" actualizado a ${newStatus.replace('_', ' ').toUpperCase()}`, "success");
    } catch (err) {
        showToast("Error de conexión al actualizar estado", "error");
    } finally {
        selectElement.disabled = false;
    }
}


/**
 * 8. MODAL DE CREACIÓN / EDICIÓN
 */
function openGameModal(gameId = null) {
    const form = document.getElementById('gameForm');
    form.reset();
    selectedCoverFile = null;
    document.getElementById('uploadFileNameHint').textContent = '';

    const titleEl = document.getElementById('modalFormTitle');
    const idInput = document.getElementById('formGameId');

    if (gameId) {
        const game = allGames.find(g => g.id === gameId);
        if (!game) return;

        titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar: ${escapeHtml(game.title)}`;
        idInput.value = game.id;

        document.getElementById('formTitle').value = game.title || '';
        document.getElementById('formCategory').value = game.category || 'accion';
        
        // Plataformas
        const plats = game.platforms || [];
        setCheckbox('checkPS5', plats.includes('PS5'));
        setCheckbox('checkPS4', plats.includes('PS4'));
        setCheckbox('checkPS3', plats.includes('PS3'));

        // Disponibilidad
        setAvailabilityRadio(game.availability || 'disponible');

        // Precios
        document.getElementById('formPricePrimary').value = game.price_primary || '';
        document.getElementById('formPriceSecondary').value = game.price_secondary || '';
        document.getElementById('formPricePrimaryPS4').value = game.price_primary_ps4 || '';
        document.getElementById('formPriceSecondaryPS4').value = game.price_secondary_ps4 || '';
        document.getElementById('formPricePS3').value = game.price_ps3 || '';

        // Oferta
        const isOffer = Boolean(game.is_offer);
        document.getElementById('formIsOffer').checked = isOffer;
        toggleOfferInputs(isOffer);
        document.getElementById('formOldPricePrimary').value = game.old_price_primary || '';
        document.getElementById('formDiscount').value = game.discount || '';

        // Destacado
        document.getElementById('formIsFeatured').checked = Boolean(game.is_featured);

        // Portada
        const resolvedCover = resolveGameCover(game.image, game.title);
        document.getElementById('formImageUrl').value = resolvedCover || '';
        updateCoverPreview(resolvedCover || '', game.title);

        // Detalles
        document.getElementById('formGenre').value = game.genre || '';
        document.getElementById('formLanguages').value = game.languages || 'Español Latino, Inglés';
        document.getElementById('formSize').value = game.size || '';
        document.getElementById('formDescription').value = game.description || '';

    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-plus-circle"></i> Agregar Nuevo Juego`;
        idInput.value = '';

        // Valores por defecto
        setCheckbox('checkPS5', true);
        setCheckbox('checkPS4', true);
        setCheckbox('checkPS3', false);
        setAvailabilityRadio('disponible');
        toggleOfferInputs(false);
        updateCoverPreview('');
    }

    updatePriceInputsVisibility();
    document.getElementById('gameEditModal').classList.add('active');
}

function closeGameModal() {
    document.getElementById('gameEditModal').classList.remove('active');
}

function setCheckbox(id, checked) {
    const el = document.getElementById(id);
    if (el) {
        el.checked = checked;
        togglePlatformChip(el);
    }
}

function togglePlatformChip(input) {
    const parent = input.closest('.platform-chip');
    if (parent) {
        if (input.checked) parent.classList.add('checked');
        else parent.classList.remove('checked');
    }
}

function updatePriceInputsVisibility() {
    const ps3Checked = document.getElementById('checkPS3').checked;
    const ps3Section = document.getElementById('pricesPS3Section');
    if (ps3Section) {
        ps3Section.style.display = ps3Checked ? 'block' : 'none';
    }
}

function setAvailabilityRadio(val) {
    const radios = document.querySelectorAll('input[name="formAvailability"]');
    radios.forEach(r => {
        r.checked = (r.value === val);
    });
    updateAvailabilityRadioUi();
}

function updateAvailabilityRadioUi() {
    const selected = document.querySelector('input[name="formAvailability"]:checked');
    const val = selected ? selected.value : 'disponible';
    
    document.querySelectorAll('.avail-card-option').forEach(opt => opt.classList.remove('selected'));
    
    if (val === 'disponible') document.getElementById('optDispo').classList.add('selected');
    if (val === 'sin_stock') document.getElementById('optStock').classList.add('selected');
    if (val === 'proximamente') document.getElementById('optProxi').classList.add('selected');
}

function toggleOfferInputs(isOffer) {
    const box = document.getElementById('offerInputsBox');
    if (box) {
        box.style.display = isOffer ? 'flex' : 'none';
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        selectedCoverFile = file;
        document.getElementById('uploadFileNameHint').textContent = file.name;
        
        // Vista previa con FileReader local
        const reader = new FileReader();
        reader.onload = (event) => {
            updateCoverPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function updateCoverPreview(src, title) {
    const img = document.getElementById('coverPreviewImg');
    const icon = document.getElementById('coverPlaceholderIcon');

    const resolved = resolveGameCover(src, title);
    if (resolved && resolved.trim() !== '') {
        img.onerror = () => {
            img.onerror = null;
            img.src = FALLBACK_IMAGE;
        };
        img.src = getImageUrl(resolved, title);
        img.style.display = 'block';
        icon.style.display = 'none';
    } else {
        img.style.display = 'none';
        icon.style.display = 'block';
    }
}


/**
 * 9. GUARDAR / ACTUALIZAR JUEGO
 */
async function saveGame(e) {
    e.preventDefault();
    const sb = initSupabase();
    if (!sb) return;

    const btn = document.getElementById('btnSaveGame');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;

    try {
        const gameId = document.getElementById('formGameId').value;
        const title = document.getElementById('formTitle').value.trim();

        // Plataformas seleccionadas
        const platforms = [];
        if (document.getElementById('checkPS5').checked) platforms.push('PS5');
        if (document.getElementById('checkPS4').checked) platforms.push('PS4');
        if (document.getElementById('checkPS3').checked) platforms.push('PS3');

        if (platforms.length === 0) {
            showToast("Seleccioná al menos una plataforma (PS5, PS4 o PS3)", "error");
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios`;
            return;
        }

        // Estado de disponibilidad
        const availRadio = document.querySelector('input[name="formAvailability"]:checked');
        const availability = availRadio ? availRadio.value : 'disponible';

        // Manejo de la imagen: si el usuario subió un archivo, lo guardamos en Supabase Storage
        let imageUrl = document.getElementById('formImageUrl').value.trim();

        if (selectedCoverFile) {
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up fa-spin"></i> Subiendo imagen...`;
            const fileExt = selectedCoverFile.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
            const filePath = `covers/${fileName}`;

            const { data: uploadData, error: uploadError } = await sb.storage
                .from(SUPABASE_CONFIG.storageBucket)
                .upload(filePath, selectedCoverFile, { upsert: true });

            if (uploadError) {
                console.error("Error al subir portada:", uploadError);
                showToast("No se pudo subir la portada: " + uploadError.message, "error");
            } else {
                const { data: publicUrlData } = sb.storage
                    .from(SUPABASE_CONFIG.storageBucket)
                    .getPublicUrl(filePath);
                
                if (publicUrlData && publicUrlData.publicUrl) {
                    imageUrl = publicUrlData.publicUrl;
                }
            }
        }

        if (!imageUrl) {
            imageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
        }

        // Construcción del objeto de juego
        const gamePayload = {
            title: title,
            platforms: platforms,
            category: document.getElementById('formCategory').value,
            availability: availability,
            price_primary: parseNumber(document.getElementById('formPricePrimary').value) || 0,
            price_secondary: parseNumber(document.getElementById('formPriceSecondary').value),
            price_primary_ps4: parseNumber(document.getElementById('formPricePrimaryPS4').value),
            price_secondary_ps4: parseNumber(document.getElementById('formPriceSecondaryPS4').value),
            price_ps3: parseNumber(document.getElementById('formPricePS3').value),
            is_offer: document.getElementById('formIsOffer').checked,
            old_price_primary: parseNumber(document.getElementById('formOldPricePrimary').value),
            discount: document.getElementById('formDiscount').value.trim() || null,
            is_featured: document.getElementById('formIsFeatured').checked,
            image: imageUrl,
            genre: document.getElementById('formGenre').value.trim(),
            languages: document.getElementById('formLanguages').value.trim(),
            size: document.getElementById('formSize').value.trim(),
            description: document.getElementById('formDescription').value.trim(),
            updated_at: new Date().toISOString()
        };

        let resultError = null;

        if (gameId) {
            // Actualizar juego existente
            const { error } = await sb
                .from('games')
                .update(gamePayload)
                .eq('id', gameId);
            resultError = error;
        } else {
            // Insertar nuevo juego
            const { error } = await sb
                .from('games')
                .insert([gamePayload]);
            resultError = error;
        }

        if (resultError) {
            showToast("Error al guardar: " + resultError.message, "error");
        } else {
            showToast(gameId ? "¡Juego actualizado con éxito!" : "¡Juego agregado al catálogo con éxito!", "success");
            closeGameModal();
            loadGames();
        }

    } catch (err) {
        showToast("Error inesperado: " + err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios`;
    }
}


/**
 * 10. ELIMINAR JUEGO (CON CONFIRMACIÓN OBLIGATORIA)
 */
function confirmDeleteGame(id, title) {
    currentGameToDelete = id;
    document.getElementById('deleteGameTitle').textContent = `"${title}"`;
    document.getElementById('deleteConfirmModal').classList.add('active');
}

function closeDeleteModal() {
    currentGameToDelete = null;
    document.getElementById('deleteConfirmModal').classList.remove('active');
}

async function executeDeleteGame() {
    if (!currentGameToDelete) return;
    const sb = initSupabase();
    if (!sb) return;

    const btn = document.getElementById('btnConfirmDelete');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Eliminando...`;

    try {
        const { error } = await sb
            .from('games')
            .delete()
            .eq('id', currentGameToDelete);

        if (error) {
            showToast("No se pudo eliminar el juego: " + error.message, "error");
        } else {
            showToast("Juego eliminado del catálogo", "success");
            closeDeleteModal();
            loadGames();
        }
    } catch (err) {
        showToast("Error al eliminar juego: " + err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-trash"></i> Eliminar`;
    }
}


/**
 * 11. MIGRACIÓN INICIAL SEGURA (Regla 5: Sin duplicar ni perder productos)
 * Importa los juegos existentes en games.js directo a Supabase con un solo clic.
 */
async function migrateInitialCatalog() {
    const sb = initSupabase();
    if (!sb) return;

    const btn = document.getElementById('btnMigrateData');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Verificando catálogo...`;

    try {
        // 1. Obtener juegos que ya existen en la base para no duplicar
        const { data: existingGames, error: fetchErr } = await sb
            .from('games')
            .select('title');

        if (fetchErr) {
            showToast("Error al verificar base de datos: " + fetchErr.message, "error");
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Migrar Catálogo Actual`;
            return;
        }

        const existingTitles = new Set((existingGames || []).map(g => (g.title || '').trim().toLowerCase()));

        // 2. Preparar lista de juegos locales de games.js
        const toInsert = [];

        // Juegos PS4 / PS5 (GAMES_DATA)
        if (typeof GAMES_DATA !== 'undefined' && Array.isArray(GAMES_DATA)) {
            for (const g of GAMES_DATA) {
                if (!existingTitles.has((g.title || '').trim().toLowerCase())) {
                    toInsert.push({
                        title: g.title,
                        platforms: g.platforms || ["PS4", "PS5"],
                        category: g.category || "accion",
                        price_primary: g.pricePrimary || 0,
                        price_secondary: g.priceSecondary || null,
                        price_primary_ps4: g.pricePrimaryPS4 || null,
                        price_secondary_ps4: g.priceSecondaryPS4 || null,
                        price_ps3: null,
                        is_offer: Boolean(g.isOffer),
                        old_price_primary: g.oldPricePrimary || null,
                        discount: g.discount || null,
                        image: g.image || "",
                        description: g.description || "",
                        genre: g.genre || "",
                        languages: g.languages || "Español Latino, Inglés",
                        size: g.size || "Aprox. 50 GB",
                        availability: g.availability || ((g.inStock === false) ? 'sin_stock' : 'disponible'),
                        is_featured: Boolean(g.isFeatured)
                    });
                    existingTitles.add((g.title || '').trim().toLowerCase());
                }
            }
        }

        // Juegos PS3 (PS3_GAMES_DATA)
        if (typeof PS3_GAMES_DATA !== 'undefined' && Array.isArray(PS3_GAMES_DATA)) {
            for (const g of PS3_GAMES_DATA) {
                if (!existingTitles.has((g.title || '').trim().toLowerCase())) {
                    toInsert.push({
                        title: g.title,
                        platforms: ["PS3"],
                        category: "accion",
                        price_primary: null,
                        price_secondary: null,
                        price_ps3: g.price || 0,
                        is_offer: false,
                        image: g.image || "",
                        description: g.description || "",
                        genre: "PlayStation 3",
                        languages: "Español, Inglés",
                        size: "Digital",
                        availability: 'disponible',
                        is_featured: false,
                        is_bundle: Boolean(g.isBundle),
                        bundle_games: g.bundleGames || []
                    });
                    existingTitles.add((g.title || '').trim().toLowerCase());
                }
            }
        }

        if (toInsert.length === 0) {
            showToast("Todos los juegos actuales ya se encuentran en la base de datos.", "info");
        } else {
            btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up fa-spin"></i> Subiendo ${toInsert.length} juegos...`;
            
            const { error: insertErr } = await sb
                .from('games')
                .insert(toInsert);

            if (insertErr) {
                showToast("Error al importar: " + insertErr.message, "error");
            } else {
                showToast(`¡Excelente! Se migraron ${toInsert.length} juegos sin duplicar nada.`, "success");
                loadGames();
            }
        }

    } catch (err) {
        showToast("Error durante la migración: " + err.message, "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Migrar Catálogo Actual`;
    }
}


/**
 * 12. UTILIDADES
 */
function getImageUrl(imgPath, title) {
    let p = (imgPath || '').trim();
    const t = (title || '').toLowerCase().trim();

    if (p.toLowerCase() === 'bttle1.wedp' || p.includes('bttle1.wedp')) {
        p = 'bttle1.webp';
    }

    if (!p || p.includes('unsplash.com')) {
        if (t.includes('mortal kombat 1') && !t.includes('xl')) p = 'mk1.jpg';
        else if (t.includes('mortal kombat xl')) p = 'mkxl.webp';
        else if (t.includes('battlefield 1')) p = 'bttle1.webp';
        else if (t.includes('battlefield 6')) p = 'battle6.avif';
        else if (t.includes('fc 25') || t.includes('fifa 25')) p = 'fc25.jpg';
        else if (t.includes('spider-man 2')) p = 'spiderman2.jpg';
        else if (t.includes('god of war ragnar')) p = 'gow-ragnarok.jpg';
        else if (t.includes('sparking')) p = 'sparking-zero.jpg';
        else if (t.includes('last of us')) p = 'tlou-part1.jpg';
        else if (t.includes('elden ring')) p = 'elden-ring.jpg';
        else if (t.includes('resident evil 4')) p = 're4-remake.jpg';
        else if (t.includes('hogwarts')) p = 'hogwarts-legacy.jpg';
        else if (t.includes('black ops iii') || t.includes('black ops 3')) p = 'cod-bo3.jpg';
        else if (t.includes('black ops ii') || t.includes('black ops 2')) p = 'cod-bo2.jpg';
        else if (t.includes('trilogía completa') || (t.includes('god of war') && t.includes('trilog'))) p = 'gow-trilogy-ps3.jpg';
        else if (t.includes('need for speed carbon') || t.includes('nfs carbon')) p = 'nfs-carbon.jpg';
        else if (t.includes('grand theft auto v') || t.includes('gta 5') || t.includes('gta v')) p = 'gta 5.jpg';
        // 14 Nuevos juegos
        else if (t.includes('arc raiders')) p = 'arc-raiders.jpg';
        else if (t.includes('borderlands 4')) p = 'borderlands-4.jpg';
        else if (t.includes('expedition 33') || t.includes('clair obscur')) p = 'expedition-33.jpg';
        else if (t.includes('lego') && t.includes('batman')) p = 'lego-batman.jpg';
        else if (t.includes('uncharted') && (t.includes('nathan drake') || t.includes('collection'))) p = 'uncharted-collection.jpg';
        else if (t.includes('unbound')) p = 'nfs-unbound.jpg';
        else if (t.includes('forza horizon 5')) p = 'forza-horizon-5.jpg';
        else if (t.includes('mafia') && t.includes('trilogy')) p = 'mafia-trilogy.jpg';
        else if (t.includes('mafia') && (t.includes('definitiva') || t.includes('definitive'))) p = 'mafia-definitive.jpg';
        else if (t.includes('god of war') && t.includes('deluxe')) p = 'god-of-war-deluxe.jpg';
        else if (t.includes('naruto') && t.includes('storm')) p = 'naruto-storm-trilogy.jpg';
        else if (t.includes('motogp')) p = 'motogp-25.jpg';
        else if (t.includes('little nightmares')) p = 'little-nightmares-2.jpg';
        else if (t.includes('modern warfare 4') || t.includes('mw4')) p = 'call of duty.jpg';
        // 27 Nuevos juegos
        else if (t.includes('dirt rally')) p = 'dirt-rally-2.jpg';
        else if (t.includes('until dawn')) p = 'until-dawn-2015.jpg';
        else if (t.includes('watch dogs') && !t.includes('watch dogs 2') && !t.includes('legion')) p = 'watch-dogs.jpg';
        else if (t.includes('legado de ladrones') || t.includes('legacy of thieves')) p = 'uncharted-legado-ladrones.jpg';
        else if (t.includes('infamous')) p = 'infamous-second-son.jpg';
        else if (t.includes('detroit')) p = 'detroit-become-human.jpg';
        else if (t.includes('forbidden west')) p = 'horizon-forbidden-west.jpg';
        else if (t.includes('cyberpunk')) p = 'cyberpunk-2077.jpg';
        else if (t.includes('wwe')) p = 'wwe-2k26.jpg';
        else if (t.includes("no man's sky") || t.includes("no mans sky")) p = 'no-mans-sky.jpg';
        else if (t.includes('heat') && t.includes('speed')) p = 'nfs-heat.jpg';
        else if (t.includes('resident evil 6') || t.includes('re6') || t.includes('resident evil vi')) p = 're6.jpg';
        else if (t.includes('storm 4')) p = 'naruto-storm-4.jpg';
        else if (t.includes('battlefront 2') || t.includes('battlefront ii')) p = 'sw-battlefront-2.jpg';
        else if (t.includes('super-villains') || t.includes('supervillains')) p = 'lego-dc-super-villains.jpg';
        else if (t.includes('jurassic')) p = 'jurassic-world-evolution-2.jpg';
        else if (t.includes('lote') && t.includes('red dead')) p = 'lote-red-dead-redemption.jpg';
        else if ((t.includes('last of us') || t.includes('tlou')) && (t.includes('parte 2') || t.includes('part 2') || t.includes('part ii'))) p = 'tlou-part2.jpg';
        else if (t.includes('outlast')) p = 'outlast-trinity.jpg';
        else if (t.includes('back 4 blood')) p = 'back-4-blood-ultimate.jpg';
        else if (t.includes('days gone')) p = 'days-gone.jpg';
        else if (t.includes('bloodborne')) p = 'bloodborne.jpg';
        else if (t.includes('mortal kombat 11') && !t.includes('injustice')) p = 'mk11-ultimate.jpg';
        else if (t.includes('mortal kombat 11') && t.includes('injustice')) p = 'mk11-injustice2-bundle.jpg';
        else if (t.includes('mortal kombat 1') && (t.includes('definitive') || t.includes('definitiva') || t.includes('edition'))) p = 'mk1-definitive.jpg';
        else if (t.includes('remake trilogy') || (t.includes('resident evil') && t.includes('trilogy') && !t.includes('village'))) p = 're-remake-trilogy.jpg';
        else if (t.includes('dead by daylight')) p = 'dead-by-daylight.jpg';
        else if (t.includes('silent hill')) p = 'silent-hill-2.jpg';
        else if (t.includes('fórmula 1') || t.includes('formula 1') || t.includes('f1 25') || t.includes('f1 24') || t.includes('f1 2026') || (t.includes('f1') && t.includes('pack'))) p = 'formula-1-pack-2026.jpg';
    }

    if (!p) return FALLBACK_IMAGE;
    if (p.startsWith('data:') || p.startsWith('http://') || p.startsWith('https://')) return p;
    if (p.startsWith('../')) return encodeURI(p);
    return encodeURI(`../${p}`);
}

function parseNumber(val) {
    if (val === '' || val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'circle-info';
    if (type === 'success') icon = 'circle-check';
    if (type === 'error') icon = 'circle-exclamation';

    toast.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}


/**
 * ==========================================================================
 * GESTOR DE PRECIOS DE PLAYSTATION PLUS EN EL ADMIN PANEL
 * ==========================================================================
 */
let adminPsPlusConsole = 'PS5';

function switchAdminSection(tabName) {
    const tabCat = document.getElementById('btnTabCatalog');
    const tabOffers = document.getElementById('btnTabOffers');
    const tabPs = document.getElementById('btnTabPsPlus');
    const viewCat = document.getElementById('sectionCatalogView');
    const viewOffers = document.getElementById('sectionOffersView');
    const viewPs = document.getElementById('sectionPsPlusView');

    if (tabCat) tabCat.classList.remove('active');
    if (tabOffers) tabOffers.classList.remove('active');
    if (tabPs) tabPs.classList.remove('active');

    if (viewCat) viewCat.style.display = 'none';
    if (viewOffers) viewOffers.style.display = 'none';
    if (viewPs) viewPs.style.display = 'none';

    if (tabName === 'offers') {
        if (tabOffers) tabOffers.classList.add('active');
        if (viewOffers) viewOffers.style.display = 'block';
        populateOfferGameSelect();
        renderAdminOffersView();
    } else if (tabName === 'psplus') {
        if (tabPs) tabPs.classList.add('active');
        if (viewPs) viewPs.style.display = 'block';
        renderAdminPsPlus();
    } else {
        if (tabCat) tabCat.classList.add('active');
        if (viewCat) viewCat.style.display = 'block';
    }
}

/**
 * ==========================================================================
 * GESTOR DE OFERTAS Y CARRUSEL EN EL ADMIN PANEL
 * ==========================================================================
 */

function populateOfferGameSelect() {
    const select = document.getElementById('adminOfferSelectGame');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">-- Seleccioná un juego del catálogo --</option>';

    // Ordenar juegos alfabéticamente
    const sorted = [...allGames]
        .filter(g => g.title && !g.title.startsWith('__'))
        .sort((a, b) => (a.title || '').localeCompare(b.title || ''));

    sorted.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        const offerTag = g.is_offer ? ' 🔥 (En Oferta)' : '';
        opt.textContent = `${g.title}${offerTag}`;
        select.appendChild(opt);
    });

    if (currentVal) select.value = currentVal;
}

function onAdminSelectGameForOffer() {
    const select = document.getElementById('adminOfferSelectGame');
    if (!select || !select.value) return;

    const gameId = select.value;
    const game = allGames.find(g => String(g.id) === String(gameId));
    if (!game) return;

    const newPriceInput = document.getElementById('adminOfferNewPrice');
    const oldPriceInput = document.getElementById('adminOfferOldPrice');
    const discountInput = document.getElementById('adminOfferDiscount');
    const carouselCheckbox = document.getElementById('adminOfferInCarousel');

    if (game.is_offer) {
        if (newPriceInput) newPriceInput.value = game.price_primary || '';
        if (oldPriceInput) oldPriceInput.value = game.old_price_primary || '';
        if (discountInput) discountInput.value = game.discount || '';
    } else {
        const curPrice = game.price_primary || 0;
        if (oldPriceInput) oldPriceInput.value = curPrice > 0 ? curPrice : '';
        if (newPriceInput) newPriceInput.value = curPrice > 0 ? Math.round(curPrice * 0.75) : '';
    }

    const inCarousel = Array.isArray(OFERTAS_SHOWCASE_DATA) && OFERTAS_SHOWCASE_DATA.some(c => 
        String(c.id) === String(game.id) || (c.title && c.title.toLowerCase().trim() === (game.title || '').toLowerCase().trim())
    );
    if (carouselCheckbox) carouselCheckbox.checked = inCarousel || true;

    calculateOfferDiscount();
}

function calculateOfferDiscount() {
    const newPrice = Number(document.getElementById('adminOfferNewPrice')?.value) || 0;
    const oldPrice = Number(document.getElementById('adminOfferOldPrice')?.value) || 0;
    const discountInput = document.getElementById('adminOfferDiscount');
    if (!discountInput) return;

    if (oldPrice > 0 && newPrice > 0 && newPrice < oldPrice) {
        const pct = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
        discountInput.value = `-${pct}%`;
    }
}

function renderAdminOffersView() {
    const tbody = document.getElementById('offersTableBody');
    const badgeCount = document.getElementById('badgeOffersCount');
    const activeCounter = document.getElementById('activeOffersCounter');
    if (!tbody) return;

    // Juegos activos en oferta (is_offer === true o presentes en OFERTAS_SHOWCASE_DATA)
    const offerGames = allGames.filter(g => {
        if (g.title && g.title.startsWith('__')) return false;
        if (g.is_offer) return true;
        if (Array.isArray(OFERTAS_SHOWCASE_DATA) && OFERTAS_SHOWCASE_DATA.some(c => 
            String(c.id) === String(g.id) || (c.title && c.title.toLowerCase().trim() === (g.title || '').toLowerCase().trim())
        )) return true;
        return false;
    });

    const count = offerGames.length;
    if (badgeCount) badgeCount.textContent = count;
    if (activeCounter) activeCounter.textContent = `${count} ${count === 1 ? 'juego' : 'juegos'}`;

    if (offerGames.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 36px 20px; color: var(--text-dim);">
                    <i class="fa-solid fa-fire" style="font-size: 2rem; color: rgba(255, 94, 0, 0.4); margin-bottom: 12px; display: block;"></i>
                    No hay juegos en oferta actualmente.<br>
                    <span style="font-size: 0.85rem;">Utilizá el formulario superior para poner un juego en oferta.</span>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = offerGames.map(game => {
        const img = getImageUrl(game.image, game.title);
        const inCarousel = Array.isArray(OFERTAS_SHOWCASE_DATA) && OFERTAS_SHOWCASE_DATA.some(c => 
            String(c.id) === String(game.id) || (c.title && c.title.toLowerCase().trim() === (game.title || '').toLowerCase().trim())
        );

        return `
            <tr>
                <td>
                    <img src="${img}" alt="${escapeHtml(game.title)}" class="game-thumb" onerror="this.src='${FALLBACK_IMAGE}'">
                </td>
                <td>
                    <strong style="color: var(--text-white); font-size: 0.95rem;">${escapeHtml(game.title)}</strong>
                    <div style="font-size: 0.78rem; color: var(--text-dim); margin-top: 3px;">
                        ${(game.platforms || []).join(' / ')} • ${escapeHtml(game.category || 'General')}
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="color: #FF5E00; font-weight: 700;">$</span>
                        <input type="number" class="offer-inline-price-input" value="${game.price_primary || 0}" 
                            onchange="updateOfferInlinePrice('${game.id}', 'price_primary', this.value)"
                            title="Precio de oferta">
                    </div>
                </td>
                <td>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span style="color: var(--text-dim); font-weight: 700;">$</span>
                        <input type="number" class="offer-inline-price-input" value="${game.old_price_primary || ''}" 
                            placeholder="Sin tachado"
                            onchange="updateOfferInlinePrice('${game.id}', 'old_price_primary', this.value)"
                            title="Precio tachado anterior">
                    </div>
                </td>
                <td>
                    <span class="badge" style="background: rgba(255, 94, 0, 0.15); color: #FF5E00; font-weight: 800; border: 1px solid rgba(255, 94, 0, 0.3);">
                        ${escapeHtml(game.discount || '-')}
                    </span>
                </td>
                <td style="text-align: center;">
                    <button type="button" class="btn-star-carousel ${inCarousel ? 'active' : ''}" 
                        onclick="toggleCarouselOffer('${game.id}')" 
                        title="${inCarousel ? 'Quitar del carrusel' : 'Mostrar en carrusel'}">
                        <i class="fa-${inCarousel ? 'solid' : 'regular'} fa-star"></i>
                        <span>${inCarousel ? 'En Carrusel' : 'No en carrusel'}</span>
                    </button>
                </td>
                <td style="text-align: right;">
                    <button type="button" class="btn-remove-offer" onclick="removeGameFromOffers('${game.id}')" title="Quitar de ofertas">
                        <i class="fa-solid fa-trash-can"></i>
                        <span>Quitar</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function addGameToOffers() {
    const select = document.getElementById('adminOfferSelectGame');
    const newPriceInput = document.getElementById('adminOfferNewPrice');
    const oldPriceInput = document.getElementById('adminOfferOldPrice');
    const discountInput = document.getElementById('adminOfferDiscount');
    const carouselCheckbox = document.getElementById('adminOfferInCarousel');

    if (!select || !select.value) {
        showToast("Por favor seleccioná un juego de la lista para ponerlo en oferta.", "error");
        return;
    }

    const gameId = select.value;
    const game = allGames.find(g => String(g.id) === String(gameId));
    if (!game) {
        showToast("No se encontró el juego seleccionado.", "error");
        return;
    }

    const newPrice = Number(newPriceInput?.value) || 0;
    const oldPrice = Number(oldPriceInput?.value) || null;
    let discount = (discountInput?.value || '').trim();

    if (!discount && oldPrice && newPrice && newPrice < oldPrice) {
        const pct = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
        discount = `-${pct}%`;
    }

    // Actualizar juego en memoria
    game.is_offer = true;
    if (newPrice > 0) game.price_primary = newPrice;
    game.old_price_primary = oldPrice;
    game.discount = discount || null;

    // Actualizar Carrusel
    if (typeof OFERTAS_SHOWCASE_DATA !== 'undefined' && Array.isArray(OFERTAS_SHOWCASE_DATA)) {
        const idx = OFERTAS_SHOWCASE_DATA.findIndex(c => 
            String(c.id) === String(game.id) || (c.title && c.title.toLowerCase().trim() === (game.title || '').toLowerCase().trim())
        );

        if (carouselCheckbox && carouselCheckbox.checked) {
            const showcaseItem = {
                id: game.id,
                title: game.title,
                image: resolveGameCover(game.image, game.title),
                price: game.price_primary,
                oldPrice: game.old_price_primary || (game.price_primary ? Math.round(game.price_primary * 1.3) : 0),
                discount: game.discount || '-25%',
                platforms: game.platforms || ["PS4", "PS5"],
                description: game.description || "Oferta digital exclusiva",
                tag: "OFERTA DESTACADA"
            };

            if (idx >= 0) {
                OFERTAS_SHOWCASE_DATA[idx] = showcaseItem;
            } else {
                OFERTAS_SHOWCASE_DATA.unshift(showcaseItem);
            }
        } else if (idx >= 0) {
            OFERTAS_SHOWCASE_DATA.splice(idx, 1);
        }
    }

    // Guardar cambios
    await saveAllOffersChanges();

    // Actualizar vista
    renderAdminOffersView();
    filterGamesList();
    showToast(`¡"${game.title}" ahora está en Oferta!`, "success");

    // Limpiar formulario rápido
    select.value = '';
    if (newPriceInput) newPriceInput.value = '';
    if (oldPriceInput) oldPriceInput.value = '';
    if (discountInput) discountInput.value = '';
}

async function removeGameFromOffers(gameId) {
    const game = allGames.find(g => String(g.id) === String(gameId));
    if (!game) return;

    if (!confirm(`¿Querés quitar "${game.title}" de la sección de ofertas?\n(El juego NO se eliminará del catálogo, solo dejará de ser oferta)`)) {
        return;
    }

    game.is_offer = false;
    game.old_price_primary = null;
    game.discount = null;

    // Quitar del Carrusel si estaba
    if (typeof OFERTAS_SHOWCASE_DATA !== 'undefined' && Array.isArray(OFERTAS_SHOWCASE_DATA)) {
        OFERTAS_SHOWCASE_DATA = OFERTAS_SHOWCASE_DATA.filter(c => 
            String(c.id) !== String(game.id) && (!c.title || c.title.toLowerCase().trim() !== (game.title || '').toLowerCase().trim())
        );
    }

    await saveAllOffersChanges();
    renderAdminOffersView();
    filterGamesList();
    showToast(`"${game.title}" se quitó de las ofertas`, "info");
}

async function toggleCarouselOffer(gameId) {
    const game = allGames.find(g => String(g.id) === String(gameId));
    if (!game) return;

    if (typeof OFERTAS_SHOWCASE_DATA === 'undefined' || !Array.isArray(OFERTAS_SHOWCASE_DATA)) {
        window.OFERTAS_SHOWCASE_DATA = [];
    }

    const idx = OFERTAS_SHOWCASE_DATA.findIndex(c => 
        String(c.id) === String(game.id) || (c.title && c.title.toLowerCase().trim() === (game.title || '').toLowerCase().trim())
    );

    if (idx >= 0) {
        OFERTAS_SHOWCASE_DATA.splice(idx, 1);
        showToast(`"${game.title}" quitado del carrusel`, "info");
    } else {
        OFERTAS_SHOWCASE_DATA.push({
            id: game.id,
            title: game.title,
            image: resolveGameCover(game.image, game.title),
            price: game.price_primary || 0,
            oldPrice: game.old_price_primary || (game.price_primary ? Math.round(game.price_primary * 1.3) : 0),
            discount: game.discount || '-25%',
            platforms: game.platforms || ["PS4", "PS5"],
            description: game.description || "Oferta digital exclusiva",
            tag: "OFERTA DESTACADA"
        });
        showToast(`"${game.title}" añadido al carrusel`, "success");
    }

    await saveAllOffersChanges();
    renderAdminOffersView();
}

async function updateOfferInlinePrice(gameId, field, value) {
    const game = allGames.find(g => String(g.id) === String(gameId));
    if (!game) return;

    const numVal = parseNumber(value);
    game[field] = numVal;

    // Recalcular descuento si tiene precio anterior y nuevo
    if (game.price_primary && game.old_price_primary && game.price_primary < game.old_price_primary) {
        const pct = Math.round(((game.old_price_primary - game.price_primary) / game.old_price_primary) * 100);
        game.discount = `-${pct}%`;
    }

    // Actualizar en OFERTAS_SHOWCASE_DATA si está
    if (typeof OFERTAS_SHOWCASE_DATA !== 'undefined' && Array.isArray(OFERTAS_SHOWCASE_DATA)) {
        const item = OFERTAS_SHOWCASE_DATA.find(c => 
            String(c.id) === String(game.id) || (c.title && c.title.toLowerCase().trim() === (game.title || '').toLowerCase().trim())
        );
        if (item) {
            if (field === 'price_primary') item.price = numVal;
            if (field === 'old_price_primary') item.oldPrice = numVal;
            if (game.discount) item.discount = game.discount;
        }
    }

    await saveAllOffersChanges();
    renderAdminOffersView();
}

async function saveAllOffersChanges(e) {
    if (e && e.preventDefault) e.preventDefault();
    const btn = document.getElementById('btnSaveAllOffers');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;
    }

    try {
        // 1. Guardar Carrusel en localStorage para acceso instantáneo
        if (typeof OFERTAS_SHOWCASE_DATA !== 'undefined') {
            try {
                localStorage.setItem('zd_offers_showcase', JSON.stringify(OFERTAS_SHOWCASE_DATA));
            } catch (err) {
                console.warn("Aviso al guardar zd_offers_showcase en localStorage:", err);
            }
        }

        // 2. Sincronizar en Supabase
        const sb = initSupabase();
        if (sb) {
            // Sincronizar configuración del carrusel de ofertas
            try {
                const { data: existing } = await sb
                    .from('games')
                    .select('id')
                    .eq('title', '__offers_showcase__')
                    .maybeSingle();

                const payload = {
                    title: '__offers_showcase__',
                    category: 'offers_config',
                    description: JSON.stringify(OFERTAS_SHOWCASE_DATA || []),
                    image: 'logo.png',
                    platforms: ['PS4', 'PS5'],
                    price_primary: 0,
                    availability: 'disponible',
                    updated_at: new Date().toISOString()
                };

                if (existing && existing.id) {
                    await sb.from('games').update(payload).eq('id', existing.id);
                } else {
                    await sb.from('games').insert([payload]);
                }
            } catch (err) {
                console.warn("Aviso al sincronizar ofertas carrusel en Supabase:", err);
            }

            // Sincronizar juegos modificados en la tabla games
            try {
                const gamesToSync = allGames.filter(g => 
                    g.id && typeof g.id === 'number' && (g.is_offer || g.old_price_primary || g.discount)
                );

                for (const g of gamesToSync) {
                    await sb.from('games').update({
                        is_offer: Boolean(g.is_offer),
                        price_primary: g.price_primary,
                        old_price_primary: g.old_price_primary,
                        discount: g.discount
                    }).eq('id', g.id);
                }
            } catch (err) {
                console.warn("Aviso al sincronizar juegos de oferta en Supabase:", err);
            }
        }

        showToast("¡Ofertas y Carrusel guardados y sincronizados correctamente!", "success");
    } catch (err) {
        showToast("Error al guardar ofertas: " + err.message, "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>Guardar Cambios de Ofertas</span>`;
        }
    }
}

function setAdminPsPlusConsole(consoleType) {
    adminPsPlusConsole = consoleType;
    const btn5 = document.getElementById('btnPsPlusPS5');
    const btn4 = document.getElementById('btnPsPlusPS4');

    if (consoleType === 'PS4') {
        if (btn5) btn5.classList.remove('active');
        if (btn4) btn4.classList.add('active');
    } else {
        if (btn4) btn4.classList.remove('active');
        if (btn5) btn5.classList.add('active');
    }

    renderAdminPsPlus();
}

function renderAdminPsPlus() {
    if (typeof PS_PLUS_PLANS === 'undefined') return;
    const plans = PS_PLUS_PLANS[adminPsPlusConsole] || PS_PLUS_PLANS.PS5;
    if (!plans) return;

    ['essential', 'extra', 'deluxe'].forEach(tierKey => {
        const tier = plans[tierKey];
        if (tier && tier.prices) {
            [1, 3, 6, 12].forEach(dur => {
                const input = document.getElementById(`psplus_${tierKey}_${dur}`);
                if (input) {
                    input.value = tier.prices[dur] || 0;
                }
            });
        }
    });
}

async function saveAdminPsPlusPrices(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (typeof PS_PLUS_PLANS === 'undefined') return;

    const btn = document.getElementById('btnSavePsPlus');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Guardando...`;
    }

    try {
        // Leemos los precios del formulario para la consola actual
        ['essential', 'extra', 'deluxe'].forEach(tierKey => {
            if (!PS_PLUS_PLANS[adminPsPlusConsole][tierKey].prices) {
                PS_PLUS_PLANS[adminPsPlusConsole][tierKey].prices = {};
            }
            [1, 3, 6, 12].forEach(dur => {
                const input = document.getElementById(`psplus_${tierKey}_${dur}`);
                if (input && input.value !== '') {
                    PS_PLUS_PLANS[adminPsPlusConsole][tierKey].prices[dur] = Number(input.value);
                }
            });
        });

        // 1. Guardar en localStorage para disponibilidad inmediata en la web
        try {
            localStorage.setItem('zd_ps_plus_plans', JSON.stringify(PS_PLUS_PLANS));
        } catch (err) {
            console.warn("Aviso al guardar en localStorage:", err);
        }

        // 2. Guardar en Supabase para sincronizar con todos los dispositivos y visitantes
        const sb = initSupabase();
        if (sb) {
            try {
                const { data: existing } = await sb
                    .from('games')
                    .select('id')
                    .eq('title', '__ps_plus_plans__')
                    .maybeSingle();

                const payload = {
                    title: '__ps_plus_plans__',
                    category: 'psplus_config',
                    description: JSON.stringify(PS_PLUS_PLANS),
                    image: 'ps-plus-logo.svg',
                    platforms: ['PS4', 'PS5'],
                    price_primary: 0,
                    availability: 'disponible',
                    updated_at: new Date().toISOString()
                };

                if (existing && existing.id) {
                    await sb.from('games').update(payload).eq('id', existing.id);
                } else {
                    await sb.from('games').insert([payload]);
                }
            } catch (err) {
                console.warn("Aviso al sincronizar PS Plus en Supabase:", err);
            }
        }

        showToast(`¡Precios de PlayStation Plus (${adminPsPlusConsole}) actualizados correctamente!`, "success");
    } catch (err) {
        showToast("Error al guardar precios: " + err.message, "error");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> <span>Guardar Precios de PlayStation Plus</span>`;
        }
    }
}

function resetAdminPsPlusPrices() {
    if (typeof DEFAULT_PS_PLUS_PLANS === 'undefined') return;
    if (!confirm(`¿Restablecer los precios de PlayStation Plus (${adminPsPlusConsole}) a los valores predeterminados?`)) return;

    if (PS_PLUS_PLANS && DEFAULT_PS_PLUS_PLANS[adminPsPlusConsole]) {
        PS_PLUS_PLANS[adminPsPlusConsole] = JSON.parse(JSON.stringify(DEFAULT_PS_PLUS_PLANS[adminPsPlusConsole]));
        renderAdminPsPlus();
        showToast(`Precios de ${adminPsPlusConsole} restablecidos. Hacé clic en "Guardar" para aplicar.`, "info");
    }
}

