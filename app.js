/**
 * ==========================================================================
 * ZONA DIGITAL - LÓGICA INTERACTIVA (app.js)
 * ==========================================================================
 * 
 * Este archivo controla:
 * 1. Renderizado dinámico del catálogo y de la sección de ofertas.
 * 2. Buscador en tiempo real y filtros por plataforma (PS4 / PS5 / Ofertas).
 * 3. Modal de detalles con selector interactivo de cuenta (Primaria vs Secundaria).
 * 4. Generación automática de mensajes directos para WhatsApp.
 * 5. Menú de 3 puntos (Opciones secundarias: cómo comprar, garantía, etc.).
 * 6. Menú móvil hamburguesa y acordeón de preguntas frecuentes.
 * ==========================================================================
 */

// Estado global de filtros y juego seleccionado
let currentPlatformFilter = 'all';
let currentCategoryFilter = 'all';
let currentSearchQuery = '';
let currentSortOption = 'featured';
let selectedGame = null;
let selectedAccountType = 'primary'; // 'primary' o 'secondary'
let selectedModalPlatform = null; // plataforma activa en el modal de detalles

// Estado global del Checkout / Pago por Transferencia
let currentCheckoutGame = null;
let currentCheckoutPlatform = 'PS5';
let currentCheckoutAccountType = 'primary';
let currentCheckoutPrice = 0;
let currentCheckoutOrderNumber = '';
let currentCheckoutType = 'catalog'; // 'catalog', 'ps3', o 'offer'

// Elementos del DOM
const gamesGrid = document.getElementById('gamesGrid');
const offersGrid = document.getElementById('offersGrid');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const sortSelect = document.getElementById('sortSelect');
const platformFilterBtns = document.querySelectorAll('.filter-btn');

// Modales
const gameModal = document.getElementById('gameModal');
const closeGameModalBtn = document.getElementById('closeGameModalBtn');
const infoModal = document.getElementById('infoModal');
const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');

// Menú 3 puntos y móvil
const dotsMenuBtn = document.getElementById('dotsMenuBtn');
const dotsDropdown = document.getElementById('dotsDropdown');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');


/**
 * Inicialización al cargar la página
 */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initStoreConfigLinks();
    renderNovedades();
    initNovedadesCarousel();
    renderOffersShowcase();
    initOffersShowcase();
    renderOffers();
    applyFiltersAndRender();
    renderPs3Games();
    renderPsPlusSection();
    initEventListeners();
    initFaqAccordion();

    // Sincronizar catálogo en vivo desde Supabase (para reflejar cambios del panel admin)
    syncCatalogWithSupabase();
    initSupabaseRealtime();
});

// Re-sincronizar automáticamente cuando el usuario regresa a la pestaña de la tienda
window.addEventListener('focus', () => {
    syncCatalogWithSupabase();
});

let isSyncingWithSupabase = false;

function resolveGameCover(image, title) {
    const raw = (image || '').trim();
    const t = (title || '').toLowerCase().trim();

    // Corregir errores conocidos de extensión
    if (raw.toLowerCase() === 'bttle1.wedp' || raw.includes('bttle1.wedp')) {
        return 'bttle1.webp';
    }

    // Si tiene un enlace genérico de Unsplash o está vacío, mapear a su portada local
    if (!raw || raw.includes('unsplash.com')) {
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

    return raw;
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


/**
 * SINCRONIZACIÓN EN VIVO CON SUPABASE
 * Carga los juegos reales desde la base de datos de Supabase de manera reactiva,
 * asegurando que cualquier cambio hecho en /admin se refleje inmediatamente en la web pública.
 */
async function syncCatalogWithSupabase() {
    if (isSyncingWithSupabase) return;
    if (typeof initSupabase !== 'function') return;

    const sb = initSupabase();
    if (!sb) return;

    isSyncingWithSupabase = true;

    try {
        const { data: dbGames, error } = await sb
            .from('games')
            .select('*')
            .order('id', { ascending: false });

        if (error) {
            console.warn("Aviso al sincronizar catálogo con Supabase:", error.message);
            return;
        }

        if (!dbGames || dbGames.length === 0) {
            return;
        }

        const ps4ps5Games = [];
        const ps3Games = [];

        dbGames.forEach(g => {
            // Sincronización reactiva de planes de PS Plus guardados desde el panel admin
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
                        if (typeof renderPsPlusSection === 'function') renderPsPlusSection();
                    }
                } catch(e) {}
                return;
            }

            // Sincronización reactiva de juegos eliminados desde el panel admin
            if (g.title === '__deleted_games__' || g.category === 'deleted_config') {
                try {
                    const deleted = JSON.parse(g.description);
                    if (Array.isArray(deleted)) {
                        window.DELETED_GAMES_LIST = deleted;
                    }
                } catch(e) {}
                return;
            }

            // Sincronización reactiva del carrusel de ofertas guardado desde el panel admin
            if (g.title === '__offers_showcase__' || g.category === 'offers_config') {
                try {
                    const customShowcase = JSON.parse(g.description);
                    if (Array.isArray(customShowcase) && customShowcase.length > 0) {
                        OFERTAS_SHOWCASE_DATA = customShowcase;
                        if (typeof renderOffersShowcase === 'function') renderOffersShowcase();
                        if (typeof initOffersShowcase === 'function') initOffersShowcase();
                    }
                } catch(e) {}
                return;
            }

            const platforms = Array.isArray(g.platforms) ? g.platforms : [];
            const isPs3Only = platforms.length === 1 && platforms[0] === 'PS3';
            const isAvailable = (g.availability || 'disponible') !== 'sin_stock';
            const coverImg = resolveGameCover(g.image, g.title);

            if (isPs3Only) {
                ps3Games.push({
                    id: Number(g.id),
                    title: g.title || '',
                    image: coverImg,
                    price: Number(g.price_ps3) || 0,
                    isBundle: Boolean(g.is_bundle),
                    bundleGames: Array.isArray(g.bundle_games) ? g.bundle_games : [],
                    description: g.description || '',
                    inStock: isAvailable,
                    availability: g.availability || 'disponible'
                });
            } else {
                const override = getUpdatedPriceForGame(g);
                ps4ps5Games.push({
                    id: Number(g.id),
                    title: g.title || '',
                    platforms: platforms.length > 0 ? platforms : ["PS4", "PS5"],
                    category: g.category || 'accion',
                    pricePrimary: override?.price_primary ?? (Number(g.price_primary) || 0),
                    priceSecondary: override?.price_secondary ?? ((g.price_secondary !== null && g.price_secondary !== undefined && g.price_secondary !== '') ? Number(g.price_secondary) : null),
                    pricePrimaryPS4: override?.price_primary_ps4 ?? ((g.price_primary_ps4 !== null && g.price_primary_ps4 !== undefined && g.price_primary_ps4 !== '') ? Number(g.price_primary_ps4) : null),
                    priceSecondaryPS4: override?.price_secondary_ps4 ?? ((g.price_secondary_ps4 !== null && g.price_secondary_ps4 !== undefined && g.price_secondary_ps4 !== '') ? Number(g.price_secondary_ps4) : null),
                    isOffer: (override && override.is_offer !== undefined) ? Boolean(override.is_offer) : Boolean(g.is_offer),
                    oldPricePrimary: (override && override.old_price_primary !== undefined) ? override.old_price_primary : ((g.old_price_primary !== null && g.old_price_primary !== undefined && g.old_price_primary !== '') ? Number(g.old_price_primary) : null),
                    discount: (override && override.discount !== undefined) ? override.discount : (g.discount || null),
                    image: coverImg,
                    description: g.description || '',
                    genre: g.genre || '',
                    languages: g.languages || 'Español Latino, Inglés',
                    size: g.size || 'Aprox. 50 GB',
                    inStock: isAvailable,
                    availability: g.availability || 'disponible',
                    isFeatured: Boolean(g.is_featured)
                });
            }
        });

        // Fusionar juegos de Supabase con los locales (excluyendo juegos eliminados)
        if (typeof GAMES_DATA !== 'undefined') {
            const dbTitles = new Set(ps4ps5Games.map(g => (g.title || '').toLowerCase().trim()));
            const deletedSet = new Set((window.DELETED_GAMES_LIST || []).map(t => String(t).toLowerCase().trim()));
            const missingLocal = GAMES_DATA.filter(g => {
                const titleNorm = (g.title || '').toLowerCase().trim();
                return !dbTitles.has(titleNorm) && !deletedSet.has(titleNorm);
            });
            const merged = [...ps4ps5Games.filter(g => !deletedSet.has((g.title || '').toLowerCase().trim())), ...missingLocal];

            GAMES_DATA.length = 0;
            GAMES_DATA.push(...merged);
            renderOffers();
            applyFiltersAndRender();
        }

        // Actualizamos PS3_GAMES_DATA de la misma forma
        if (typeof PS3_GAMES_DATA !== 'undefined') {
            const dbPs3Titles = new Set(ps3Games.map(g => (g.title || '').toLowerCase().trim()));
            const deletedSet = new Set((window.DELETED_GAMES_LIST || []).map(t => String(t).toLowerCase().trim()));
            const missingLocalPs3 = PS3_GAMES_DATA.filter(g => {
                const titleNorm = (g.title || '').toLowerCase().trim();
                return !dbPs3Titles.has(titleNorm) && !deletedSet.has(titleNorm);
            });
            const mergedPs3 = [...ps3Games.filter(g => !deletedSet.has((g.title || '').toLowerCase().trim())), ...missingLocalPs3];

            PS3_GAMES_DATA.length = 0;
            PS3_GAMES_DATA.push(...mergedPs3);
            renderPs3Games();
        }

    } catch (err) {
        console.warn("Excepción al conectar con Supabase:", err);
    } finally {
        isSyncingWithSupabase = false;
    }
}

function initSupabaseRealtime() {
    if (typeof initSupabase !== 'function') return;
    const sb = initSupabase();
    if (!sb) return;

    try {
        sb.channel('realtime-games-store')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => {
                syncCatalogWithSupabase();
            })
            .subscribe();
    } catch (_) {}
}


/**
 * 1. CONFIGURACIÓN DE ENLACES GENERALES DE WHATSAPP E INSTAGRAM
 */
function initStoreConfigLinks() {
    // Mensaje general de contacto directo por WhatsApp
    const generalMsg = encodeURIComponent("Hola, quiero hacer una consulta sobre los juegos digitales 🎮");
    const waGeneralUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${generalMsg}`;
    const igUrl = `https://www.instagram.com/${STORE_CONFIG.instagramUser}/`;
    
    // Botón flotante de WhatsApp
    const floatingWa = document.getElementById('floatingWaBtn');
    if (floatingWa) floatingWa.href = waGeneralUrl;

    // Botón directo en la sección contacto
    const directWaLink = document.getElementById('directWaLink');
    if (directWaLink) directWaLink.href = waGeneralUrl;

    // Botón WhatsApp en la barra de navegación
    const navWaBtn = document.getElementById('navWaBtn');
    if (navWaBtn) {
        navWaBtn.href = waGeneralUrl;
        navWaBtn.target = "_blank";
        navWaBtn.rel = "noopener noreferrer";
    }

    // Botón WhatsApp en el hero
    const heroWaBtn = document.getElementById('heroWaBtn');
    if (heroWaBtn) {
        heroWaBtn.href = waGeneralUrl;
        heroWaBtn.target = "_blank";
        heroWaBtn.rel = "noopener noreferrer";
    }

    // Botón directo a Instagram en sección contacto
    const directIgLink = document.getElementById('directIgLink');
    if (directIgLink) directIgLink.href = igUrl;

    // Enlace a Instagram en la barra de navegación
    const navIgLink = document.getElementById('navIgLink');
    if (navIgLink) navIgLink.href = igUrl;

    // Enlace a Instagram en el pie de página
    const footerIgLink = document.getElementById('footerIgLink');
    if (footerIgLink) footerIgLink.href = igUrl;

    // Enlace a Instagram en el menú de opciones (3 puntos)
    const dotsIgLink = document.getElementById('dotsIgLink');
    if (dotsIgLink) dotsIgLink.href = igUrl;
}

