-- ==========================================================================
-- ZONA DIGITALARG - INSERTAR 27 NUEVOS JUEGOS
-- ==========================================================================
-- Nota: El Panel de Administración ya sincroniza e inserta automáticamente 
-- estos juegos al iniciar sesión, por lo que no es obligatorio correr este SQL.
-- ==========================================================================

INSERT INTO public.games (
    title, platforms, category, price_primary, price_secondary, 
    price_primary_ps4, price_secondary_ps4, price_ps3, is_offer, 
    image, description, genre, languages, size, availability, is_featured
) VALUES
-- 1. DiRT Rally 2.0
(
    'DiRT Rally 2.0', ARRAY['PS4', 'PS5'], 'carreras', 16500, 9500, 16500, 9500, NULL, FALSE,
    'dirt-rally-2.jpg',
    'Viví la experiencia definitiva de rally todoterreno a través de circuitos icónicos de Nueva Zelanda, Argentina, España, Polonia, Australia y EE.UU. con físicas hiperrealistas y degradación de pista.',
    'Carreras / Rally / Simulación', 'Español, Inglés', 'Aprox. 50 GB', 'disponible', FALSE
),
-- 2. Until Dawn (Versión 2015 - PS4)
(
    'Until Dawn (Versión 2015 - PS4)', ARRAY['PS4', 'PS5'], 'terror', 7500, 5900, 7500, 5900, NULL, FALSE,
    'until-dawn-2015.jpg',
    'Ocho amigos atrapados en un refugio de montaña aislado descubren que no están solos. Tus decisiones y el ''efecto mariposa'' determinarán quién sobrevive hasta el amanecer.',
    'Terror / Supervivencia / Cinemático / Narrativo', 'Español Latino, Inglés', 'Aprox. 46 GB', 'disponible', FALSE
),
-- 3. Watch Dogs
(
    'Watch Dogs', ARRAY['PS4', 'PS5'], 'accion', 7500, 6000, 7500, 6000, NULL, FALSE,
    'watch-dogs.jpg',
    'Controlá la ciudad de Chicago convertida en tu arma definitiva como Aiden Pearce, un hacker brillante en busca de justicia que puede hackear cámaras, semáforos y redes eléctricas.',
    'Acción / Aventura / Mundo Abierto / Hackeo', 'Español Latino, Inglés', 'Aprox. 25 GB', 'disponible', FALSE
),
-- 4. Uncharted: Colección Legado de Ladrones
(
    'Uncharted: Colección Legado de Ladrones', ARRAY['PS5'], 'aventura', 20000, 10000, NULL, NULL, NULL, FALSE,
    'uncharted-legado-ladrones.jpg',
    'Viví las aclamadas aventuras cinematográficas de UNCHARTED 4: A Thief''s End y UNCHARTED: The Lost Legacy, remasterizadas con gráficos deslumbrantes en 4K y 60 FPS en PlayStation 5.',
    'Acción / Aventura / Disparos / Cinemático', 'Español Latino, Inglés', 'Aprox. 68 GB', 'disponible', TRUE
),
-- 5. Infamous Second Son
(
    'Infamous Second Son', ARRAY['PS4', 'PS5'], 'accion', 7500, 6000, 7500, 6000, NULL, FALSE,
    'infamous-second-son.jpg',
    'Rodeado por una sociedad que les teme, los superhumanos son perseguidos. Delsin Rowe descubre sus asombrosos poderes de humo, neón y video en las calles de Seattle.',
    'Acción / Superpoderes / Mundo Abierto', 'Español Latino, Inglés', 'Aprox. 24 GB', 'disponible', FALSE
),
-- 6. Detroit: Become Human
(
    'Detroit: Become Human', ARRAY['PS4', 'PS5'], 'aventura', 7500, 6000, 7500, 6000, NULL, FALSE,
    'detroit-become-human.jpg',
    'Detroit, 2038. La tecnología ha evolucionado hasta crear androides idénticos a los humanos. Controlá tres androides distintos en una historia profunda donde cada decisión tiene consecuencias irreversibles.',
    'Aventura / Narrativo / Ciencia Ficción / Cinemático', 'Español Latino, Inglés', 'Aprox. 42 GB', 'disponible', FALSE
),
-- 7. Horizon Forbidden West
(
    'Horizon Forbidden West', ARRAY['PS4', 'PS5'], 'aventura', 16500, 9500, 16500, 9500, NULL, FALSE,
    'horizon-forbidden-west.jpg',
    'Acompañá a Aloy mientras desafía una frontera majestuosa pero peligrosa en el Oeste Prohibido, enfrentando máquinas asombrosas y nuevas tribus misteriosas para salvar el futuro de la Tierra.',
    'Acción / Aventura / Mundo Abierto / RPG', 'Español Latino, Inglés', 'Aprox. 90 GB', 'disponible', TRUE
),
-- 8. Cyberpunk 2077
(
    'Cyberpunk 2077', ARRAY['PS4', 'PS5'], 'rpg', 19000, 10000, 19000, 10000, NULL, FALSE,
    'cyberpunk-2077.jpg',
    'Un RPG de acción en mundo abierto ambientado en Night City, una megalópolis obsesionada con el poder, el glamur y la modificación corporal. Jugá como V, un mercenario que busca un implante único que otorga la inmortalidad.',
    'RPG / Acción / Mundo Abierto / Ciencia Ficción', 'Español Latino, Inglés', 'Aprox. 60 GB', 'disponible', TRUE
),
-- 9. WWE 2K26
(
    'WWE 2K26', ARRAY['PS4', 'PS5'], 'deportes', 28000, 17000, 28000, 17000, NULL, FALSE,
    'wwe-2k26.jpg',
    'La máxima experiencia de lucha libre profesional. Modos Showcase legendarios, física de combate mejorada, modo Mi Leyenda y un roster colosal con las mayores superestrellas e íconos de la WWE.',
    'Deportes / Lucha Libre / Simulación', 'Español, Inglés', 'Aprox. 80 GB', 'disponible', FALSE
),
-- 10. No Man's Sky
(
    'No Man''s Sky', ARRAY['PS4', 'PS5'], 'aventura', 24000, 15000, 24000, 15000, NULL, FALSE,
    'no-mans-sky.jpg',
    'Una aventura de ciencia ficción épica en un universo infinito generado por procedimientos. Explorá planetas inexplorados, comerciá, construí bases y sobreviví junto a tus amigos con juego cruzado.',
    'Aventura / Exploración / Supervivencia / Espacio', 'Español Latino, Inglés', 'Aprox. 18 GB', 'disponible', FALSE
),
-- 11. Need for Speed Heat
(
    'Need for Speed Heat', ARRAY['PS4', 'PS5'], 'carreras', 8200, 6000, 8200, 6000, NULL, FALSE,
    'nfs-heat.jpg',
    'Quemá el asfalto de día en carreras autorizadas del Speedhunters Showdown y arriesgalo todo de noche en carreras callejeras clandestinas huyendo de una fuerza policial corrupta en Palm City.',
    'Carreras / Conducción / Tuning / Mundo Abierto', 'Español, Inglés', 'Aprox. 30 GB', 'disponible', FALSE
),
-- 12. Resident Evil 6
(
    'Resident Evil 6', ARRAY['PS4', 'PS5'], 'terror', 7800, 6000, 7800, 6000, NULL, FALSE,
    're6.jpg',
    'Combinando acción y survival horror, Leon S. Kennedy, Chris Redfield y Jake Muller enfrentan una amenaza bioterrorista global a escala sin precedentes con campañas entrelazadas en cooperativo.',
    'Acción / Terror / Disparos en tercera persona / Cooperativo', 'Español, Inglés', 'Aprox. 20 GB', 'disponible', FALSE
),
-- 13. Naruto Shippuden: Ultimate Ninja Storm 4
(
    'Naruto Shippuden: Ultimate Ninja Storm 4', ARRAY['PS4', 'PS5'], 'lucha', 16500, 9500, 16500, 9500, NULL, FALSE,
    'naruto-storm-4.jpg',
    'El clímax definitivo de la serie STORM. Viví la Gran Cuarta Guerra Ninja con batallas cinemáticas a escala colosal, el sistema de cambio de líder de equipo y combates 3D espectaculares.',
    'Lucha / Acción / Anime / Combate 3D', 'Español Latino, Inglés, Japonés', 'Aprox. 40 GB', 'disponible', FALSE
),
-- 14. Star Wars Battlefront 2
(
    'Star Wars Battlefront 2', ARRAY['PS4', 'PS5'], 'accion', 7800, 6000, 7800, 6000, NULL, FALSE,
    'sw-battlefront-2.jpg',
    'Conviértete en el héroe supremo en batallas masivas a través de las tres eras de Star Wars. Piloteá cazas estelares, desatá el poder de los sables de luz y jugá una emocionante campaña canónica imperial.',
    'Acción / Disparos / Ciencia Ficción / Multijugador', 'Español Latino, Inglés', 'Aprox. 55 GB', 'disponible', FALSE
),
-- 15. LEGO DC Super-Villains
(
    'LEGO DC Super-Villains', ARRAY['PS4', 'PS5'], 'familiar', 8200, 6800, 8200, 6800, NULL, FALSE,
    'lego-dc-super-villains.jpg',
    'Es bueno ser malo. Creá tu propio supervillano novato y desatá travesuras desopilantes junto al Guasón, Harley Quinn y la Liga de la Injusticia en una aventura LEGO llena de acción.',
    'Aventura / Familiar / Superhéroes / Cooperativo', 'Español Latino, Inglés', 'Aprox. 20 GB', 'disponible', FALSE
),
-- 16. Jurassic World Evolution 2
(
    'Jurassic World Evolution 2', ARRAY['PS4', 'PS5'], 'estrategia', 16000, 10000, 16000, 10000, NULL, FALSE,
    'jurassic-world-evolution-2.jpg',
    'Construí y gestioná tu propio parque jurásico. Con más de 75 especies prehistóricas asombrosas, reptiles marinos y voladores, y un profundo modo Teoría del Caos con escenarios icónicos del cine.',
    'Estrategia / Gestión / Simulación / Dinosaurios', 'Español Latino, Inglés', 'Aprox. 15 GB', 'disponible', FALSE
),
-- 17. Lote de Red Dead Redemption
(
    'Lote de Red Dead Redemption', ARRAY['PS4', 'PS5'], 'accion', 40000, 28000, 40000, 28000, NULL, FALSE,
    'lote-red-dead-redemption.jpg',
    'La colección definitiva de Rockstar Games. Incluye las dos obras maestras del Lejano Oeste: Red Dead Redemption (con la expansión zombi Undead Nightmare) y Red Dead Redemption 2 con Red Dead Online.',
    'Acción / Aventura / Mundo Abierto / Western', 'Español Latino, Inglés', 'Aprox. 140 GB', 'disponible', TRUE
),
-- 18. The Last of Us Parte 2
(
    'The Last of Us Parte 2', ARRAY['PS4', 'PS5'], 'accion', 22000, 16000, 22000, 16000, NULL, FALSE,
    'tlou-part2.jpg',
    'Cinco años después de su peligroso viaje por los Estados Unidos pospandémicos, Ellie y Joel se han asentado en Jackson. Pero un evento devastador lleva a Ellie a una implacable búsqueda de justicia y venganza.',
    'Acción / Aventura / Supervivencia / Cinemático', 'Español Latino, Inglés', 'Aprox. 80 GB', 'disponible', TRUE
),
-- 19. Outlast Trinity
(
    'Outlast Trinity', ARRAY['PS4', 'PS5'], 'terror', 11000, 7500, 11000, 7500, NULL, FALSE,
    'outlast-trinity.jpg',
    'El paquete de terror definitivo que reúne más de 20 horas de puro pánico: Outlast 1, el perturbador DLC Whistleblower y la estremecedora secuela Outlast 2 en los cañones de Arizona.',
    'Terror / Survival Horror / Primera persona', 'Español, Inglés', 'Aprox. 35 GB', 'disponible', FALSE
),
-- 20. Back 4 Blood (Edición Ultimate)
(
    'Back 4 Blood (Edición Ultimate)', ARRAY['PS4', 'PS5'], 'accion', 10000, 7500, 10000, 7500, NULL, FALSE,
    'back-4-blood-ultimate.jpg',
    'De los creadores de Left 4 Dead. Un electrizante shooter en primera persona cooperativo de 4 jugadores. La Edición Ultimate incluye el pase anual con nuevas campañas, personajes y apariencias exclusivas.',
    'Acción / Disparos / Zombis / Cooperativo online', 'Español Latino, Inglés', 'Aprox. 45 GB', 'disponible', FALSE
),
-- 21. Days Gone
(
    'Days Gone', ARRAY['PS4', 'PS5'], 'accion', 20000, 10000, 20000, 10000, NULL, FALSE,
    'days-gone.jpg',
    'Manejá y luchá a través de los letales bosques del Pacífico Noroeste como Deacon St. John, un cazarrecompensas que enfrenta hordas implacables de engendros en su moto personalizada.',
    'Acción / Aventura / Mundo Abierto / Survival Horror', 'Español Latino, Inglés', 'Aprox. 67 GB', 'disponible', TRUE
),
-- 22. Bloodborne
(
    'Bloodborne', ARRAY['PS4', 'PS5'], 'rpg', 11000, 7500, 11000, 7500, NULL, FALSE,
    'bloodborne.jpg',
    'De FromSoftware y Hidetaka Miyazaki. Adentrate en la ciudad gótica y maldita de Yharnam, asolada por una enfermedad que transforma a las personas en bestias voraces. Combates implacables y atmósfera inigualable.',
    'Action RPG / Souls-like / Fantasía oscura / Terror gótico', 'Español Latino, Inglés', 'Aprox. 30 GB', 'disponible', TRUE
),
-- 23. Mortal Kombat 11 Ultimate
(
    'Mortal Kombat 11 Ultimate', ARRAY['PS4', 'PS5'], 'lucha', 8200, 2000, 8200, 2000, NULL, FALSE,
    'mk11-ultimate.jpg',
    'La experiencia definitiva de MK11. Incluye las dos aclamadas campañas de historia (incluyendo Aftermath) y los 37 personajes jugables con Rambo, Terminator, Robocop, Spawn, Mileena y Rain.',
    'Lucha / Acción / Competitivo', 'Español Latino, Inglés', 'Aprox. 65 GB', 'disponible', TRUE
),
-- 24. Lote Mortal Kombat 11 Ultimate + Injustice 2 Legendary Edition
(
    'Lote Mortal Kombat 11 Ultimate + Injustice 2 Legendary Edition', ARRAY['PS4', 'PS5'], 'lucha', 11000, 7500, 11000, 7500, NULL, FALSE,
    'mk11-injustice2-bundle.jpg',
    'El megapaquete de lucha definitivo de NetherRealm Studios. Dos colosos completos: Mortal Kombat 11 Ultimate al 100% junto a Injustice 2 Legendary Edition con todos sus héroes y villanos de DC.',
    'Lucha / Acción / Superhéroes / Pack Doble', 'Español Latino, Inglés', 'Aprox. 110 GB', 'disponible', TRUE
),
-- 25. Mortal Kombat 1 Edición Definitive
(
    'Mortal Kombat 1 Edición Definitive', ARRAY['PS5'], 'lucha', 18000, 10000, NULL, NULL, NULL, FALSE,
    'mk1-definitive.jpg',
    'Un nuevo universo creado por el Dios del Fuego Liu Kang. Descubrí el renovado sistema de combate con luchadores Kameo, modo Invasiones y gráficos de última generación exclusivos para PlayStation 5.',
    'Lucha / Acción / Gore / Competitivo', 'Español Latino, Inglés', 'Aprox. 100 GB', 'disponible', TRUE
),
-- 26. Resident Evil Remake Trilogy
(
    'Resident Evil Remake Trilogy', ARRAY['PS4', 'PS5'], 'terror', 30000, 20000, 30000, 20000, NULL, FALSE,
    're-remake-trilogy.jpg',
    'Reviví tres de los mejores survival horror de todos los tiempos totalmente reconstruidos en el motor RE Engine: Resident Evil 2, Resident Evil 3 y el galardonado Resident Evil 4 Remake.',
    'Terror / Survival Horror / Acción / Trilogía', 'Español Latino, Inglés', 'Aprox. 95 GB', 'disponible', TRUE
),
-- 27. Dead by Daylight (Edición Saison)
(
    'Dead by Daylight (Edición Saison)', ARRAY['PS4', 'PS5'], 'terror', 16000, 9500, 16000, 9500, NULL, FALSE,
    'dead-by-daylight.jpg',
    'El juego de terror asimétrico multijugador por excelencia (4 contra 1). Un asesino despiadado acecha a cuatro supervivientes que intentan desesperadamente escapar para evitar una muerte sangrienta.',
    'Terror / Asimétrico / Multijugador online / Supervivencia', 'Español, Inglés', 'Aprox. 45 GB', 'disponible', FALSE
);
