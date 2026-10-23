/**
 * ==========================================================================
 * ZONA DIGITALARG - CONFIGURACIÓN DE SUPABASE
 * ==========================================================================
 * 
 * Este archivo conecta la página web pública y el panel de administración (/admin)
 * con tu proyecto en Supabase.
 * 
 * INSTRUCCIONES:
 * 1. Creá tu proyecto gratuito en https://supabase.com
 * 2. En el panel de Supabase andá a: Project Settings -> API
 * 3. Copiá la "Project URL" y la "anon public key"
 * 4. Pegalas en las dos constantes abajo:
 * 
 * NOTA DE SEGURIDAD:
 * La clave "anon" es pública y segura para usar en el navegador porque Supabase
 * protege tu base de datos mediante políticas RLS (Row Level Security):
 * - Los visitantes públicos SOLO pueden leer (SELECT) los juegos.
 * - Únicamente tu usuario administrador que inició sesión puede crear, editar o borrar (INSERT, UPDATE, DELETE).
 * NUNCA coloques aquí la clave "service_role".
 */

const SUPABASE_CONFIG = {
    // URL del proyecto Supabase
    url: "https://gtygbsxaeqeaqdliduno.supabase.co",
    
    // Clave publishable pública de Supabase
    anonKey: "sb_publishable_jB6yhgaIyhwGA9MJ8bjA0Q_wYW2acTk",
    
    // Nombre del bucket de almacenamiento para las fotos de los juegos
    storageBucket: "game-covers"
};

let supabaseClient = null;

function initSupabase() {
    if (supabaseClient) return supabaseClient;

    if (typeof supabase !== 'undefined' && 
        SUPABASE_CONFIG.url && 
        SUPABASE_CONFIG.anonKey && 
        !SUPABASE_CONFIG.url.includes("TU_PROYECTO") && 
        !SUPABASE_CONFIG.anonKey.includes("TU_CLAVE_ANON")) {
        try {
            supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            return supabaseClient;
        } catch (err) {
            console.error("Error al inicializar Supabase:", err);
            return null;
        }
    }
    return null;
}