/**
 * Genera de forma 100% automática y actualizable el enlace de WhatsApp para comprar un juego.
 * Formato del mensaje: "Hola, quiero comprar [Nombre del Juego] 🎮"
 * Al agregar, editar o borrar juegos en games.js, el botón genera siempre el enlace correcto.
 */
function getWhatsAppBuyUrl(gameTitle, availability) {
    if (availability === 'proximamente') {
        const message = `Hola, quiero consultar y encargar ${gameTitle} (Próximamente) 🎮`;
        return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    }
    const message = `Hola, quiero comprar ${gameTitle} 🎮`;
    return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}


/**
 * 2. FORMATEADOR DE PRECIOS
 * Formatea números a estilo local con separador de miles (ej: 24500 -> $ 24.500)
 */
function formatPrice(amount) {
    if (!amount) return "$ 0";
    return `${STORE_CONFIG.currencySymbol} ${amount.toLocaleString('es-AR')}`;
}


/**
 * 3. RENDERIZADO DE LA SECCIÓN DE OFERTAS DE LA SEMANA
 */
function renderOffers() {
    if (!offersGrid) return;

    // Filtramos solo los juegos con isOffer = true
    const offerGames = GAMES_DATA.filter(game => game.isOffer);

    if (offerGames.length === 0) {
        offersGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1/-1;">No hay promociones activas por el momento.</p>`;
        return;
    }

    offersGrid.innerHTML = offerGames.map(game => createGameCardHtml(game)).join('');
}


/**
 * 4. FILTRADO, BÚSQUEDA Y ORDENAMIENTO DEL CATÁLOGO
 */
