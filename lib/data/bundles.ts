export type Bundle = {
  id: string
  name: string
  nameKa: string
  nameRu: string
  tagline: string
  taglineKa: string
  taglineRu: string
  products: string[]
  originalPrice: number
  discountPrice: number
  discount: number
  coverImage: string
  color: string
  badge?: string
}

export const bundles: Bundle[] = [
  {
    id: 'bedroom-starter',
    name: 'Bedroom Starter',
    nameKa: 'საძინებლის სტარტერი',
    nameRu: 'Стартовый набор для спальни',
    tagline: 'Everything you need to start',
    taglineKa: 'ყველაფერი სასტარტოდ',
    taglineRu: 'Всё необходимое для начала',
    products: ['Duvet Cover (200x220)', 'Fitted Sheet (160x200)', 'Pillowcase x2 (50x70)'],
    originalPrice: 320,
    discountPrice: 272,
    discount: 15,
    coverImage: '/images/bundles/starter.jpg',
    color: '#e8e4df',
  },
  {
    id: 'luxury-sleep',
    name: 'Luxury Sleep',
    nameKa: 'ლუქსი ძილი',
    nameRu: 'Роскошный сон',
    tagline: 'Hotel-grade comfort at home',
    taglineKa: 'სასტუმრო კომფორტი სახლში',
    taglineRu: 'Комфорт отеля у вас дома',
    products: ['Egyptian Cotton Duvet Cover', 'Deep Pocket Fitted Sheet', 'Pillowcase x4', 'Duvet Insert'],
    originalPrice: 580,
    discountPrice: 493,
    discount: 15,
    coverImage: '/images/bundles/luxury.jpg',
    color: '#d4cfc8',
  },
  {
    id: 'guest-room',
    name: 'Guest Room Set',
    nameKa: 'სასტუმრო ოთახის ნაკრები',
    nameRu: 'Набор для гостевой комнаты',
    tagline: 'Make your guests feel at home',
    taglineKa: 'სტუმრები სახლივით გრძნობდნენ',
    taglineRu: 'Подарите гостям уют',
    products: ['Duvet Cover (180x200)', 'Fitted Sheet (140x200)', 'Pillowcase x2', 'Decorative Pillow Cover x2'],
    originalPrice: 290,
    discountPrice: 246,
    discount: 15,
    coverImage: '/images/bundles/guest.jpg',
    color: '#ede8e1',
  },
  {
    id: 'gift-set',
    name: 'Gift Set',
    nameKa: 'სასაჩუქრე ნაკრები',
    nameRu: 'Подарочный набор',
    tagline: 'The perfect gift for any occasion',
    taglineKa: 'სრულყოფილი საჩუქარი',
    taglineRu: 'Идеальный подарок',
    products: ['Pillowcase x2 (premium)', 'Hand Towel x2', 'Linen Spray'],
    originalPrice: 145,
    discountPrice: 123,
    discount: 15,
    coverImage: '/images/bundles/gift.jpg',
    color: '#f2ede6',
    badge: 'GIFT',
  },
  {
    id: 'winter-comfort',
    name: 'Winter Comfort',
    nameKa: 'ზამთრის კომფორტი',
    nameRu: 'Зимний уют',
    tagline: 'Warm & cozy for cold nights',
    taglineKa: 'თბილი ღამეებისთვის',
    taglineRu: 'Тепло и уют холодными ночами',
    products: ['Heavy Duvet Insert (300gsm)', 'Flannel Duvet Cover', 'Fitted Sheet (thermal)', 'Pillowcase x2'],
    originalPrice: 420,
    discountPrice: 357,
    discount: 15,
    coverImage: '/images/bundles/winter.jpg',
    color: '#ddd8d0',
  },
  {
    id: 'summer-fresh',
    name: 'Summer Fresh',
    nameKa: 'ზაფხულის სიგრილე',
    nameRu: 'Летняя свежесть',
    tagline: 'Light & breathable for warm nights',
    taglineKa: 'სუნთქვადი თბილი ღამეებისთვის',
    taglineRu: 'Лёгкость и свежесть',
    products: ['Light Duvet Insert (100gsm)', 'Linen Duvet Cover', 'Fitted Sheet (cotton percale)', 'Pillowcase x2'],
    originalPrice: 380,
    discountPrice: 323,
    discount: 15,
    coverImage: '/images/bundles/summer.jpg',
    color: '#e8f0eb',
  },
]

export function getBundleById(id: string): Bundle | undefined {
  return bundles.find((b) => b.id === id)
}

export function getRelatedBundles(current: Bundle, count = 3): Bundle[] {
  return bundles.filter((b) => b.id !== current.id).slice(0, count)
}
