// Catálogo de intereses de nicho.
// Para agregar uno: copia un bloque, cambia `tag`, `cat`, los rompehielos y las respuestas del bot.
// Si cambias los `tag`, vuelve a generar los bots: `npm run bots`.
//   icebreakers: preguntas sugeridas al hacer match (se elige una al azar)
//   replies:     lo que contesta un usuario simulado cuando le escribes

export const INTERESTS = [
  // Comida
  { tag: 'Helados y Malteadas', cat: 'Comida', icebreakers: ['¿Eres más de Blizzard tradicional o prefieres una malteada clásica?', '¿Un helado para romper el hielo? ¡Hay 10% OFF en Dairy Queen!'], replies: ['¡Blizzard de Oreo siempre! ¿Y tú?', 'Jaja va, yo invito la primera malteada 🍦'] },
  { tag: 'Postres', cat: 'Comida', icebreakers: ['¿Qué postre es tu placer culpable definitivo?', '¿Pastel de chocolate o pay de queso?'], replies: ['Pay de queso con zarzamora, sin duda.', 'El flan de mi abuela no tiene rival 😅'] },
  { tag: 'Café de Especialidad', cat: 'Comida', icebreakers: ['¿Método favorito: V60, prensa francesa o espresso?', '¿Tienes alguna cafetería escondida que recomiendes?'], replies: ['V60 todas las mañanas ☕', 'Hay una en la colonia Roma que te va a encantar.'] },
  { tag: 'Ramen', cat: 'Comida', icebreakers: ['¿Tonkotsu o shoyu?', '¿Cuál es el mejor ramen que has probado en la ciudad?'], replies: ['Tonkotsu con extra huevo, obvio.', '¡Tengo una lista de lugares! Te paso uno.'] },
  { tag: 'Tacos al Pastor', cat: 'Comida', icebreakers: ['¿Con piña o sin piña?', '¿Cuál es tu taquería de confianza?'], replies: ['Con piña, sin debate 🍍', 'Hay un puesto aquí cerca que es leyenda.'] },
  { tag: 'Repostería', cat: 'Comida', icebreakers: ['¿Qué fue lo último que horneaste?', '¿Masa madre o levadura comercial?'], replies: ['Unos croissants… que salieron medio planos 😂', '¡Masa madre! Se llama Pancho.'] },

  // Diseño y tecnología
  { tag: 'Diseño Industrial', cat: 'Diseño', icebreakers: ['¿Trabajas más en modelado 3D CAD o en prototipos físicos?', '¿Prefieres el diseño funcionalista o la estética escandinava?'], replies: ['Más CAD, pero amo cuando toca prototipar.', 'Escandinavo, sin duda. Menos es más.'] },
  { tag: 'Teclados Mecánicos', cat: 'Tecnología', icebreakers: ['¿Switches lineales o táctiles?', '¿Cuál es tu keycap set favorito?'], replies: ['Lineales lubricados, el sonido thock es todo.', 'Tengo unos GMK que me costaron un riñón 😅'] },
  { tag: 'Impresión 3D', cat: 'Tecnología', icebreakers: ['¿PLA o PETG para tus proyectos?', '¿Qué es lo más útil que has impreso?'], replies: ['PETG para todo lo funcional.', 'Un soporte para audífonos que uso diario.'] },
  { tag: 'Herramientas EDC', cat: 'Diseño', icebreakers: ['¿Llevas alguna multiherramienta de titanio o navaja clásica hoy encima?', '¿Prefieres ligereza o máxima funcionalidad para tu EDC?'], replies: ['Traigo una Leatherman en la mochila.', 'Ligereza total, solo lo esencial.'] },
  { tag: 'Fotografía Analógica', cat: 'Diseño', icebreakers: ['¿Qué rollo estás usando ahora?', '¿Revelas tú mismo o mandas a laboratorio?'], replies: ['Portra 400, el clásico.', 'Revelo blanco y negro en casa.'] },
  { tag: 'Programación', cat: 'Tecnología', icebreakers: ['¿Qué lenguaje te hace más feliz?', '¿En qué proyecto personal estás ahora?'], replies: ['Python para todo, aunque Rust me llama.', 'Un bot que me avisa cuando hay tacos 😂'] },

  // Música
  { tag: 'Sintetizadores', cat: 'Música', icebreakers: ['¿Síntesis analógica clásica o módulos Eurorack?', '¿Tienes algún sinte favorito para diseño sonoro?'], replies: ['Eurorack, aunque mi cartera llora.', 'Un Korg Minilogue, es mi bebé.'] },
  { tag: 'Vinilos', cat: 'Música', icebreakers: ['¿Cuál fue el último vinilo que compraste?', '¿Tienes alguna tienda de discos favorita?'], replies: ['Un Soda Stereo de segunda mano 🔥', 'El tianguis del Chopo los sábados.'] },
  { tag: 'Jazz', cat: 'Música', icebreakers: ['¿Bebop o jazz modal?', '¿Has ido a algún bar de jazz en vivo por aquí?'], replies: ['Kind of Blue me cambió la vida.', 'Sí, hay uno los jueves que está buenísimo.'] },
  { tag: 'Música Indie', cat: 'Música', icebreakers: ['¿Qué banda indie mexicana recomiendas?', '¿Cuál fue el último concierto al que fuiste?'], replies: ['Señor Kino, sin duda.', '¡Fui al Corona Capital!'] },
  { tag: 'Guitarra', cat: 'Música', icebreakers: ['¿Acústica o eléctrica?', '¿Qué canción fue la primera que aprendiste?'], replies: ['Eléctrica, con mucho fuzz.', 'Wonderwall, como todos 😂'] },

  // Juegos y cultura
  { tag: 'Juegos de Mesa', cat: 'Juegos', icebreakers: ['¿Catan, Carcassonne o algo más pesado?', '¿Cuál es el juego que siempre llevas a las reuniones?'], replies: ['Wingspan es mi favorito ahora.', 'Codenames nunca falla.'] },
  { tag: 'Videojuegos Retro', cat: 'Juegos', icebreakers: ['¿SNES o Nintendo 64?', '¿Qué juego retro rejugarías hoy mismo?'], replies: ['N64, el Ocarina of Time 💚', 'Chrono Trigger, sin pensarlo.'] },
  { tag: 'Anime', cat: 'Juegos', icebreakers: ['¿Qué anime estás viendo ahora?', '¿Ghibli o shonen?'], replies: ['Frieren, me tiene enganchadísimo.', 'Ghibli por siempre ✨'] },
  { tag: 'Ajedrez', cat: 'Juegos', icebreakers: ['¿Abres con e4 o d4?', '¿Juegas blitz o partidas largas?'], replies: ['e4 y que pase lo que pase.', 'Blitz, aunque pierdo mucho 😅'] },
  { tag: 'Cine de Autor', cat: 'Cultura', icebreakers: ['¿Cuál es la última película que te voló la cabeza?', '¿Director favorito?'], replies: ['Roma de Cuarón, la vi tres veces.', 'Wes Anderson, por la estética.'] },
  { tag: 'Novela Gráfica', cat: 'Cultura', icebreakers: ['¿Qué novela gráfica recomendarías a alguien que empieza?', '¿Marvel/DC o editoriales independientes?'], replies: ['Maus, sin duda.', 'Independientes, hay joyas.'] },
  { tag: 'Ciencia Ficción', cat: 'Cultura', icebreakers: ['¿Dune o Fundación?', '¿Qué libro de sci-fi te cambió la forma de pensar?'], replies: ['Dune, el worldbuilding es absurdo.', 'El problema de los tres cuerpos.'] },
  { tag: 'Poesía', cat: 'Cultura', icebreakers: ['¿Tienes algún poeta favorito?', '¿Escribes o solo lees?'], replies: ['Rosario Castellanos 💜', 'Escribo un poco, a escondidas.'] },

  // Actividades
  { tag: 'Escalada', cat: 'Deporte', icebreakers: ['¿Boulder o escalada con cuerda?', '¿Cuál es tu muro favorito?'], replies: ['Boulder, me gusta resolver problemas.', 'Voy a uno aquí cerca los martes.'] },
  { tag: 'Running', cat: 'Deporte', icebreakers: ['¿Estás entrenando para algún medio maratón?', '¿Corres de mañana o de noche?'], replies: ['¡Sí! El de la CDMX en agosto.', 'De mañana, antes de que haga calor.'] },
  { tag: 'Ciclismo Urbano', cat: 'Deporte', icebreakers: ['¿Fixie, ruta o la que sea?', '¿Vas al paseo dominical en bici?'], replies: ['Fixie, aunque me duelen las rodillas 😂', 'Cada domingo en Reforma.'] },
  { tag: 'Plantas', cat: 'Hogar', icebreakers: ['¿Cuántas plantas tienes en casa?', '¿Alguna que se te haya muerto y extrañes?'], replies: ['Como 23, ya perdí la cuenta 🌿', 'Una calathea… descanse en paz.'] },
  { tag: 'Sneakers de Colección', cat: 'Moda', icebreakers: ['¿Buscas siluetas retro de los 80/90s o ediciones limitadas?', '¿Cuál es el par favorito de tu colección?'], replies: ['Retro, unas Jordan 1 Chicago.', 'Unas New Balance 550 que cuido como oro.'] },
  { tag: 'Moda Vintage', cat: 'Moda', icebreakers: ['¿Tienes algún bazar vintage favorito?', '¿Cuál es tu mejor hallazgo de segunda mano?'], replies: ['El de la Lagunilla los domingos.', 'Una chamarra de mezclilla de los 80 por 150 pesos.'] },
  { tag: 'Perros', cat: 'Hogar', icebreakers: ['¿Tienes perro? ¿Cómo se llama?', '¿Raza favorita?'], replies: ['Sí, se llama Frijol 🐶', '¡Los xolos son lo máximo!'] },
]

export const TAGS = INTERESTS.map((i) => i.tag)

export const CATEGORIES = [...new Set(INTERESTS.map((i) => i.cat))]

const GENERIC_ICEBREAKER = '¿Tienes algún proyecto o pasatiempo relacionado en este momento?'
const GENERIC_REPLIES = ['¡Qué buena onda! Cuéntame más 😊', 'Jaja totalmente, ¿y tú desde cuándo?', '¿Te late vernos en persona aquí cerca?']

export function findInterest(tag) {
  const key = normalize(tag)
  return INTERESTS.find((i) => normalize(i.tag) === key)
}

export function pickIcebreaker(shared) {
  const options = shared.flatMap((t) => findInterest(t)?.icebreakers ?? [])
  return options.length ? pickRandom(options) : GENERIC_ICEBREAKER
}

export function pickReply(shared) {
  const options = [...shared.flatMap((t) => findInterest(t)?.replies ?? []), ...GENERIC_REPLIES]
  return pickRandom(options)
}

// Quita acentos y mayúsculas para comparar intereses escritos a mano.
export function normalize(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