function applyFiltersAndRender() {
    if (!gamesGrid) return;

    let filtered = [...GAMES_DATA];

    // Filtro por Plataforma
    if (currentPlatformFilter !== 'all') {
        filtered = filtered.filter(game => game.platforms.includes(currentPlatformFilter));
    }

    // Filtro por Ofertas
    if (currentCategoryFilter === 'ofertas') {
        filtered = filtered.filter(game => game.isOffer);
    }

    // Filtro por Buscador (nombre o género)
    if (currentSearchQuery.trim() !== '') {
        const query = currentSearchQuery.toLowerCase().trim();
        filtered = filtered.filter(game => 
            game.title.toLowerCase().includes(query) ||
            game.genre.toLowerCase().includes(query) ||
            game.category.toLowerCase().includes(query)
        );
    }

    // Ordenamiento
    switch (currentSortOption) {
        case 'price-asc':
            filtered.sort((a, b) => {
                const pA = a.priceSecondary || a.pricePrimary;
                const pB = b.priceSecondary || b.pricePrimary;
                return pA - pB;
            });
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.pricePrimary - a.pricePrimary);
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'featured':
        default:
            filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
            break;
    }

    // Renderizar resultados
    if (filtered.length === 0) {
        gamesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-gamepad"></i>
                <h3>No se encontraron juegos</h3>
                <p>No encontramos títulos que coincidan con "<strong>${escapeHtml(currentSearchQuery)}</strong>".</p>
                <button class="btn-primary" onclick="resetSearchAndFilters()">
                    <i class="fa-solid fa-rotate-left"></i> Restablecer Filtros
                </button>
            </div>
        `;
    } else {
        gamesGrid.innerHTML = filtered.map(game => createGameCardHtml(game)).join('');
    }
}


/**
 * 5. CREACIÓN DE LA TARJETA HTML DE UN JUEGO
 */
function createGameCardHtml(game) {
    // Badges de Plataformas (PS4 / PS5)
    const platformBadgesHtml = game.platforms.map(plat => {
        const cls = plat === 'PS5' ? 'badge-ps5' : 'badge-ps4';
        return `<span class="${cls}">${plat}</span>`;
    }).join('');

    // Badge de Descuento si está en oferta
    const discountBadgeHtml = game.isOffer && game.discount 
        ? `<span class="badge-discount">${game.discount} OFF</span>` 
        : '';

    // Precio anterior tachado si corresponde
    const oldPriceHtml = game.isOffer && game.oldPricePrimary 
        ? `<span class="old-price">${formatPrice(game.oldPricePrimary)}</span>` 
        : '';

    // Estado de disponibilidad
    const isOutOfStock = (game.availability === 'sin_stock' || game.inStock === false);
    const isUpcoming = (game.availability === 'proximamente');

    // Badge de disponibilidad (Sin Stock o Próximamente)
    let statusBadgeHtml = '';
    if (isOutOfStock) {
        statusBadgeHtml = `<span style="background: rgba(239, 68, 68, 0.9); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase;">Sin Stock</span>`;
    } else if (isUpcoming) {
        statusBadgeHtml = `<span style="background: rgba(139, 92, 246, 0.9); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase;">Próximamente</span>`;
    }

    // Botón de WhatsApp según estado:
    // - Si es "Disponible": Se muestra normalmente ("Comprar por WhatsApp")
    // - Si es "Próximamente": SE DEBE MOSTRAR ("Consultar / Encargar")
    // - Si es "Sin stock": SE OCULTA POR COMPLETO
    let buyBtnHtml = '';
    if (!isOutOfStock) {
        const btnText = isUpcoming ? 'Consultar / Encargar' : 'Comprar por WhatsApp';
        const btnTitle = isUpcoming ? `Consultar o encargar ${escapeHtml(game.title)} por WhatsApp` : `Comprar ${escapeHtml(game.title)} por WhatsApp`;
        buyBtnHtml = `
            <button type="button" class="btn-card-buy ${isUpcoming ? 'btn-upcoming' : ''}" onclick="openCheckoutModal(${game.id})" title="${btnTitle}">
                <i class="fa-brands fa-whatsapp"></i> ${btnText}
            </button>
        `;
    }

    return `
        <article class="game-card" data-id="${game.id}">
            <div class="card-media">
                <div class="card-badges">
                    <div class="platform-badge-group">
                        ${platformBadgesHtml}
                        ${statusBadgeHtml}
                    </div>
                    ${discountBadgeHtml}
                </div>
                <img class="card-img" src="${game.image}" alt="${escapeHtml(game.title)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';">
            </div>

            <div class="card-body">
                <span class="card-category">${escapeHtml(game.category.toUpperCase())}</span>
                <h3 class="card-title" title="${escapeHtml(game.title)}">${escapeHtml(game.title)}</h3>

                <div class="card-pricing">
                    <div class="price-row">
                        <span class="account-type-label">
                            <i class="fa-solid fa-crown"></i> Primaria:
                        </span>
                        <span class="price-amount-group">
                            ${oldPriceHtml}
                            ${(() => {
                                if (game.pricePrimaryPS4) {
                                    if (currentPlatformFilter === 'PS4') {
                                        return `<span class="price-value highlight">${formatPrice(game.pricePrimaryPS4)}</span>`;
                                    } else if (currentPlatformFilter === 'PS5') {
                                        return `<span class="price-value highlight">${formatPrice(game.pricePrimary)}</span>`;
                                    } else {
                                        return `<span class="price-value highlight">${formatPrice(game.pricePrimaryPS4)}</span>`;
                                    }
                                }
                                return `<span class="price-value highlight">${formatPrice(game.pricePrimary)}</span>`;
                            })()}
                        </span>
                    </div>
                    <div class="price-row">
                        <span class="account-type-label">
                            <i class="fa-solid fa-user"></i> Secundaria:
                        </span>
                        <span class="price-value">${(() => {
                            if (game.pricePrimaryPS4) {
                                if (currentPlatformFilter === 'PS4') {
                                    return game.priceSecondaryPS4 ? formatPrice(game.priceSecondaryPS4) : '<span style="color: var(--text-muted); font-size: 0.85rem; font-weight: normal;">Sin stock</span>';
                                } else if (currentPlatformFilter === 'PS5') {
                                    return game.priceSecondary ? formatPrice(game.priceSecondary) : '<span style="color: var(--text-muted); font-size: 0.85rem; font-weight: normal;">Sin stock</span>';
                                } else {
                                    return (game.priceSecondaryPS4 || game.priceSecondary) ? formatPrice(game.priceSecondaryPS4 || game.priceSecondary) : '<span style="color: var(--text-muted); font-size: 0.85rem; font-weight: normal;">Sin stock</span>';
                                }
                            }
                            return game.priceSecondary ? formatPrice(game.priceSecondary) : '<span style="color: var(--text-muted); font-size: 0.85rem; font-weight: normal;">Sin stock</span>';
                        })()}</span>
                    </div>
                </div>

                <div class="card-actions ${isOutOfStock ? 'has-single-btn' : ''}">
                    <button type="button" class="btn-card-details" onclick="openGameModal(${game.id})" title="Ver detalles y opciones">
                        <i class="fa-solid fa-eye"></i> Detalles
                    </button>
                    ${buyBtnHtml}
                </div>
            </div>
        </article>
    `;
}


/**
 * 6. CONTROL DEL MODAL DE DETALLES DEL JUEGO
 */
function openGameModal(gameId) {
    const game = GAMES_DATA.find(g => g.id === gameId);
    if (!game) return;

    selectedGame = game;
    selectedAccountType = 'primary';
    // Si el usuario ya está filtrando por una plataforma específica y el juego la incluye, seleccionarla
    if (currentPlatformFilter === 'PS4' && game.platforms.includes('PS4')) {
        selectedModalPlatform = 'PS4';
    } else if (currentPlatformFilter === 'PS5' && game.platforms.includes('PS5')) {
        selectedModalPlatform = 'PS5';
    } else {
        selectedModalPlatform = (game.platforms.includes('PS4')) ? 'PS4' : (game.platforms[0] || 'PS5');
    }

    // Rellenamos la información del modal
    document.getElementById('modalGameTitle').textContent = game.title;
    document.getElementById('modalGameCategory').textContent = game.category.toUpperCase();
    document.getElementById('modalGameDesc').textContent = game.description;

    const modalImg = document.getElementById('modalGameImg');
    modalImg.src = game.image;
    modalImg.alt = game.title;

    // Badges en el modal
    const infoPills = document.getElementById('modalInfoPills');
    const isOutOfStock = (game.availability === 'sin_stock' || game.inStock === false);
    const isUpcoming = (game.availability === 'proximamente');

    let availabilityPillHtml = '<span class="info-pill" style="color: #4EFA90;"><i class="fa-solid fa-circle-check"></i> Stock Inmediato</span>';
    if (isOutOfStock) {
        availabilityPillHtml = '<span class="info-pill" style="color: #EF4444; border-color: rgba(239,68,68,0.4);"><i class="fa-solid fa-ban"></i> Sin Stock</span>';
    } else if (isUpcoming) {
        availabilityPillHtml = '<span class="info-pill" style="color: #A78BFA; border-color: rgba(167,139,250,0.4);"><i class="fa-solid fa-clock"></i> Próximamente (Preventa / Consulta)</span>';
    }

    // Si el juego tiene más de una plataforma, agregar selector interactivo de plataforma
    const platformSelectorHtml = (game.platforms && game.platforms.length > 1)
        ? `<div style="display:flex; gap:8px; margin-bottom:4px;">
            ${game.platforms.map(p => `
                <button type="button"
                    id="modalPlatBtn_${p}"
                    onclick="selectModalPlatform('${p}')"
                    style="padding:4px 14px; border-radius:20px; border:2px solid ${p === selectedModalPlatform ? 'var(--color-primary)' : 'var(--border-card)'};
                           background:${p === selectedModalPlatform ? 'rgba(255,229,0,0.12)' : 'transparent'};
                           color:${p === selectedModalPlatform ? 'var(--color-primary)' : 'var(--text-muted)'};
                           font-weight:700; cursor:pointer; font-size:0.85rem; transition:all .2s;">
                    ${p}
                </button>`).join('')}
           </div>`
        : '';
    infoPills.innerHTML = `
        ${platformSelectorHtml}
        <span class="info-pill"><i class="fa-brands fa-playstation" style="color:var(--color-primary)"></i> ${game.platforms.join(' / ')}</span>
        <span class="info-pill"><i class="fa-solid fa-layer-group"></i> ${game.genre}</span>
        <span class="info-pill"><i class="fa-solid fa-language"></i> ${game.languages}</span>
        <span class="info-pill"><i class="fa-solid fa-hard-drive"></i> ${game.size}</span>
        ${availabilityPillHtml}
    `;

    // Botón de WhatsApp en el modal:
    // - Si el estado es "Disponible": Se muestra normalmente ("Comprar").
    // - Si el estado es "Próximamente": Se muestra ("Consultar / Encargar").
    // - Si el estado es "Sin stock": Se oculta por completo.
    const modalBuyBtn = document.getElementById('modalBuyWaBtn');
    let modalNotice = document.getElementById('modalOutOfStockNotice');
    if (!modalNotice && modalBuyBtn && modalBuyBtn.parentNode) {
        modalNotice = document.createElement('span');
        modalNotice.id = 'modalOutOfStockNotice';
        modalNotice.style.cssText = 'color: #EF4444; font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px;';
        modalNotice.innerHTML = '<i class="fa-solid fa-ban"></i> Sin Stock disponible';
        modalBuyBtn.parentNode.appendChild(modalNotice);
    }

    if (modalBuyBtn) {
        if (isOutOfStock) {
            modalBuyBtn.style.display = 'none';
            if (modalNotice) modalNotice.style.display = 'inline-flex';
        } else {
            modalBuyBtn.style.display = 'inline-flex';
            if (modalNotice) modalNotice.style.display = 'none';
            const btnSpan = modalBuyBtn.querySelector('span');
            if (btnSpan) {
                btnSpan.textContent = isUpcoming ? 'Consultar / Encargar' : 'Comprar';
            }
        }
    }

    // Actualizamos selector de cuenta y precio
    const tabSecondaryEl = document.getElementById('tabSecondary');
    if (tabSecondaryEl) {
        const hasSecondary = selectedModalPlatform === 'PS4'
            ? (game.priceSecondaryPS4 !== undefined ? game.priceSecondaryPS4 : game.priceSecondary)
            : game.priceSecondary;
        if (!hasSecondary) {
            tabSecondaryEl.style.opacity = '0.4';
            tabSecondaryEl.style.cursor = 'not-allowed';
            tabSecondaryEl.title = 'Sin stock disponible en cuenta secundaria';
        } else {
            tabSecondaryEl.style.opacity = '';
            tabSecondaryEl.style.cursor = '';
            tabSecondaryEl.title = '';
        }
    }
    updateModalAccountSelection();

    // Mostramos el modal
    gameModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeGameModal() {
    gameModal.classList.remove('active');
    document.body.style.overflow = '';
}

function selectAccountType(type) {
    if (!selectedGame) return;
    const isPS4 = selectedModalPlatform === 'PS4';
    const hasSecondary = isPS4
        ? (selectedGame.priceSecondaryPS4 !== undefined ? selectedGame.priceSecondaryPS4 : selectedGame.priceSecondary)
        : selectedGame.priceSecondary;
    if (type === 'secondary' && !hasSecondary) return;
    selectedAccountType = type;
    updateModalAccountSelection();
}

/**
 * Cambia la plataforma activa en el modal de detalles (PS4 / PS5)
 */
function selectModalPlatform(platform) {
    if (!selectedGame) return;
    selectedModalPlatform = platform;
    selectedAccountType = 'primary'; // resetear a primaria al cambiar plataforma

    // Actualizar estilos de los botones de plataforma
    selectedGame.platforms.forEach(p => {
        const btn = document.getElementById(`modalPlatBtn_${p}`);
        if (btn) {
            const isActive = p === platform;
            btn.style.borderColor = isActive ? 'var(--color-primary)' : 'var(--border-card)';
            btn.style.background = isActive ? 'rgba(255,229,0,0.12)' : 'transparent';
            btn.style.color = isActive ? 'var(--color-primary)' : 'var(--text-muted)';
        }
    });

    // Actualizar disponibilidad del tab secundaria
    const tabSecondaryEl = document.getElementById('tabSecondary');
    if (tabSecondaryEl) {
        const hasSecondary = platform === 'PS4'
            ? (selectedGame.priceSecondaryPS4 !== undefined ? selectedGame.priceSecondaryPS4 : selectedGame.priceSecondary)
            : selectedGame.priceSecondary;
        if (!hasSecondary) {
            tabSecondaryEl.style.opacity = '0.4';
            tabSecondaryEl.style.cursor = 'not-allowed';
            tabSecondaryEl.title = 'Sin stock disponible en cuenta secundaria';
        } else {
            tabSecondaryEl.style.opacity = '';
            tabSecondaryEl.style.cursor = '';
            tabSecondaryEl.title = '';
        }
    }

    updateModalAccountSelection();
}

function updateModalAccountSelection() {
    if (!selectedGame) return;

    const tabPrimary = document.getElementById('tabPrimary');
    const tabSecondary = document.getElementById('tabSecondary');
    const tabDesc = document.getElementById('accountTabDesc');
    const priceValue = document.getElementById('modalPriceValue');
    const priceLabel = document.getElementById('modalAccountTypeLabel');

    // Determinar precio según plataforma y tipo de cuenta
    const isPS4 = selectedModalPlatform === 'PS4';
    let price;
    if (selectedAccountType === 'primary') {
        price = (isPS4 && selectedGame.pricePrimaryPS4) ? selectedGame.pricePrimaryPS4 : selectedGame.pricePrimary;
    } else {
        price = (isPS4 && selectedGame.priceSecondaryPS4) ? selectedGame.priceSecondaryPS4 : selectedGame.priceSecondary;
    }

    if (selectedAccountType === 'primary') {
        if (tabPrimary) tabPrimary.classList.add('active');
        if (tabSecondary) tabSecondary.classList.remove('active');
        if (priceLabel) priceLabel.textContent = 'Precio Cuenta Primaria:';
        if (priceValue) priceValue.textContent = formatPrice(price);
        if (tabDesc) tabDesc.innerHTML = '<strong>Cuenta Primaria:</strong> Jugás desde tu usuario personal de siempre, guardás tus propios trofeos y podés jugar tanto online como offline.';
    } else {
        if (tabPrimary) tabPrimary.classList.remove('active');
        if (tabSecondary) tabSecondary.classList.add('active');
        if (priceLabel) priceLabel.textContent = 'Precio Cuenta Secundaria:';
        if (priceValue) priceValue.textContent = formatPrice(price);
        if (tabDesc) tabDesc.innerHTML = '<strong>Cuenta Secundaria:</strong> Jugás desde el usuario enviado por nosotros. Opción más económica con el juego 100% completo (requiere internet para jugar).';
    }
}


/**
 * 7. MODAL INFORMATIVO (OPCIONES DEL MENÚ DE 3 PUNTOS)
 */
function openInfoModal(type) {
    // Cerramos el menú de 3 puntos
    dotsDropdown.classList.remove('show');
    dotsMenuBtn.classList.remove('active');

    const titleEl = document.getElementById('infoModalTitle');
    const bodyEl = document.getElementById('infoModalBody');

    switch (type) {
        case 'comoComprar':
            titleEl.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Guía: ¿Cómo Comprar en Zona Digitalarg?';
            bodyEl.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; gap: 14px;">
                        <span style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;">1</span>
                        <div>
                            <h4 style="color: #fff; margin-bottom: 4px;">Elegí tu juego</h4>
                            <p style="color: var(--text-muted);">Revisá nuestro catálogo y decidí si preferís Cuenta Primaria o Cuenta Secundaria.</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 14px;">
                        <span style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;">2</span>
                        <div>
                            <h4 style="color: #fff; margin-bottom: 4px;">Contactanos por WhatsApp</h4>
                            <p style="color: var(--text-muted);">Tocá el botón "Comprar por WhatsApp" para enviarnos el mensaje automático con el juego elegido y confirmar stock.</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 14px;">
                        <span style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;">3</span>
                        <div>
                            <h4 style="color: #fff; margin-bottom: 4px;">Realizás el pago</h4>
                            <p style="color: var(--text-muted);">Aceptamos Transferencia bancaria directa, Mercado Pago y dinero en cuenta con acreditación inmediata.</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 14px;">
                        <span style="width: 32px; height: 32px; border-radius: 50%; background: var(--color-primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; flex-shrink: 0;">4</span>
                        <div>
                            <h4 style="color: #fff; margin-bottom: 4px;">¡Entrega y a jugar!</h4>
                            <p style="color: var(--text-muted);">En 15 minutos te mandamos usuario, contraseña y la guía paso a paso para activarlo en tu consola.</p>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'tiposCuenta':
            titleEl.innerHTML = '<i class="fa-solid fa-users-gear"></i> Primaria vs Secundaria: ¿Cuál elegir?';
            bodyEl.innerHTML = `
                <p style="margin-bottom: 14px;">Ambas cuentas contienen el <strong>juego oficial completo</strong> descargado de PlayStation Network, pero tienen distintas modalidades de uso:</p>
                <div style="background: rgba(255,229,0,0.06); border: 1px solid var(--border-card); padding: 14px; border-radius: 8px; margin-bottom: 12px;">
                    <h4 style="color: var(--color-primary); margin-bottom: 6px;"><i class="fa-solid fa-crown"></i> Cuenta Primaria</h4>
                    <p style="color: var(--text-light); font-size: 0.9rem;">Se activa como principal en tu consola. Una vez descargado el juego, <strong>jugás con tu propio perfil</strong> de siempre, sumás tus trofeos y podés jugar sin necesidad de estar conectado a internet.</p>
                </div>
                <div style="background: rgba(0,112,209,0.08); border: 1px solid rgba(0,112,209,0.3); padding: 14px; border-radius: 8px;">
                    <h4 style="color: #4DA6FF; margin-bottom: 6px;"><i class="fa-solid fa-user"></i> Cuenta Secundaria</h4>
                    <p style="color: var(--text-light); font-size: 0.9rem;">Iniciás sesión en el usuario que te entregamos para jugar directamente desde allí. Es la opción <strong>más económica</strong> para pasarse el juego ahorrando al máximo.</p>
                </div>
            `;
            break;

        case 'garantia':
            titleEl.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Garantía y Seguridad Zona Digitalarg';
            bodyEl.innerHTML = `
                <p style="margin-bottom: 14px;">En <strong>Zona Digitalarg</strong> cuidamos tu dinero y tu consola. Todas nuestras transacciones incluyen respaldo comercial garantizado:</p>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
                    <li><i class="fa-solid fa-circle-check" style="color: var(--color-primary); margin-right: 8px;"></i> Cuentas 100% legales y originales adquiridas en PlayStation Store.</li>
                    <li><i class="fa-solid fa-circle-check" style="color: var(--color-primary); margin-right: 8px;"></i> Cero riesgo de baneo en tu consola PlayStation.</li>
                    <li><i class="fa-solid fa-circle-check" style="color: var(--color-primary); margin-right: 8px;"></i> Soporte técnico permanente ante cualquier duda de instalación.</li>
                    <li><i class="fa-solid fa-circle-check" style="color: var(--color-primary); margin-right: 8px;"></i> Guía interactiva paso a paso enviada en el momento.</li>
                </ul>
            `;
            break;

        case 'faq':
            titleEl.innerHTML = '<i class="fa-solid fa-circle-question"></i> Preguntas Frecuentes';
            bodyEl.innerHTML = `
                <p style="margin-bottom: 12px;"><strong>¿Cuánto tardan en enviar el juego?</strong><br>Generalmente entre 10 y 25 minutos luego de acreditarse el pago en nuestro horario de atención.</p>
                <p style="margin-bottom: 12px;"><strong>¿Puedo desinstalar el juego y volverlo a instalar?</strong><br>Sí, los juegos quedan asociados a la cuenta entregada para que puedas descargarlo nuevamente cuando quieras.</p>
                <p><strong>¿Qué medios de pago aceptan?</strong><br>Transferencia Bancaria (CBU/CVU), Mercado Pago (dinero en cuenta, tarjetas o débito) y depósito.</p>
            `;
            break;
    }

    infoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInfoModal() {
    infoModal.classList.remove('active');
    document.body.style.overflow = '';
}


/**
 * ==========================================================================
 * 7.1 SISTEMA DE COMPRA Y PAGO POR TRANSFERENCIA (CHECKOUT)
 * ==========================================================================
 */

/**
 * Genera de forma automática un número de orden único correlativo (ej: ZD-1047, ZD-1048...)
 * Comienza en ZD-1047 y se persiste en localStorage.
 */
function generateOrderNumber() {
    let lastOrder = parseInt(localStorage.getItem('zd_last_order_num'), 10);
    if (isNaN(lastOrder) || lastOrder < 1046) {
        lastOrder = 1046;
    }
    const nextOrder = lastOrder + 1;
    localStorage.setItem('zd_last_order_num', nextOrder.toString());
    return `ZD-${nextOrder}`;
}

/**
 * Abre el modal de checkout y pago por transferencia para cualquier juego
 */
function openCheckoutModal(gameId, type = 'catalog', preselectedAccount = 'primary', preselectedPlatform = null) {
    let game = null;
    currentCheckoutType = type;

    if (type === 'ps3') {
        if (typeof PS3_GAMES_DATA !== 'undefined') {
            game = PS3_GAMES_DATA.find(g => g.id === gameId);
        }
    } else {
        game = GAMES_DATA.find(g => g.id === gameId);
    }

    if (!game) return;

    // Regla de seguridad: si no tiene stock, no permitir abrir checkout
    if (game.availability === 'sin_stock' || game.inStock === false) {
        alert("Este juego se encuentra actualmente sin stock disponible.");
        return;
    }

    currentCheckoutGame = game;
    currentCheckoutAccountType = preselectedAccount;
    currentCheckoutOrderNumber = generateOrderNumber();

    // Determinar plataforma seleccionada
    if (type === 'ps3') {
        currentCheckoutPlatform = 'PS3';
    } else if (preselectedPlatform && game.platforms && game.platforms.includes(preselectedPlatform)) {
        currentCheckoutPlatform = preselectedPlatform;
    } else if (currentPlatformFilter !== 'all' && game.platforms && game.platforms.includes(currentPlatformFilter)) {
        currentCheckoutPlatform = currentPlatformFilter;
    } else if (game.platforms && game.platforms.length > 0) {
        currentCheckoutPlatform = game.platforms[0];
    } else {
        currentCheckoutPlatform = 'PS5';
    }

    // Renderizar datos en el DOM del checkout
    const modalImg = document.getElementById('checkoutGameImg');
    const modalTitle = document.getElementById('checkoutGameTitle');
    const modalCat = document.getElementById('checkoutGameCat');
    const orderNumEl = document.getElementById('checkoutOrderNumber');
    const aliasEl = document.getElementById('transferAliasValue');

    if (modalImg) {
        modalImg.src = game.image;
        modalImg.alt = game.title;
    }
    if (modalTitle) modalTitle.textContent = game.title;
    if (modalCat) modalCat.textContent = (game.category || 'PLAYSTATION').toUpperCase();
    if (orderNumEl) orderNumEl.textContent = currentCheckoutOrderNumber;
    if (aliasEl && STORE_CONFIG.transferAlias) aliasEl.textContent = STORE_CONFIG.transferAlias;

    // Selector interactivo de plataforma
    const platformPillsContainer = document.getElementById('checkoutPlatformPills');
    if (platformPillsContainer) {
        if (type === 'ps3') {
            platformPillsContainer.innerHTML = `<span class="checkout-pill-fixed">PS3</span>`;
        } else if (game.platforms && game.platforms.length > 1) {
            platformPillsContainer.innerHTML = game.platforms.map(plat => `
                <button type="button" class="checkout-pill ${plat === currentCheckoutPlatform ? 'active' : ''}" onclick="setCheckoutPlatform('${plat}')">
                    ${plat}
                </button>
            `).join('');
        } else if (game.platforms && game.platforms.length === 1) {
            platformPillsContainer.innerHTML = `<span class="checkout-pill-fixed">${game.platforms[0]}</span>`;
        } else {
            platformPillsContainer.innerHTML = `<span class="checkout-pill-fixed">PS5</span>`;
        }
    }

    // Selector interactivo de tipo de cuenta
    const accountRow = document.getElementById('checkoutAccountRow');
    if (accountRow) {
        accountRow.innerHTML = `
            <span class="checkout-config-label"><i class="fa-solid fa-user-gear"></i> Tipo de cuenta:</span>
            <div class="checkout-account-pills" id="checkoutAccountPills">
                <button type="button" class="checkout-acc-pill active" id="chkAccountPrimary" onclick="setCheckoutAccount('primary')">
                    <i class="fa-solid fa-crown"></i> Primaria
                </button>
                <button type="button" class="checkout-acc-pill" id="chkAccountSecondary" onclick="setCheckoutAccount('secondary')">
                    <i class="fa-solid fa-user"></i> Secundaria
                </button>
            </div>
        `;
    }
    const chkPrimary = document.getElementById('chkAccountPrimary');
    const chkSecondary = document.getElementById('chkAccountSecondary');

    if (type === 'ps3') {
        if (accountRow) accountRow.style.display = 'none';
        currentCheckoutAccountType = 'digital';
    } else {
        if (accountRow) accountRow.style.display = 'flex';
        // Verificar si hay precio secundario según la plataforma seleccionada
        const initIsPS4 = currentCheckoutPlatform === 'PS4';
        const hasSecondary = initIsPS4
            ? (game.priceSecondaryPS4 !== undefined ? game.priceSecondaryPS4 : game.priceSecondary)
            : game.priceSecondary;
        if (!hasSecondary) {
            currentCheckoutAccountType = 'primary';
            if (chkSecondary) chkSecondary.style.display = 'none';
        } else {
            if (chkSecondary) chkSecondary.style.display = '';
        }
        if (chkPrimary && chkSecondary) {
            if (currentCheckoutAccountType === 'primary') {
                chkPrimary.classList.add('active');
                chkSecondary.classList.remove('active');
            } else {
                chkPrimary.classList.remove('active');
                chkSecondary.classList.add('active');
            }
        }
    }

    // Actualizar precio y total a transferir
    updateCheckoutPriceDisplay();

    // Restablecer vistas del modal
    const transferContent = document.getElementById('transferSectionContent');
    const pendingBanner = document.getElementById('transferPendingBanner');
    if (transferContent) transferContent.style.display = 'block';
    if (pendingBanner) pendingBanner.style.display = 'none';

    // Renderizar carrusel de juegos relacionados (debajo del QR)
    renderCheckoutRelatedGames(game);

    // Abrir modal de checkout
    const checkoutEl = document.getElementById('checkoutModal');
    if (checkoutEl) {
        checkoutEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Abre el checkout desde el modal de detalles del juego
 */
function openCheckoutForCurrentGame() {
    if (!selectedGame) return;
    const chosenAccount = selectedAccountType || 'primary';
    const chosenPlatform = selectedModalPlatform || (selectedGame.platforms ? selectedGame.platforms[0] : 'PS5');
    closeGameModal();
    openCheckoutModal(selectedGame.id, 'catalog', chosenAccount, chosenPlatform);
}

/**
 * Abre el checkout para un juego de PS3
 */
function openCheckoutForPs3(gameId) {
    openCheckoutModal(gameId, 'ps3', 'digital', 'PS3');
}

/**
 * Abre el checkout para una novedad del carousel por su índice
 */
function openCheckoutForNovedad(novedadIndex) {
    if (typeof NOVEDADES_DATA === 'undefined') return;
    const item = NOVEDADES_DATA[novedadIndex];
    if (!item) return;

    let game = null;
    const gamesList = typeof GAMES_DATA !== 'undefined' ? GAMES_DATA : [];

    // 1. Buscar primero por coincidencia exacta o flexible de título
    if (item.title) {
        const normTitle = item.title.toLowerCase().trim();
        game = gamesList.find(g => (g.title || '').toLowerCase().trim() === normTitle);
        if (!game) {
            game = gamesList.find(g => {
                const gt = (g.title || '').toLowerCase().trim();
                return gt.includes(normTitle) || normTitle.includes(gt);
            });
        }
    }

    // 2. Fallback a gameId si no se encontró por título
    if (!game && item.gameId) {
        game = gamesList.find(g => g.id === item.gameId);
    }

    if (game) {
        // Si figura disponible en novedades, asegurar que no bloquee el checkout
        game.availability = 'disponible';
        game.inStock = true;

        let preferredPlat = 'PS5';
        if (item.platforms && item.platforms.includes('PS5')) {
            preferredPlat = 'PS5';
        } else if (item.platforms && item.platforms.includes('PS4')) {
            preferredPlat = 'PS4';
        } else if (game.platforms && game.platforms.length > 0) {
            preferredPlat = game.platforms[0];
        }
        openCheckoutModal(game.id, 'catalog', 'primary', preferredPlat);
    } else {
        const buyMsg = encodeURIComponent(`Hola, quiero comprar "${item.title}" para PlayStation 🎮`);
        window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${buyMsg}`, '_blank');
    }
}

