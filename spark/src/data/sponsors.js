// Anunciantes (push simuladas). Para agregar uno copia un bloque:
//   interests: intereses del catálogo que activan al anunciante
//   push:      texto de la notificación ({name} = la otra persona, {tag} = interés común)
//   benefit:   lo que se muestra en el chat como cupón
//   icon:      ícono de Font Awesome; color: clases de Tailwind del fondo del ícono

export const SPONSORS = [
  {
    id: 'dq',
    brand: 'Dairy Queen',
    icon: 'fa-ice-cream',
    color: 'from-blue-500 to-red-500',
    interests: ['Helados y Malteadas', 'Postres'],
    push: 'Tú y {name} comparten {tag}. ¡10% OFF para los dos en tu Blizzard! 🍦',
    benefit: '10% de descuento en helados o malteadas. Muestren esta pantalla en caja.',
  },
  {
    id: 'cinepolis',
    brand: 'Cinépolis',
    icon: 'fa-film',
    color: 'from-sky-600 to-indigo-700',
    interests: ['Cine de Autor', 'Anime', 'Ciencia Ficción'],
    push: '¿Peli con {name}? 2x1 en boletos para su función de hoy 🎬',
    benefit: '2x1 en boletos de lunes a jueves. Válido en taquilla con esta pantalla.',
  },
  {
    id: 'gandhi',
    brand: 'Librería Gandhi',
    icon: 'fa-book-open',
    color: 'from-yellow-400 to-amber-600',
    interests: ['Novela Gráfica', 'Poesía', 'Ciencia Ficción'],
    push: 'A {name} también le gusta {tag}. 15% en su próximo libro 📚',
    benefit: '15% de descuento en un libro por persona en la sucursal más cercana.',
  },
  {
    id: 'cafe',
    brand: 'Café Molino',
    icon: 'fa-mug-hot',
    color: 'from-amber-700 to-stone-800',
    interests: ['Café de Especialidad', 'Repostería'],
    push: 'Tú y {name} aman el {tag}. El segundo café va por la casa ☕',
    benefit: 'Segundo café gratis al pedir dos bebidas de especialidad.',
  },
]

export function sponsorFor(shared) {
  for (const s of SPONSORS) {
    const tag = shared.find((t) => s.interests.includes(t))
    if (tag) return { ...s, tag }
  }
  return null
}

export function sponsorText(sponsor, name) {
  return sponsor.push.replace('{name}', name).replace('{tag}', sponsor.tag)
}
