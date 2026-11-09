# Reglas de Proyecto - Zona DigitalARG

## Actualización de Precios y Portadas en el Panel de Administración (Admin)

Cuando el usuario pida modificar o actualizar los precios o las portadas de los juegos:

1. **Aplicar directamente en el código del Panel y la Web:**
   - Modificar la función `getUpdatedPriceForGame` en `admin/admin.js` y en `app.js`.
   - Modificar también `games.js` para mantener el catálogo local sincronizado.
   - No pedirle al usuario que ejecute scripts manuales en Supabase; el panel se encarga de mostrar los precios al instante y sincronizarlos con la base de datos automáticamente.

2. **Reglas estrictas de edición de juegos:**
   - Modificar **únicamente** los campos solicitados (por ejemplo, precios de Primaria y Secundaria o portadas).
   - **No alterar** el formato, diseño, títulos, descripciones, categorías ni ninguna otra propiedad no especificada.
   - Soportar y respetar siempre la diferenciación de precios entre **PS4** y **PS5** cuando aplique.

3. **Regla permanente y estricta para Portadas de Juegos:**
   - **NUNCA usar Inteligencia Artificial (IA) para generar fotos o portadas de juegos.**
   - Descargar y utilizar siempre las **fotos y portadas reales oficiales extraídas de la web / Google / tiendas oficiales (Steam, PlayStation Store, etc.)**, manteniendo la misma estética, autenticidad y formato que el resto de juegos del catálogo (como Elden Ring, The Last of Us, Bloodborne, Days Gone, etc.).
   - Asegurarse de que cada portada corresponda **exactamente** al juego y entrega indicada (no confundir secuelas, precuelas, DLCs ni ediciones distintas) y verificar que la URL responda `HTTP 200` real (incluyendo los hashes de Steam para juegos recientes o URLs oficiales de PlayStation Store).
   - Mantener medidas y proporciones uniformes en todas las tarjetas del catálogo (`aspect-ratio: 16 / 10`, `object-fit: cover`, `object-position: center center`) con imágenes nítidas y de alta resolución, evitando imágenes estiradas, deformadas, pixeladas o mal recortadas.
   - Sincronizar siempre cualquier corrección de portada o título en `games.js` (`MASTER_COVER_OVERRIDES` y `MASTER_TITLE_OVERRIDES`), `app.js` (`resolveGameCover` / `resolveGameTitle`) y `admin/admin.js` para que la sincronización en vivo con Supabase nunca pise portadas corregidas con enlaces viejos o caídos.

4. **Regla estricta sobre Nombres de Juegos y Exclusión de «Español Latino»:**
   - Utilizar siempre el nombre oficial y correctamente escrito de cada juego, diferenciando ediciones cuando corresponda (por ejemplo, `Standard Edition`, `Deluxe Edition`, `Ultimate Edition`) y sin caracteres rotos ni etiquetas innecesarias como `SUBTITULADO`.
   - **NUNCA incluir ni conservar en el catálogo público ni en el panel de administración juegos o versiones que contengan la indicación «Español Latino» en su nombre.** Deben filtrarse y eliminarse automáticamente tanto en `games.js`, `app.js` y `admin/admin.js` como en Supabase.

5. **Administración desde el Panel Actual y Comprobación Obligatoria en Vivo:**
   - Trabajar siempre sobre el catálogo y la barra de administración existentes (`admin/index.html` y `admin/admin.js`), sin crear paneles paralelos ni eliminar funcionalidades existentes.
   - **Comprobación obligatoria en navegador real antes de finalizar:** Nunca limitarse a editar el código. Siempre abrir la página real de Zona Digitalarg en el navegador (tanto en vista **computadora** como en vista **celular**), renderizar el catálogo completo tras la sincronización con Supabase, verificar que el 100% de las imágenes carguen sin errores (`img.complete && img.naturalWidth > 0`), comprobar nombres y precios, y **salir y volver a entrar a la página** para confirmar que todo se mantenga estable.

6. **Regla Permanente: Organización de Juegos y sus Ediciones (Cero Duplicados por Edición):**
   - Cada vez que el usuario envíe una nueva lista de juegos para agregar a Zona Digitalarg, identificar si hay diferentes versiones o ediciones de un mismo juego (por ejemplo, `Versión Normal` / `Standard Edition`, `Deluxe Edition`, `Ultimate Edition`, `Gold Edition`, etc.).
   - **NUNCA crear productos duplicados cuando se trate del mismo juego con distintas ediciones.**
   - Agrupar siempre todas las versiones dentro de un **único producto** utilizando el sistema de selección de ediciones implementado en el catálogo y en el panel de administración (sin límite de ediciones: 2, 3 o más).
   - Cada edición debe tener sus propios precios de cuenta primaria y secundaria y enviar su nombre exacto en el mensaje de compra de WhatsApp junto con el juego, plataforma, tipo de cuenta y precio.
   - Si el juego ya existe en el catálogo y el usuario envía una edición nueva, agregar esa edición al producto existente en lugar de crear otro producto.
   - Si existe duda sobre si dos versiones pertenecen al mismo juego, consultar al usuario antes de agregarlas.

7. **Visibilidad Independiente para Juegos «Sin Stock»:**
   - Todo juego marcado como `Sin stock` en el panel de administración dispone de la configuración independiente **«Mostrar en el catálogo»** (visible con etiqueta *Sin stock* y compra deshabilitada) o **«No mostrar en el catálogo»** (oculto en la tienda pública pero conservado íntegramente en la administración para republicarlo cuando vuelva a estar disponible).