/**
 * Abre el checkout para una oferta destacada del carousel
 */
function openCheckoutForOffer(offerIndex) {
    if (typeof OFERTAS_SHOWCASE_DATA === 'undefined') return;
    const offer = OFERTAS_SHOWCASE_DATA[offerIndex];
    if (!offer) return;

    let game = null;
    const gamesList = typeof GAMES_DATA !== 'undefined' ? GAMES_DATA : [];

    // 1. Buscar primero por coincidencia exacta de título
    if (offer.title) {
        const normOffer = offer.title.toLowerCase().trim();
        game = gamesList.find(g => (g.title || '').toLowerCase().trim() === normOffer);
        if (!game) {
            game = gamesList.find(g => {
                const gt = (g.title || '').toLowerCase().trim();
                return gt.includes(normOffer) || normOffer.includes(gt);
            });
        }
    }

    // 2. Fallback a ID numérico si no coincidió por título
    if (!game && offer.id) {
        game = gamesList.find(g => g.id === offer.id);
    }

    if (game) {
        game.availability = 'disponible';
        game.inStock = true;

        let preferredPlat = 'PS5';
        if (offer.platform && offer.platform.includes('PS4') && !offer.platform.includes('PS5')) {
            preferredPlat = 'PS4';
        } else if (game.platforms && game.platforms.includes('PS5')) {
            preferredPlat = 'PS5';
        } else if (game.platforms && game.platforms.includes('PS4')) {
            preferredPlat = 'PS4';
        }
        openCheckoutModal(game.id, 'catalog', 'primary', preferredPlat);
        return;
    }

    // Fallback: abrir por WhatsApp si el juego no figura en el catálogo
    const waMsg = encodeURIComponent(`Hola, quiero aprovechar la OFERTA de "${offer.title}" (${offer.platform || 'PlayStation'}) por ${formatPrice(offer.newPrice)} 🎮`);
    window.open(`https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${waMsg}`, '_blank');
}

