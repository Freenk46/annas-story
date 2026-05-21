export type Product = {
  id: string
  title: string
  price: string
  colors: string[]
  colorNames: string[]
  formats: string[]
  coverImage: string
  images: string[]
  videos?: string[]
  description: string
  credits: string
}

export type Collection = {
  id: string       // display number: '01'–'11'
  slug: string     // URL slug: 'marc-jacobs'
  name: string     // brand name: 'MARC JACOBS'
  category: string
  year: string
  coverImage: string
  description: string
  products: Product[]
}

const credits = 'Director: Fred Bauer · Producer: Sophie Goussin · DOP: —'

export const collections: Collection[] = [
  {
    id: '01', slug: 'marc-jacobs', name: 'MARC JACOBS',
    category: 'Fashion', year: '2024',
    coverImage: '/images/collections/mj-cover.jpg',
    description: "A bold editorial campaign blending surrealism and luxury. Shot in Paris, this collection captures the duality of romance and rebellion.",
    products: [
      {
        id: 'valentines-day', title: "Valentine's Day Campaign",
        price: 'On request',
        colors: ['#111111', '#f5f3ee', '#c8a882'], colorNames: ['Noir', 'Ivoire', 'Caramel'],
        formats: ['Digital', 'Print', 'Social'],
        coverImage: '/images/collections/mj-1.jpg',
        images: ['/images/collections/mj-1.jpg', '/images/collections/mj-2.jpg', '/images/collections/mj-3.jpg'],
        description: "A bold editorial campaign blending surrealism and luxury. Shot in Paris, this collection captures the duality of romance and rebellion — Prototype's signature approach to fashion storytelling.",
        credits,
      },
      {
        id: 'resort-24', title: 'Resort Collection',
        price: 'On request',
        colors: ['#f5f3ee', '#c8a882', '#8b7355'], colorNames: ['Ivoire', 'Caramel', 'Tabac'],
        formats: ['Digital', 'Social'],
        coverImage: '/images/collections/mj-resort.jpg',
        images: [],
        description: 'A sun-drenched resort campaign evoking escapism and effortless glamour. Warm tones and languorous compositions define this summer statement.',
        credits,
      },
    ],
  },
  {
    id: '02', slug: 'boll-and-branch', name: 'BOLL & BRANCH',
    category: 'Commercials', year: '2024',
    coverImage: '/images/collections/bb-cover.jpg',
    description: "An ethereal spring campaign for the luxury linen brand. Soft tones and natural textures convey the brand's commitment to sustainable comfort and timeless elegance.",
    products: [
      {
        id: 'spring-evergreen', title: 'Spring Evergreen Campaign',
        price: 'On request',
        colors: ['#e8e4dc', '#7a9e87', '#d4c5b0'], colorNames: ['Lin', 'Sauge', 'Sable'],
        formats: ['Digital', 'TVC', 'OOH'],
        coverImage: '/images/collections/bb-1.jpg',
        images: ['/images/collections/bb-1.jpg', '/images/collections/bb-2.jpg', '/images/collections/bb-3.jpg'],
        description: "An ethereal spring campaign for the luxury linen brand. Soft tones and natural textures convey the brand's commitment to sustainable comfort and timeless elegance.",
        credits,
      },
      {
        id: 'winter-warmth', title: 'Winter Warmth',
        price: 'On request',
        colors: ['#d4c5b0', '#2c2c2c', '#8b7355'], colorNames: ['Sable', 'Graphite', 'Tabac'],
        formats: ['Digital', 'TVC'],
        coverImage: '/images/collections/bb-winter.jpg',
        images: [],
        description: 'A cocooning winter campaign celebrating the ritual of warmth. Deep textures and intimate settings position Boll & Branch as the luxury choice for the colder months.',
        credits,
      },
    ],
  },
  {
    id: '03', slug: 'linvosges', name: 'LINVOSGES',
    category: 'Commercials', year: '2023',
    coverImage: '/images/collections/lv-cover.jpg',
    description: 'A centenary celebration for the iconic French linen house. A journey through 100 years of savoir-faire, heritage, and artisanal excellence.',
    products: [
      {
        id: 'tvc-100-ans', title: 'TVC 100 ANS',
        price: 'On request',
        colors: ['#f0ebe4', '#2c2c2c', '#b8a898'], colorNames: ['Blanc', 'Graphite', 'Taupe'],
        formats: ['TVC', 'Digital', 'Print'],
        coverImage: '/images/collections/lv-1.jpg',
        images: ['/images/collections/lv-1.jpg', '/images/collections/lv-2.jpg', '/images/collections/lv-3.jpg'],
        description: 'A centenary celebration campaign for the iconic French linen house. A journey through 100 years of savoir-faire, heritage, and artisanal excellence.',
        credits,
      },
      {
        id: 'les-essentiels', title: 'Les Essentiels',
        price: 'On request',
        colors: ['#f0ebe4', '#b8a898'], colorNames: ['Blanc', 'Taupe'],
        formats: ['Digital', 'Print'],
        coverImage: '/images/collections/lv-essentiels.jpg',
        images: [],
        description: 'A refined campaign spotlighting the essential linen pieces that have defined Linvosges for a century. Minimal, precise, and deeply French.',
        credits,
      },
    ],
  },
  {
    id: '04', slug: 'christofle', name: 'CHRISTOFLE',
    category: 'Luxury', year: '2024',
    coverImage: '/images/collections/cf-cover.jpg',
    description: "Timeless elegance brought to life through the art of the table. Celebrating Christofle's mastery of silver craftsmanship and the ritual of dining.",
    products: [
      {
        id: 'art-de-la-table', title: 'Art de la Table',
        price: 'On request',
        colors: ['#c0c0c0', '#1a1a1a', '#d4af6a'], colorNames: ['Argent', 'Ébène', 'Or'],
        formats: ['Digital', 'Print', 'Social'],
        coverImage: '/images/collections/cf-1.jpg',
        images: [],
        description: "Timeless elegance brought to life through the art of the table. A campaign celebrating Christofle's mastery of silver craftsmanship and the ritual of dining.",
        credits,
      },
      {
        id: 'nouvelle-collection', title: 'Nouvelle Collection',
        price: 'On request',
        colors: ['#d4af6a', '#c0c0c0'], colorNames: ['Or', 'Argent'],
        formats: ['Digital', 'Social'],
        coverImage: '/images/collections/cf-2.jpg',
        images: [],
        description: 'Introducing new forms to a storied legacy. The new collection pushes Christofle into contemporary territory while honouring its 190-year heritage.',
        credits,
      },
    ],
  },
  {
    id: '05', slug: 'lutron', name: 'LUTRON',
    category: 'Technology', year: '2023',
    coverImage: '/images/collections/lt-cover.jpg',
    description: "The future of intelligent home lighting and control systems. Visualizing how Lutron's technology transforms living spaces into immersive environments.",
    products: [
      {
        id: 'smart-living', title: 'Smart Living',
        price: 'On request',
        colors: ['#f8f8f8', '#0a0a0a', '#4a7fa5'], colorNames: ['Blanc', 'Noir', 'Acier'],
        formats: ['Digital', 'Social', 'OOH'],
        coverImage: '/images/collections/lt-1.jpg',
        images: [],
        description: "The future of intelligent home lighting and control systems. A sleek campaign visualizing how Lutron's technology transforms living spaces into immersive environments.",
        credits,
      },
      {
        id: 'natural-light', title: 'Natural Light',
        price: 'On request',
        colors: ['#f8f8f8', '#e8d5b0', '#4a7fa5'], colorNames: ['Blanc', 'Soleil', 'Acier'],
        formats: ['Digital', 'OOH'],
        coverImage: '/images/collections/lt-2.jpg',
        images: [],
        description: 'A contemplative campaign exploring the dialogue between natural and artificial light. How Lutron bridges the two to create spaces that breathe and respond.',
        credits,
      },
    ],
  },
  {
    id: '06', slug: 'beau-magazine', name: 'BEAU MAGAZINE',
    category: 'Fashion', year: '2024',
    coverImage: '/images/collections/bm-cover.jpg',
    description: 'A fashion editorial blending Parco and Miu Miu aesthetics. Bold, irreverent, and deeply cinematic — a meditation on femininity and cultural identity.',
    products: [
      {
        id: 'parco-miu-miu', title: 'Parco × Miu Miu Editorial',
        price: 'On request',
        colors: ['#e8d5c4', '#8b2635', '#2d2d2d'], colorNames: ['Peau', 'Bordeaux', 'Charbon'],
        formats: ['Print', 'Digital', 'Social'],
        coverImage: '/images/collections/bm-1.jpg',
        images: [],
        description: 'A fashion editorial blending Parco and Miu Miu aesthetics. Bold, irreverent, and deeply cinematic — a meditation on femininity and cultural identity.',
        credits,
      },
      {
        id: 'issue-14', title: 'Issue 14',
        price: 'On request',
        colors: ['#2d2d2d', '#e8d5c4'], colorNames: ['Charbon', 'Peau'],
        formats: ['Print', 'Digital'],
        coverImage: '/images/collections/bm-2.jpg',
        images: [],
        description: 'Issue 14 explores the tension between couture and street culture. A visual essay in contrasts — raw energy meets editorial precision.',
        credits,
      },
    ],
  },
  {
    id: '07', slug: 'lartisan-parfumeur', name: "L'ARTISAN PARFUMEUR",
    category: 'Fragrance', year: '2023',
    coverImage: '/images/collections/ap-cover.jpg',
    description: 'A sensory journey through scent and emotion. The campaign translates the ineffable into the visible — evoking memory, desire, and the poetry of the everyday.',
    products: [
      {
        id: 'voyage-sensoriel', title: 'Voyage Sensoriel',
        price: 'On request',
        colors: ['#f2e8df', '#7b6e5d', '#3d3028'], colorNames: ['Crème', 'Ambre', 'Bois'],
        formats: ['Digital', 'Print', 'TVC'],
        coverImage: '/images/collections/ap-1.jpg',
        images: [],
        description: 'A sensory journey through scent and emotion. The campaign translates the ineffable into the visible — evoking memory, desire, and the poetry of the everyday.',
        credits,
      },
      {
        id: 'collection-hiver', title: 'Collection Hiver',
        price: 'On request',
        colors: ['#3d3028', '#7b6e5d'], colorNames: ['Bois', 'Ambre'],
        formats: ['Digital', 'Print'],
        coverImage: '/images/collections/ap-2.jpg',
        images: [],
        description: 'Winter as a state of mind. The Collection Hiver campaign captures the warmth of rare materials — oud, vetiver, sandalwood — rendered in light and shadow.',
        credits,
      },
    ],
  },
  {
    id: '08', slug: 'miu-miu', name: 'MIU MIU',
    category: 'Fashion', year: '2023',
    coverImage: '/images/collections/mm-cover.jpg',
    description: "An intimate campaign capturing feminine power and playful subversion. Raw emotion meets precision craft in this homage to Miu Miu's singular vision.",
    products: [
      {
        id: 'autumn-winter', title: 'Autumn / Winter',
        price: 'On request',
        colors: ['#d4c5b0', '#1c1c1c', '#8b7355'], colorNames: ['Camel', 'Noir', 'Terre'],
        formats: ['Digital', 'Print', 'OOH'],
        coverImage: '/images/collections/mm-1.jpg',
        images: [],
        description: "An intimate Autumn/Winter campaign capturing feminine power and playful subversion. Raw emotion meets precision craft in this homage to Miu Miu's singular vision.",
        credits,
      },
      {
        id: 'spring-summer', title: 'Spring / Summer',
        price: 'On request',
        colors: ['#f5f0e8', '#d4a0a0', '#1c1c1c'], colorNames: ['Écru', 'Rose', 'Noir'],
        formats: ['Digital', 'Social'],
        coverImage: '/images/collections/mm-2.jpg',
        images: [],
        description: 'Spring/Summer brings lightness and irreverence to the Miu Miu universe. Pastel disruptions and unexpected silhouettes define the season.',
        credits,
      },
    ],
  },
  {
    id: '09', slug: 'hermes', name: 'HERMÈS',
    category: 'Luxury', year: '2024',
    coverImage: '/images/collections/hm-cover.jpg',
    description: "A journey through the craftsmanship and heritage of Hermès. The campaign opens new horizons while honouring a 186-year legacy of exceptional creation.",
    products: [
      {
        id: 'horizons', title: 'Horizons',
        price: 'On request',
        colors: ['#e8602c', '#1a1a1a', '#f5f0e8'], colorNames: ['Brique', 'Noir', 'Crème'],
        formats: ['Digital', 'TVC', 'Print'],
        coverImage: '/images/collections/hm-1.jpg',
        images: [],
        description: "A journey through the craftsmanship and heritage of Hermès. The campaign opens new horizons while honoring the maison's 186-year legacy of exceptional creation.",
        credits,
      },
      {
        id: 'les-mains', title: 'Les Mains qui Créent',
        price: 'On request',
        colors: ['#f5f0e8', '#e8602c'], colorNames: ['Crème', 'Brique'],
        formats: ['Digital', 'Print'],
        coverImage: '/images/collections/hm-2.jpg',
        images: [],
        description: "A tribute to the artisans whose hands bring the Hermès vision to life. Intimate portraits and extreme close-ups of craft in motion.",
        credits,
      },
    ],
  },
  {
    id: '10', slug: 'louis-vuitton', name: 'LOUIS VUITTON',
    category: 'Luxury', year: '2024',
    coverImage: '/images/collections/lv2-cover.jpg',
    description: "The art of craftsmanship at the heart of Louis Vuitton's identity. A campaign celebrating the hands behind the icons — the ateliers where every stitch tells a story.",
    products: [
      {
        id: 'savoir-faire', title: 'Savoir-Faire',
        price: 'On request',
        colors: ['#a0845c', '#1a1a1a', '#f5f0e8'], colorNames: ['Monogram', 'Noir', 'Écru'],
        formats: ['Digital', 'Print', 'TVC'],
        coverImage: '/images/collections/lv2-1.jpg',
        images: [],
        description: "The art of craftsmanship at the heart of Louis Vuitton's identity. A campaign celebrating the hands behind the icons — the ateliers where every stitch tells a story.",
        credits,
      },
      {
        id: 'legends', title: 'Légendes',
        price: 'On request',
        colors: ['#1a1a1a', '#a0845c'], colorNames: ['Noir', 'Monogram'],
        formats: ['Digital', 'Print'],
        coverImage: '/images/collections/lv2-2.jpg',
        images: [],
        description: 'A cinematic journey through the iconic pieces that define the Louis Vuitton universe. Heritage objects photographed as sculpture — timeless, impossible.',
        credits,
      },
    ],
  },
  {
    id: '11', slug: 'pusspuss-magazine', name: 'PUSSPUSS MAGAZINE',
    category: 'Editorial', year: '2023',
    coverImage: '/images/collections/pp-cover.jpg',
    description: 'A bold editorial vision for the cult independent magazine. Pushing the boundaries of visual storytelling through radical design and uncompromising imagery.',
    products: [
      {
        id: 'issue-12', title: 'Issue 12',
        price: 'On request',
        colors: ['#f0f0f0', '#ff2d55', '#1a1a1a'], colorNames: ['Blanc', 'Rose', 'Noir'],
        formats: ['Print', 'Digital'],
        coverImage: '/images/collections/pp-1.jpg',
        images: [],
        description: 'A bold editorial vision for the cult independent magazine. Issue 12 pushes the boundaries of visual storytelling through radical design and uncompromising imagery.',
        credits,
      },
      {
        id: 'issue-11', title: 'Issue 11',
        price: 'On request',
        colors: ['#1a1a1a', '#ff2d55'], colorNames: ['Noir', 'Rose'],
        formats: ['Print', 'Digital'],
        coverImage: '/images/collections/pp-2.jpg',
        images: [],
        description: 'Issue 11 announced Pusspuss as a force in the independent publishing world. Dark, confrontational, and beautifully made.',
        credits,
      },
    ],
  },
]

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find(c => c.slug === slug)
}

export function getProductById(collection: Collection, productId: string): Product | undefined {
  return collection.products.find(p => p.id === productId)
}

export function getRelatedCollections(current: Collection, count = 4): Collection[] {
  const same   = collections.filter(c => c.slug !== current.slug && c.category === current.category)
  const others = collections.filter(c => c.slug !== current.slug && c.category !== current.category)
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)
  return [...shuffle(same), ...shuffle(others)].slice(0, count)
}