/**
 * Cierra el modal de checkout
 */
function closeCheckoutModal() {
    const checkoutEl = document.getElementById('checkoutModal');
    if (checkoutEl) {
        checkoutEl.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Cambia la plataforma seleccionada en el checkout (ej: PS5 vs PS4)
 */
function setCheckoutPlatform(platform) {
    currentCheckoutPlatform = platform;
    const pills = document.querySelectorAll('#checkoutPlatformPills .checkout-pill');
    pills.forEach(p => {
        if (p.textContent.trim() === platform) p.classList.add('active');
        else p.classList.remove('active');
    });

    if (currentCheckoutType === 'psplus' && currentCheckoutGame) {
        const tierKey = currentCheckoutGame.tierKey;
        const dur = Number(currentCheckoutAccountType) || 12;
        const plans = PS_PLUS_PLANS[platform] || PS_PLUS_PLANS.PS5;
        const plan = plans[tierKey];
        if (plan) {
            currentCheckoutPrice = plan.prices[dur];
            updateCheckoutPriceDisplay();
        }
        return;
    }

    // Actualizar disponibilidad de secundaria al cambiar plataforma
    if (currentCheckoutGame) {
        const chkSecondary = document.getElementById('chkAccountSecondary');
        const hasSecondaryForPlatform = platform === 'PS4'
            ? (currentCheckoutGame.priceSecondaryPS4 !== undefined ? currentCheckoutGame.priceSecondaryPS4 : currentCheckoutGame.priceSecondary)
            : currentCheckoutGame.priceSecondary;
        if (chkSecondary) {
            chkSecondary.style.display = hasSecondaryForPlatform ? '' : 'none';
        }
        if (!hasSecondaryForPlatform) {
            currentCheckoutAccountType = 'primary';
            const chkPrimary = document.getElementById('chkAccountPrimary');
            if (chkPrimary) chkPrimary.classList.add('active');
            if (chkSecondary) chkSecondary.classList.remove('active');
        }
    }

    updateCheckoutPriceDisplay();
}

/**
 * Cambia el tipo de cuenta seleccionado en el checkout (Primaria vs Secundaria)
 */
function setCheckoutAccount(accountType) {
    const isPS4 = currentCheckoutPlatform === 'PS4';
    const secondaryPrice = isPS4
        ? (currentCheckoutGame && (currentCheckoutGame.priceSecondaryPS4 !== undefined ? currentCheckoutGame.priceSecondaryPS4 : currentCheckoutGame.priceSecondary))
        : (currentCheckoutGame && currentCheckoutGame.priceSecondary);
    if (accountType === 'secondary' && !secondaryPrice) {
        return;
    }
    currentCheckoutAccountType = accountType;
    const chkPrimary = document.getElementById('chkAccountPrimary');
    const chkSecondary = document.getElementById('chkAccountSecondary');

    if (accountType === 'primary') {
        if (chkPrimary) chkPrimary.classList.add('active');
        if (chkSecondary) chkSecondary.classList.remove('active');
    } else {
        if (chkPrimary) chkPrimary.classList.remove('active');
        if (chkSecondary) chkSecondary.classList.add('active');
    }

    updateCheckoutPriceDisplay();
}

/**
 * Actualiza los precios mostrados en el total a transferir y la nota del QR
 */
function updateCheckoutPriceDisplay() {
    if (!currentCheckoutGame) return;

    if (currentCheckoutType === 'psplus') {
        // currentCheckoutPrice ya está calculado o se actualiza según tier y duración
    } else if (currentCheckoutType === 'ps3') {
        currentCheckoutPrice = currentCheckoutGame.price || 0;
    } else {
        const isPS4 = currentCheckoutPlatform === 'PS4';
        if (currentCheckoutAccountType === 'primary') {
            // Primaria: usar precio PS4 si existe y está en PS4, sino el genérico
            currentCheckoutPrice = (isPS4 && currentCheckoutGame.pricePrimaryPS4 !== undefined)
                ? currentCheckoutGame.pricePrimaryPS4
                : currentCheckoutGame.pricePrimary;
        } else {
            // Secundaria: usar precio PS4 si está en PS4, sino el genérico
            const secPS4 = currentCheckoutGame.priceSecondaryPS4;
            const secGeneral = currentCheckoutGame.priceSecondary;
            currentCheckoutPrice = (isPS4 && secPS4 !== undefined) ? secPS4 : (secGeneral || currentCheckoutGame.pricePrimary);
        }
    }

    const priceFormatted = formatPrice(currentCheckoutPrice);
    const totalPriceEl = document.getElementById('checkoutTotalPrice');
    const qrAmountNotice = document.getElementById('qrAmountNotice');

    if (totalPriceEl) totalPriceEl.textContent = priceFormatted;
    if (qrAmountNotice) qrAmountNotice.textContent = priceFormatted;
}

/**
 * Copia el Alias de transferencia al portapapeles con feedback visual
 */
function copyAliasToClipboard() {
    const aliasText = (STORE_CONFIG && STORE_CONFIG.transferAlias) ? STORE_CONFIG.transferAlias : 'album.bruno.182.mp';
    const copyBtn = document.getElementById('copyAliasBtn');
    const copyText = document.getElementById('copyAliasBtnText');

    function showSuccess() {
        if (copyBtn) copyBtn.classList.add('copied');
        if (copyText) copyText.textContent = '¡Copiado!';
        setTimeout(() => {
            if (copyBtn) copyBtn.classList.remove('copied');
            if (copyText) copyText.textContent = 'Copiar';
        }, 2200);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(aliasText).then(showSuccess).catch(() => {
            fallbackCopy(aliasText, showSuccess);
        });
    } else {
        fallbackCopy(aliasText, showSuccess);
    }
}

function fallbackCopy(text, callback) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        callback();
    } catch (err) {
        console.error('Error al copiar:', err);
    }
    document.body.removeChild(tempInput);
}

/**
 * Genera el formato de mensaje exacto para WhatsApp
 */
function buildWhatsAppOrderMessage() {
    const orderNum = currentCheckoutOrderNumber || 'ZD-1047';

    if (currentCheckoutType === 'psplus') {
        const plusTitle = currentCheckoutGame ? currentCheckoutGame.title : 'Membresía PlayStation Plus';
        const platform = currentCheckoutPlatform || 'PS5';
        const durationStr = currentCheckoutGame ? currentCheckoutGame.duration : '12 Meses';
        const totalStr = formatPrice(currentCheckoutPrice);

        return `Hola, ya realicé la transferencia.

Número de orden: ${orderNum}
Suscripción: ${plusTitle}
Consola: ${platform}
Duración: ${durationStr}
Método de pago: Transferencia
Total: ${totalStr}

Adjunto el comprobante de pago.`;
    }

    const gameTitle = currentCheckoutGame ? currentCheckoutGame.title : 'Juego Digital';
    const platform = currentCheckoutPlatform || 'PS5';
    let accountTypeStr = 'Secundaria';

    if (currentCheckoutAccountType === 'primary') {
        accountTypeStr = 'Primaria';
    } else if (currentCheckoutAccountType === 'secondary') {
        accountTypeStr = 'Secundaria';
    } else if (currentCheckoutAccountType === 'digital') {
        accountTypeStr = 'Digital';
    }

    const totalStr = formatPrice(currentCheckoutPrice);

    return `Hola, ya realicé la transferencia.

Número de orden: ${orderNum}
Juego: ${gameTitle}
Plataforma: ${platform}
Tipo de cuenta: ${accountTypeStr}
Método de pago: Transferencia
Total: ${totalStr}

Adjunto el comprobante de pago.`;
}

/**
 * Maneja el clic en "Ya realicé la transferencia":
 * Abre directamente WhatsApp sin pasar por otra pantalla, y deja el pedido en estado pendiente de revisión.
 */
function submitTransferOrder() {
    const msg = buildWhatsAppOrderMessage();
    const phone = (STORE_CONFIG && STORE_CONFIG.whatsappNumber) ? STORE_CONFIG.whatsappNumber : '5491124660453';
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    // Abre directamente WhatsApp
    window.open(waUrl, '_blank');

    // Muestra el banner informativo de estado pendiente (sin marcar pagado ni entregar juego)
    const transferContent = document.getElementById('transferSectionContent');
    const pendingBanner = document.getElementById('transferPendingBanner');
    const bannerOrderNum = document.getElementById('bannerOrderNumber');

    if (bannerOrderNum) bannerOrderNum.textContent = currentCheckoutOrderNumber;
    if (transferContent) transferContent.style.display = 'none';
    if (pendingBanner) pendingBanner.style.display = 'block';
}

/**
 * Permite reabrir el chat de WhatsApp con el mensaje cargado
 */
function reopenWhatsAppOrder() {
    const msg = buildWhatsAppOrderMessage();
    const phone = (STORE_CONFIG && STORE_CONFIG.whatsappNumber) ? STORE_CONFIG.whatsappNumber : '5491124660453';
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
}


/**
 * ==========================================================================
 * 7.5. MEMBRESÍAS PLAYSTATION PLUS Y JUEGOS RELACIONADOS
 * ==========================================================================
 */

// Los planes de PS Plus ahora se definen en games.js (DEFAULT_PS_PLUS_PLANS y PS_PLUS_PLANS)
// para compartirse directamente con el Panel de Administración y permitir actualizaciones en tiempo real.
let currentPsPlusConsole = 'PS5';
let currentPsPlusDuration = 12;

/**
 * Renderiza la grilla de suscripciones de PlayStation Plus
 */
function renderPsPlusSection() {
    const grid = document.getElementById('psplusPlansGrid');
    if (!grid) return;

    const plans = PS_PLUS_PLANS[currentPsPlusConsole] || PS_PLUS_PLANS.PS5;
    const dur = currentPsPlusDuration;

    grid.innerHTML = ['essential', 'extra', 'deluxe'].map(tierKey => {
        const plan = plans[tierKey];
        const price = plan.prices[dur] || 0;
        const durLabel = dur === 1 ? '1 Mes' : `${dur} Meses`;
        const isPopular = plan.popular;

        return `
            <div class="psplus-card ${isPopular ? 'popular-tier' : ''} tier-${tierKey}">
                ${isPopular ? '<div class="psplus-popular-ribbon"><i class="fa-solid fa-star"></i> MÁS ELEGIDO</div>' : ''}
                
                <div class="psplus-card-header">
                    <div class="psplus-tier-badge" style="background: ${plan.color}22; color: ${plan.color}; border: 1px solid ${plan.color}55;">
                        <i class="${plan.icon}"></i> ${plan.badge}
                    </div>
                    <div class="psplus-logo-wrap">
                        <img src="ps-plus-logo.svg" alt="PlayStation Plus" class="psplus-logo-img">
                        <span class="psplus-tier-name" style="color: ${plan.color};">${plan.name.replace('PlayStation Plus ', '')}</span>
                    </div>
                    <p class="psplus-card-desc">${plan.desc}</p>
                </div>

                <div class="psplus-price-box">
                    <div class="psplus-price-main">
                        <span class="psplus-price-amount">${formatPrice(price)}</span>
                        <span class="psplus-price-period">/ ${durLabel}</span>
                    </div>
                    <div class="psplus-console-indicator">
                        <i class="fa-brands fa-playstation"></i> Disponible para <strong>${currentPsPlusConsole}</strong>
                    </div>
                </div>

                <div class="psplus-perks-list">
                    <span class="psplus-perks-title">Beneficios incluidos:</span>
                    <ul>
                        ${plan.perks.map(perk => `
                            <li>
                                <i class="fa-solid fa-circle-check" style="color: ${plan.color};"></i>
                                <span>${perk}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <button type="button" class="btn-buy-psplus" onclick="openCheckoutForPsPlus('${tierKey}', '${currentPsPlusConsole}', ${dur})" style="--tier-color: ${plan.color};">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span>Comprar Membresía</span>
                </button>
            </div>
        `;
    }).join('');
}

function setPsPlusConsole(consoleKey) {
    currentPsPlusConsole = consoleKey;
    const btns = document.querySelectorAll('#psplusConsoleSelector .psplus-console-btn');
    btns.forEach(btn => {
        if (btn.getAttribute('data-console') === consoleKey) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderPsPlusSection();
}

function setPsPlusDuration(months) {
    currentPsPlusDuration = months;
    const btns = document.querySelectorAll('#psplusDurationSelector .psplus-time-btn');
    btns.forEach(btn => {
        if (Number(btn.getAttribute('data-duration')) === months) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    renderPsPlusSection();
}

/**
 * Abre el Checkout específicamente configurado para PlayStation Plus
 */
function openCheckoutForPsPlus(tierKey, consoleKey, durationMonths) {
    currentCheckoutType = 'psplus';
    currentCheckoutPlatform = consoleKey || 'PS5';
    const plans = PS_PLUS_PLANS[currentCheckoutPlatform] || PS_PLUS_PLANS.PS5;
    const plan = plans[tierKey];
    if (!plan) return;

    currentCheckoutAccountType = String(durationMonths);
    currentCheckoutOrderNumber = generateOrderNumber();
    currentCheckoutPrice = plan.prices[durationMonths] || plan.prices[12];

    currentCheckoutGame = {
        id: `psplus-${tierKey}`,
        tierKey: tierKey,
        title: plan.name,
        category: 'MEMBRESÍA PS PLUS',
        image: 'ps-plus-logo.svg',
        duration: `${durationMonths} Mes${durationMonths > 1 ? 'es' : ''}`,
        platform: currentCheckoutPlatform
    };

    const modalImg = document.getElementById('checkoutGameImg');
    const modalTitle = document.getElementById('checkoutGameTitle');
    const modalCat = document.getElementById('checkoutGameCat');
    const orderNumEl = document.getElementById('checkoutOrderNumber');
    const aliasEl = document.getElementById('transferAliasValue');

    if (modalImg) {
        modalImg.src = 'ps-plus-logo.svg';
        modalImg.alt = plan.name;
    }
    if (modalTitle) modalTitle.textContent = `${plan.name} (${currentCheckoutGame.duration})`;
    if (modalCat) modalCat.textContent = 'MEMBRESÍA PLAYSTATION PLUS';
    if (orderNumEl) orderNumEl.textContent = currentCheckoutOrderNumber;
    if (aliasEl && STORE_CONFIG.transferAlias) aliasEl.textContent = STORE_CONFIG.transferAlias;

    // Selector de Consola (PS5 vs PS4)
    const platformPillsContainer = document.getElementById('checkoutPlatformPills');
    if (platformPillsContainer) {
        platformPillsContainer.innerHTML = ['PS5', 'PS4'].map(plat => `
            <button type="button" class="checkout-pill ${plat === currentCheckoutPlatform ? 'active' : ''}" onclick="setCheckoutPlatform('${plat}')">
                ${plat}
            </button>
        `).join('');
    }

    // Fila de Duración adaptada en lugar de cuenta primaria/secundaria
    const accountRow = document.getElementById('checkoutAccountRow');
    if (accountRow) {
        accountRow.style.display = 'flex';
        accountRow.innerHTML = `
            <span class="checkout-config-label"><i class="fa-regular fa-clock"></i> Duración:</span>
            <div class="checkout-account-pills" id="checkoutAccountPills">
                ${[1, 3, 6, 12].map(dur => `
                    <button type="button" class="checkout-acc-pill ${dur === Number(durationMonths) ? 'active' : ''}" onclick="setCheckoutPsPlusDuration(${dur})">
                        ${dur}M
                    </button>
                `).join('')}
            </div>
        `;
    }

    updateCheckoutPriceDisplay();

    // Restablecer vistas
    const transferContent = document.getElementById('transferSectionContent');
    const pendingBanner = document.getElementById('transferPendingBanner');
    if (transferContent) transferContent.style.display = 'block';
    if (pendingBanner) pendingBanner.style.display = 'none';

    // Carrusel de juegos relacionados (Recomendados para jugar con PS Plus)
    renderCheckoutRelatedGames(null);

    const checkoutEl = document.getElementById('checkoutModal');
    if (checkoutEl) {
        checkoutEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function setCheckoutPsPlusDuration(dur) {
    if (currentCheckoutType !== 'psplus' || !currentCheckoutGame) return;
    const tierKey = currentCheckoutGame.tierKey;
    const plans = PS_PLUS_PLANS[currentCheckoutPlatform] || PS_PLUS_PLANS.PS5;
    const plan = plans[tierKey];
    if (!plan) return;

    currentCheckoutAccountType = String(dur);
    currentCheckoutGame.duration = `${dur} Mes${dur > 1 ? 'es' : ''}`;
    currentCheckoutPrice = plan.prices[dur];

    const modalTitle = document.getElementById('checkoutGameTitle');
    if (modalTitle) modalTitle.textContent = `${plan.name} (${currentCheckoutGame.duration})`;

    const pills = document.querySelectorAll('#checkoutAccountPills .checkout-acc-pill');
    pills.forEach(p => {
        if (p.textContent.trim() === `${dur}M`) p.classList.add('active');
        else p.classList.remove('active');
    });

    updateCheckoutPriceDisplay();
}

/**
 * Renderiza el carrusel de juegos relacionados dentro del Checkout (debajo del QR / botones de pago)
 */
function renderCheckoutRelatedGames(currentGame) {
    const track = document.getElementById('checkoutRelatedTrack');
    if (!track) return;

    if (typeof GAMES_DATA === 'undefined' || !GAMES_DATA || GAMES_DATA.length === 0) {
        track.innerHTML = '';
        return;
    }

    const currentId = currentGame ? currentGame.id : null;
    const currentCat = (currentGame && currentGame.category) ? currentGame.category.toLowerCase().trim() : '';

    const availableGames = GAMES_DATA.filter(g => g.id !== currentId && g.availability !== 'sin_stock' && g.inStock !== false);

    let related = [];
    if (currentCat) {
        related = availableGames.filter(g => (g.category || '').toLowerCase().trim() === currentCat);
    }

    if (related.length < 8) {
        const others = availableGames.filter(g => !related.some(r => r.id === g.id));
        related = related.concat(others.slice(0, 10 - related.length));
    }

    const displayGames = related.slice(0, 10);

    track.innerHTML = displayGames.map(game => {
        const coverSrc = resolveGameCover(game.image, game.title);
        const prices = [
            game.pricePrimary,
            game.priceSecondary,
            game.pricePrimaryPS4,
            game.priceSecondaryPS4
        ].filter(p => typeof p === 'number' && p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : (game.pricePrimary || 0);

        const platTags = (game.platforms || ['PS5', 'PS4']).map(p => `<span class="chk-rel-plat ${p.toLowerCase()}">${p}</span>`).join('');

        return `
            <div class="chk-rel-card" onclick="selectRelatedGame(${game.id})" title="Ver ${escapeHtml(game.title)}">
                <div class="chk-rel-img-box">
                    <img src="${coverSrc}" alt="${escapeHtml(game.title)}" class="chk-rel-img" loading="lazy">
                    <div class="chk-rel-plat-tags">${platTags}</div>
                </div>
                <div class="chk-rel-info">
                    <span class="chk-rel-cat">${escapeHtml((game.category || 'JUEGO').toUpperCase())}</span>
                    <h5 class="chk-rel-name">${escapeHtml(game.title)}</h5>
                    <div class="chk-rel-price">
                        <span class="chk-rel-price-lbl">Desde</span>
                        <span class="chk-rel-price-val">${formatPrice(minPrice)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function selectRelatedGame(gameId) {
    openCheckoutModal(gameId, 'catalog', currentCheckoutAccountType === 'secondary' ? 'secondary' : 'primary', currentCheckoutPlatform);
    const container = document.querySelector('.checkout-container');
    if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function scrollCheckoutRelated(direction) {
    const track = document.getElementById('checkoutRelatedTrack');
    if (!track) return;
    const cardWidth = 160;
    track.scrollBy({ left: direction * cardWidth * 2, behavior: 'smooth' });
}


/**
 * 8. CONFIGURACIÓN DE ESCUCHADORES DE EVENTOS
 */
function initEventListeners() {
    // Buscador en tiempo real
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            if (clearSearchBtn) {
                clearSearchBtn.style.display = currentSearchQuery.length > 0 ? 'block' : 'none';
            }
            applyFiltersAndRender();
        });
    }

    // Botón para limpiar búsqueda
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentSearchQuery = '';
            clearSearchBtn.style.display = 'none';
            searchInput.focus();
            applyFiltersAndRender();
        });
    }

    // Botones de filtro de plataforma / oferta
    platformFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            platformFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const plat = btn.getAttribute('data-platform');
            const cat = btn.getAttribute('data-category');

            if (cat === 'ofertas') {
                currentPlatformFilter = 'all';
                currentCategoryFilter = 'ofertas';
            } else if (plat) {
                currentPlatformFilter = plat;
                currentCategoryFilter = 'all';
            }

            applyFiltersAndRender();
        });
    });

    // Selector de orden
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortOption = e.target.value;
            applyFiltersAndRender();
        });
    }

    // Cerrar modales con botones X
    if (closeGameModalBtn) closeGameModalBtn.addEventListener('click', closeGameModal);
    if (closeInfoModalBtn) closeInfoModalBtn.addEventListener('click', closeInfoModal);
    const closeCheckoutModalBtn = document.getElementById('closeCheckoutModalBtn');
    if (closeCheckoutModalBtn) closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);

    // Cerrar modales haciendo clic en el fondo oscuro
    if (gameModal) {
        gameModal.addEventListener('click', (e) => {
            if (e.target === gameModal) closeGameModal();
        });
    }
    if (infoModal) {
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) closeInfoModal();
        });
    }
    const chkModalEl = document.getElementById('checkoutModal');
    if (chkModalEl) {
        chkModalEl.addEventListener('click', (e) => {
            if (e.target === chkModalEl) closeCheckoutModal();
        });
    }

    // Cerrar modales con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGameModal();
            closeInfoModal();
            closeCheckoutModal();
            if (dotsDropdown) dotsDropdown.classList.remove('show');
            if (dotsMenuBtn) dotsMenuBtn.classList.remove('active');
        }
    });

    // Menú de 3 puntos
    if (dotsMenuBtn && dotsDropdown) {
        dotsMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dotsDropdown.classList.toggle('show');
            dotsMenuBtn.classList.toggle('active');
        });

        // Cerrar menú si se hace clic afuera
        document.addEventListener('click', (e) => {
            if (!dotsMenuBtn.contains(e.target) && !dotsDropdown.contains(e.target)) {
                dotsDropdown.classList.remove('show');
                dotsMenuBtn.classList.remove('active');
            }
        });
    }

    // Menú hamburguesa móvil
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show-mobile');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('show-mobile')) {
                    icon.classList.replace('fa-bars', 'fa-xmark');
                } else {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            }
        });

        // Cerrar menú mobile al tocar un enlace (salvo el botón de catálogo en móvil)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (link.id === 'catalogoMenuLink' && window.innerWidth <= 992) {
                    return; // Permite abrir el desplegable en celular sin cerrar el menú
                }
                navLinks.classList.remove('show-mobile');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // Control del desplegable de Catálogo (PS4, PS5, PS3)
    const catalogoDropdownItem = document.getElementById('catalogoDropdownItem');
    const catalogoMenuLink = document.getElementById('catalogoMenuLink');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');

    if (catalogoMenuLink && catalogoDropdownItem) {
        catalogoMenuLink.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                catalogoDropdownItem.classList.toggle('open');
            }
        });

        // Cerrar dropdown al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!catalogoDropdownItem.contains(e.target)) {
                catalogoDropdownItem.classList.remove('open');
            }
        });
    }

    // Clic en opciones del desplegable: Juegos de PS4, PS5 o PS3
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            const filterPlat = link.getAttribute('data-filter-plat');
            if (filterPlat) {
                setPlatformFilter(filterPlat);
            }

            if (catalogoDropdownItem) {
                catalogoDropdownItem.classList.remove('open');
            }

            if (navLinks && navLinks.classList.contains('show-mobile')) {
                navLinks.classList.remove('show-mobile');
                const icon = mobileToggle ? mobileToggle.querySelector('i') : null;
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    });

    // Resaltado del enlace de navegación activo al hacer scroll
    window.addEventListener('scroll', handleScrollSpy);
}

/**
 * Filtra el catálogo por consola (PS4 o PS5) activando los botones de la grilla
 */
function setPlatformFilter(platform) {
    platformFilterBtns.forEach(btn => {
        if (btn.getAttribute('data-platform') === platform) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    currentPlatformFilter = platform;
    currentCategoryFilter = 'all';
    applyFiltersAndRender();
}


/**
 * 9. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                
                // Cerramos los demás
                faqItems.forEach(i => i.classList.remove('open'));

                // Si no estaba abierto, lo abrimos
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        }
    });
}


/**
 * 10. RESALTAR ENLACE ACTIVO EN NAVEGACIÓN
 */
function handleScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}


/**
 * 11. ACCESO RÁPIDO PARA FILTRAR OFERTAS DESDE EL BOTÓN SUPERIOR
 */
function filterByOffer() {
    platformFilterBtns.forEach(b => {
        if (b.getAttribute('data-category') === 'ofertas') {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });
    currentPlatformFilter = 'all';
    currentCategoryFilter = 'ofertas';
    applyFiltersAndRender();
}


/**
 * 12. RESTABLECER FILTROS
 */
function resetSearchAndFilters() {
    if (searchInput) searchInput.value = '';
    currentSearchQuery = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';

    currentPlatformFilter = 'all';
    currentCategoryFilter = 'all';
    currentSortOption = 'featured';

    if (sortSelect) sortSelect.value = 'featured';

    platformFilterBtns.forEach((b, index) => {
        if (index === 0) b.classList.add('active');
        else b.classList.remove('active');
    });

    applyFiltersAndRender();
}


/**
 * Utilidad para escapar texto HTML y evitar problemas con comillas
 */
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/**
 * ==========================================================================
 * 13. FONDO ANIMADO DE PARTÍCULAS AMARILLAS (particlesCanvas)
 * Partículas doradas que caen suavemente desde arriba hacia abajo
 * ==========================================================================
 */
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Ajustamos la cantidad según el ancho de pantalla (menos en celulares para máxima fluidez)
    const isMobile = width < 768;
    const particleCount = isMobile ? 35 : 65;

    const particles = [];

    class Particle {
        constructor(initial = false) {
            this.reset(initial);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            // Al inicio distribuimos en toda la pantalla; luego reaparecen arriba
            this.y = initial ? Math.random() * height : -15;
            // Mayoría pequeñas (1-2px) y algunas ligeramente mayores (hasta 3.2px)
            this.radius = Math.random() < 0.72 ? Math.random() * 1.4 + 0.8 : Math.random() * 1.6 + 2.0;
            // Velocidad de caída lenta y suave
            this.speedY = Math.random() * 0.45 + 0.22;
            // Oscilación horizontal suave
            this.speedX = (Math.random() - 0.5) * 0.18;
            this.swayAngle = Math.random() * Math.PI * 2;
            this.swaySpeed = Math.random() * 0.015 + 0.008;
            // Opacidad suave
            this.baseAlpha = Math.random() * 0.45 + 0.25;
            this.alpha = this.baseAlpha;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseAngle = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speedY;
            this.swayAngle += this.swaySpeed;
            this.x += Math.sin(this.swayAngle) * 0.3 + this.speedX;

            this.pulseAngle += this.pulseSpeed;
            this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.12;

            // Al salir por abajo o costados, vuelve a nacer arriba
            if (this.y > height + 15 || this.x < -20 || this.x > width + 20) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

            // Brillo dorado para partículas más grandes
            if (this.radius > 2.0) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(255, 229, 0, 0.75)';
            }

            const currentAlpha = Math.max(0.12, Math.min(this.alpha, 0.85));
            ctx.fillStyle = `rgba(255, 229, 0, ${currentAlpha})`;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(true));
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }

    animate();

    // Redimensionar al cambiar el tamaño de ventana
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }, 150);
    });
}


/**
 * ==========================================================================
 * 14. SECCIÓN NOVEDADES (CARRUSEL DINÁMICO)
 * ==========================================================================
 */
let currentNovedadIndex = 0;
let novedadesTimer = null;

function renderNovedades() {
    const track = document.getElementById('novedadesTrack');
    const indicators = document.getElementById('novedadesIndicators');
    if (!track || !indicators || typeof NOVEDADES_DATA === 'undefined') return;

    if (NOVEDADES_DATA.length === 0) {
        track.innerHTML = '<p style="color:var(--text-muted); padding:30px;">No hay novedades en este momento.</p>';
        return;
    }

    // Armado de slides con imágenes grandes
    track.innerHTML = NOVEDADES_DATA.map((item, index) => {
        const activeClass = index === 0 ? 'active' : '';
        const platformBadges = (item.platforms || []).map(p => {
            const cls = p === 'PS5' ? 'badge-ps5' : 'badge-ps4';
            return `<span class="${cls}">${p}</span>`;
        }).join('');

        // Botón de acción: si está disponible, botón directo de compra; si no, consultar / reservar
        const isAvailable = item.isAvailable === true || (item.tag && item.tag.toUpperCase().includes('DISPONIBLE'));
        let ctaButtonHtml = '';
        if (isAvailable) {
            ctaButtonHtml = `
                <button type="button" class="novedades-cta-btn novedades-buy-btn" onclick="openCheckoutForNovedad(${index})" title="Comprar ${escapeHtml(item.title)} ahora">
                    <i class="fa-solid fa-bolt"></i> Comprar Ahora
                </button>
            `;
        } else {
            const waMsg = encodeURIComponent(`Hola, quiero consultar información o reservar "${item.title}" para PlayStation 🎮`);
            const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${waMsg}`;
            ctaButtonHtml = `
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="novedades-cta-btn">
                    <i class="fa-brands fa-whatsapp"></i> Consultar / Reservar
                </a>
            `;
        }

        const slideClass = item.id === 1 ? 'slide-gta6' : (item.id === 2 ? 'slide-fc27' : 'slide-cod');
        const imgStyles = [];
        if (item.imageFit) imgStyles.push(`object-fit: ${item.imageFit}`);
        if (item.imagePosition) imgStyles.push(`object-position: ${item.imagePosition}`);
        const inlineStyle = imgStyles.length > 0 ? ` style="${imgStyles.join('; ')}"` : '';

        return `
            <div class="novedades-slide ${activeClass} ${slideClass}" data-index="${index}">
                <img src="${item.image}" alt="${escapeHtml(item.title)}"${inlineStyle} loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80';">
                <div class="novedades-slide-overlay">
                    <span class="novedades-tag"><i class="fa-solid fa-star"></i> ${escapeHtml(item.tag || 'NOVEDAD')}</span>
                    <h3 class="novedades-title">${escapeHtml(item.title)}</h3>
                    <p class="novedades-subtitle">${escapeHtml(item.subtitle || '')}</p>
                    <div class="novedades-actions">
                        <div class="novedades-platforms">${platformBadges}</div>
                        ${ctaButtonHtml}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Indicadores interactivos
    indicators.innerHTML = NOVEDADES_DATA.map((_, index) => {
        const activeClass = index === 0 ? 'active' : '';
        return `<button class="carousel-dot ${activeClass}" data-slide="${index}" aria-label="Ir a novedad ${index + 1}"></button>`;
    }).join('');
}

function initNovedadesCarousel() {
    const track = document.getElementById('novedadesTrack');
    const container = document.getElementById('novedadesCarousel');
    const prevBtn = document.getElementById('novedadesPrev');
    const nextBtn = document.getElementById('novedadesNext');
    const indicators = document.getElementById('novedadesIndicators');

    if (!track || typeof NOVEDADES_DATA === 'undefined' || NOVEDADES_DATA.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    function goToSlide(index) {
        currentNovedadIndex = (index + NOVEDADES_DATA.length) % NOVEDADES_DATA.length;
        track.style.transform = `translateX(-${currentNovedadIndex * 100}%)`;

        const slides = track.querySelectorAll('.novedades-slide');
        slides.forEach((s, idx) => {
            if (idx === currentNovedadIndex) s.classList.add('active');
            else s.classList.remove('active');
        });

        if (indicators) {
            const dots = indicators.querySelectorAll('.carousel-dot');
            dots.forEach((d, idx) => {
                if (idx === currentNovedadIndex) d.classList.add('active');
                else d.classList.remove('active');
            });
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentNovedadIndex + 1);
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentNovedadIndex - 1);
            resetAutoplay();
        });
    }

    if (indicators) {
        indicators.addEventListener('click', (e) => {
            const dot = e.target.closest('.carousel-dot');
            if (dot) {
                const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
                if (!isNaN(targetIndex)) {
                    goToSlide(targetIndex);
                    resetAutoplay();
                }
            }
        });
    }

    function startAutoplay() {
        stopAutoplay();
        novedadesTimer = setInterval(() => {
            goToSlide(currentNovedadIndex + 1);
        }, 5500);
    }

    function stopAutoplay() {
        if (novedadesTimer) {
            clearInterval(novedadesTimer);
            novedadesTimer = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    if (container) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);

        // Soporte táctil
        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                goToSlide(currentNovedadIndex + 1);
            } else if (touchEndX - touchStartX > 50) {
                goToSlide(currentNovedadIndex - 1);
            }
            startAutoplay();
        }, { passive: true });
    }

    startAutoplay();
}


/**
 * ==========================================================================
 * 15. SECCIÓN OFERTAS DESTACADAS (SHOWCASE GRANDES IMÁGENES)
 * ==========================================================================
 */
let currentOfferIndex = 0;
let offersTimer = null;

function renderOffersShowcase() {
    const track = document.getElementById('offersShowcaseTrack');
    const indicators = document.getElementById('offersIndicators');
    if (!track || !indicators || typeof OFERTAS_SHOWCASE_DATA === 'undefined') return;

    if (OFERTAS_SHOWCASE_DATA.length === 0) {
        const showcase = document.getElementById('offersShowcase');
        if (showcase) showcase.style.display = 'none';
        return;
    }

    // Armado de slides con imágenes grandes
    track.innerHTML = OFERTAS_SHOWCASE_DATA.map((offer, index) => {
        const activeClass = index === 0 ? 'active' : '';

        // Buscar el juego real en el catálogo para tener precios y datos siempre precisos
        const norm = (offer.title || '').toLowerCase().trim();
        const gamesList = typeof GAMES_DATA !== 'undefined' ? GAMES_DATA : [];
        const matchedGame = gamesList.find(g => {
            const gt = (g.title || '').toLowerCase().trim();
            return gt === norm || gt.includes(norm) || norm.includes(gt);
        });

        const effectiveNewPrice = Number(offer.newPrice) || Number(offer.price) || (matchedGame ? Number(matchedGame.pricePrimary) : 0);
        const effectiveOldPrice = Number(offer.oldPrice) || (matchedGame ? Number(matchedGame.oldPricePrimary) : (effectiveNewPrice ? Math.round(effectiveNewPrice * 1.3) : 0));
        const effectiveDiscount = offer.discount || (matchedGame ? matchedGame.discount : (effectiveOldPrice > effectiveNewPrice ? `-${Math.round(((effectiveOldPrice - effectiveNewPrice) / effectiveOldPrice) * 100)}%` : null));
        const effectiveCover = resolveGameCover(offer.image || (matchedGame ? matchedGame.image : ''), offer.title);
        const effectivePlatform = offer.platform || (matchedGame && matchedGame.platforms ? matchedGame.platforms.join(' / ') : 'PS4 / PS5');

        return `
            <div class="offer-showcase-slide ${activeClass}" data-index="${index}">
                <img src="${effectiveCover}" alt="${escapeHtml(offer.title)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80';">
                <div class="offer-showcase-overlay">
                    <span class="offer-showcase-tag"><i class="fa-solid fa-fire"></i> ${escapeHtml(offer.tag || 'OFERTA DESTACADA')}</span>
                    <h3 class="offer-showcase-title">${escapeHtml(offer.title)}</h3>
                    <div class="offer-showcase-platform"><i class="fa-brands fa-playstation"></i> ${escapeHtml(effectivePlatform)}</div>
                    <div class="offer-showcase-pricing">
                        ${effectiveOldPrice && effectiveOldPrice > effectiveNewPrice ? `<span class="offer-showcase-old-price">${formatPrice(effectiveOldPrice)}</span>` : ''}
                        <span class="offer-showcase-new-price">${formatPrice(effectiveNewPrice)}</span>
                        ${effectiveDiscount ? `<span class="offer-showcase-discount">${escapeHtml(effectiveDiscount)}</span>` : ''}
                    </div>
                    <button type="button" class="offer-showcase-cta" onclick="openCheckoutForOffer(${index})" title="Comprar oferta de ${escapeHtml(offer.title)}">
                        <i class="fa-solid fa-cart-shopping"></i> Comprar Oferta
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Indicadores interactivos
    indicators.innerHTML = OFERTAS_SHOWCASE_DATA.map((_, index) => {
        const activeClass = index === 0 ? 'active' : '';
        return `<button class="carousel-dot ${activeClass}" data-slide="${index}" aria-label="Ir a oferta ${index + 1}"></button>`;
    }).join('');
}

function initOffersShowcase() {
    const track = document.getElementById('offersShowcaseTrack');
    const container = document.getElementById('offersShowcase');
    const prevBtn = document.getElementById('offersPrev');
    const nextBtn = document.getElementById('offersNext');
    const indicators = document.getElementById('offersIndicators');

    if (!track || typeof OFERTAS_SHOWCASE_DATA === 'undefined' || OFERTAS_SHOWCASE_DATA.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    function goToSlide(index) {
        currentOfferIndex = (index + OFERTAS_SHOWCASE_DATA.length) % OFERTAS_SHOWCASE_DATA.length;
        track.style.transform = `translateX(-${currentOfferIndex * 100}%)`;

        const slides = track.querySelectorAll('.offer-showcase-slide');
        slides.forEach((s, idx) => {
            if (idx === currentOfferIndex) s.classList.add('active');
            else s.classList.remove('active');
        });

        if (indicators) {
            const dots = indicators.querySelectorAll('.carousel-dot');
            dots.forEach((d, idx) => {
                if (idx === currentOfferIndex) d.classList.add('active');
                else d.classList.remove('active');
            });
        }
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentOfferIndex + 1);
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentOfferIndex - 1);
            resetAutoplay();
        });
    }

    if (indicators) {
        indicators.addEventListener('click', (e) => {
            const dot = e.target.closest('.carousel-dot');
            if (dot) {
                const targetIndex = parseInt(dot.getAttribute('data-slide'), 10);
                if (!isNaN(targetIndex)) {
                    goToSlide(targetIndex);
                    resetAutoplay();
                }
            }
        });
    }

    function startAutoplay() {
        stopAutoplay();
        offersTimer = setInterval(() => {
            goToSlide(currentOfferIndex + 1);
        }, 6000);
    }

    function stopAutoplay() {
        if (offersTimer) {
            clearInterval(offersTimer);
            offersTimer = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    if (container) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', startAutoplay);

        let touchStartX = 0;
        let touchEndX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                goToSlide(currentOfferIndex + 1);
            } else if (touchEndX - touchStartX > 50) {
                goToSlide(currentOfferIndex - 1);
            }
            startAutoplay();
        }, { passive: true });
    }

    startAutoplay();
}


/**
 * ==========================================================================
 * 16. SECCIÓN JUEGOS DE PS3
 * ==========================================================================
 */
function renderPs3Games() {
    const grid = document.getElementById('ps3Grid');
    if (!grid || typeof PS3_GAMES_DATA === 'undefined') return;

    if (PS3_GAMES_DATA.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted); grid-column:1/-1;">No hay juegos de PS3 disponibles por el momento.</p>';
        return;
    }

    grid.innerHTML = PS3_GAMES_DATA.map(game => {
        const isBundle = Boolean(game.isBundle);
        const hasPrice = typeof game.price === 'number' && game.price > 0;

        // Badge superior si es trilogía o pack
        const badgeTop = isBundle
            ? `<span class="ps3-badge-trilogy"><i class="fa-solid fa-crown"></i> Pack Trilogía</span>`
            : '';

        // Lista de juegos incluidos en la trilogía
        let bundleListHtml = '';
        if (isBundle && Array.isArray(game.bundleGames) && game.bundleGames.length > 0) {
            const items = game.bundleGames.map(item => `<li><i class="fa-solid fa-check"></i> <strong>${escapeHtml(item)}</strong></li>`).join('');
            bundleListHtml = `
                <ul class="ps3-bundle-list" title="Juegos incluidos en este pack">
                    ${items}
                </ul>
            `;
        }

        // Display de precio
        const priceDisplay = hasPrice
            ? `<span class="ps3-price">${formatPrice(game.price)}</span>`
            : `<span class="ps3-price-placeholder"><i class="fa-solid fa-tag"></i> Consultar precio</span>`;

        // Mensaje y enlace WhatsApp
        let waMsg;
        if (hasPrice) {
            waMsg = isBundle
                ? `Hola, quiero comprar la "${game.title}" para PS3 por ${formatPrice(game.price)} 🎮`
                : `Hola, quiero comprar "${game.title}" para PS3 por ${formatPrice(game.price)} 🎮`;
        } else {
            waMsg = isBundle
                ? `Hola, quiero consultar el precio y disponibilidad de la "${game.title}" para PS3 🎮`
                : `Hola, quiero consultar el precio y disponibilidad de "${game.title}" para PS3 🎮`;
        }
        const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
        const btnText = hasPrice ? 'Comprar por WhatsApp' : 'Consultar precio';

        const isPs3OutOfStock = (game.availability === 'sin_stock' || game.inStock === false);
        const isPs3Upcoming = (game.availability === 'proximamente');
        let ps3BtnHtml = '';
        if (!isPs3OutOfStock) {
            const btnText = isPs3Upcoming ? 'Consultar / Encargar' : (hasPrice ? 'Comprar por WhatsApp' : 'Consultar precio');
            ps3BtnHtml = hasPrice ? `
                <button type="button" class="ps3-buy-btn" onclick="openCheckoutForPs3(${game.id})" title="${btnText} para ${escapeHtml(game.title)}">
                    <i class="fa-brands fa-whatsapp"></i> <span>${btnText}</span>
                </button>
            ` : `
                <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="ps3-buy-btn" title="${btnText} para ${escapeHtml(game.title)}">
                    <i class="fa-brands fa-whatsapp"></i> <span>${btnText}</span>
                </a>
            `;
        } else {
            ps3BtnHtml = `<span style="color: #EF4444; font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;"><i class="fa-solid fa-ban"></i> Sin Stock</span>`;
        }

        return `
            <article class="ps3-card" data-id="${game.id}">
                <div class="ps3-card-media">
                    <span class="ps3-badge">PS3</span>
                    ${badgeTop}
                    <img src="${game.image}" alt="${escapeHtml(game.title)}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';">
                </div>
                <div class="ps3-card-body">
                    <h3 class="ps3-card-title">${escapeHtml(game.title)}</h3>
                    <p class="ps3-card-desc">${escapeHtml(game.description || '')}</p>
                    ${bundleListHtml}
                    <div class="ps3-card-footer">
                        ${priceDisplay}
                        ${ps3BtnHtml}
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

