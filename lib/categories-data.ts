export type Product = {
  id: string
  title: string      // English
  nameKa: string     // Georgian
  nameRu: string     // Russian
  price: string
  colors: string[]
  colorNames: string[]
  formats: string[]
  coverImage: string
  images: string[]
  videos?: string[]
  description: string
  descriptionKa: string
  descriptionRu: string
  credits: string
}

export type Category = {
  id: string
  slug: string
  name: string       // English
  nameKa: string     // Georgian
  nameRu: string     // Russian
  collection: string
  year: string
  coverImage: string
  coverVideo?: string  // optional — shown instead of placeholder in category cards
  description: string
  descriptionKa: string
  descriptionRu: string
  products: Product[]
}

export function getCategoryName(cat: Category, locale: string): string {
  return locale === 'ka' ? cat.nameKa : locale === 'ru' ? cat.nameRu : cat.name
}

export function getProductName(prod: Product, locale: string): string {
  return locale === 'ka' ? prod.nameKa : locale === 'ru' ? prod.nameRu : prod.title
}

export function getCategoryDescription(cat: Category, locale: string): string {
  return locale === 'ka' ? cat.descriptionKa : locale === 'ru' ? cat.descriptionRu : cat.description
}

export function getProductDescription(prod: Product, locale: string): string {
  return locale === 'ka' ? prod.descriptionKa : locale === 'ru' ? prod.descriptionRu : prod.description
}

export const categories: Category[] = [
  {
    id: '01', slug: 'duvet-covers',
    name: 'DUVET COVERS', nameKa: 'საბნის გარსები', nameRu: 'ПОДОДЕЯЛЬНИКИ',
    collection: 'Bedding', year: '2025',
    coverImage: '/images/categories/duvet-covers-cover.jpg',
    coverVideo: '/videos/categories/duvet-covers-cover.mp4',
    description: 'Crafted from 100% long-staple cotton, our duvet covers combine silky softness with lasting durability. Available in timeless tones to suit any bedroom.',
    descriptionKa: '100% გრძელბოჭკოვანი ბამბისგან დამზადებული საბნის გარსები, რომლებიც რბილობასა და გამძლეობას აერთიანებს. ხელმისაწვდომია უმარტივეს ტონებში.',
    descriptionRu: 'Пододеяльники из 100% длинноволокнистого хлопка сочетают шелковистую мягкость с долговечностью. Доступны в классических оттенках.',
    products: [
      {
        id: 'sateen-duvet-cover',
        title: 'Cotton Sateen Duvet Cover', nameKa: 'ბამბის საბნის გარსი', nameRu: 'Пододеяльник Сатин',
        price: '₾149',
        colors: ['#f5f3ee', '#e8e0d5', '#b0b8b0', '#8fa3a0'], colorNames: ['White', 'Ivory', 'Sage', 'Dusty Blue'],
        formats: ['140×200', '160×200', '200×220', '220×240'],
        coverImage: '/images/categories/duvet-covers-1.jpg',
        images: [],
        description: 'Egyptian long-staple cotton in a silky sateen weave. A lustrous finish with a cool, smooth feel against the skin.',
        descriptionKa: 'ეგვიპტური გრძელბოჭკოვანი ბამბა სატინის ქსოვილში. ბზინვარე ფინიში გლუვი და გრილი შეხებით.',
        descriptionRu: 'Египетский длинноволокнистый хлопок в сатиновом переплетении. Блестящая фактура с гладким прохладным ощущением.',
        credits: '',
      },
      {
        id: 'percale-duvet-cover',
        title: 'Percale Duvet Cover', nameKa: 'პერკალის საბნის გარსი', nameRu: 'Пододеяльник Перкаль',
        price: '₾129',
        colors: ['#f5f3ee', '#e8e0d5', '#d4c4b8', '#c8b8c0'], colorNames: ['White', 'Ivory', 'Stone', 'Blush'],
        formats: ['140×200', '160×200', '200×220', '220×240'],
        coverImage: '/images/categories/duvet-covers-2.jpg',
        images: [],
        description: 'Crisp and cool to the touch, the percale weave is a year-round classic. A matte finish with a satisfying weight that only improves with every wash.',
        descriptionKa: 'კრიალა და გრილი შეხებაზე — პერკალის ქსოვილი წლის ნებისმიერ დროს იდეალურია. მქრქალი ფინიში, რომელიც ყოველი რეცხვით უმჯობესდება.',
        descriptionRu: 'Хрустящий и прохладный на ощупь перкаль — классика на все сезоны. Матовая фактура с приятным весом, которая становится лучше с каждой стиркой.',
        credits: '',
      },
      {
        id: 'linen-duvet-cover',
        title: 'Washed Linen Duvet Cover', nameKa: 'ნარეცხი სელის საბნის გარსი', nameRu: 'Пододеяльник Лён',
        price: '₾189',
        colors: ['#e8e0d5', '#d4c4b8', '#8fa3a0', '#9a9080'], colorNames: ['Ivory', 'Stone', 'Dusty Blue', 'Taupe'],
        formats: ['140×200', '160×200', '200×220', '220×240'],
        coverImage: '/images/categories/duvet-covers-3.jpg',
        images: [],
        description: 'Natural Belgian linen that softens with every wash. A relaxed texture with excellent breathability for warm sleepers.',
        descriptionKa: 'ბუნებრივი ბელგიური სელი, რომელიც ყოველი რეცხვით რბილდება. ნატურალური ტექსტურა და შესანიშნავი სუნთქვადობა.',
        descriptionRu: 'Натуральный бельгийский лён, который смягчается с каждой стиркой. Расслабленная текстура и отличная воздухопроницаемость.',
        credits: '',
      },
    ],
  },
  {
    id: '02', slug: 'bed-sheets',
    name: 'BED SHEETS', nameKa: 'ლეიბის თეთრეული', nameRu: 'ПРОСТЫНИ',
    collection: 'Bedding', year: '2025',
    coverImage: '/images/categories/bed-sheets-cover.jpg',
    coverVideo: '/videos/categories/bed-sheets-cover.mp4',
    description: 'Slip into sheets made for deep, uninterrupted sleep. Woven from the finest cotton with a breathable finish, they stay cool in summer and cosy in winter.',
    descriptionKa: 'სუნთქვადი პირსაფენები სრულყოფილი ღამის ძილისთვის. კრიალა და გრილი შეხებაზე, განახლებული ძილის გამოცდილება.',
    descriptionRu: 'Дышащие простыни для идеального ночного сна. Хрустящие и прохладные на ощупь — обновлённый опыт отдыха.',
    products: [
      {
        id: 'sateen-fitted-sheet',
        title: 'Sateen Fitted Sheet', nameKa: 'ბამბის ელასტიური ნაფარი', nameRu: 'Простыня на резинке Сатин',
        price: '₾89',
        colors: ['#f5f3ee', '#e8e0d5', '#b0b8b0', '#8fa3a0'], colorNames: ['White', 'Ivory', 'Sage', 'Dusty Blue'],
        formats: ['90×200', '140×200', '160×200', '180×200'],
        coverImage: '/images/categories/bed-sheets-1.jpg',
        images: [],
        description: 'Deep-pocket fitted sheet in crisp percale cotton. Stays tucked all night with a clean, hotel-style finish.',
        descriptionKa: 'ღრმა ჯიბით შემოსახვევი პირსაფენი პერკალის ბამბაში. მთელი ღამე ეჭიდება — სასტუმრო სტილი.',
        descriptionRu: 'Простыня на резинке с глубоким карманом из перкаля. Держится всю ночь с чистым отельным видом.',
        credits: '',
      },
      {
        id: 'percale-flat-sheet',
        title: 'Percale Flat Sheet', nameKa: 'პერკალის ნაფარი', nameRu: 'Плоская простыня Перкаль',
        price: '₾79',
        colors: ['#f5f3ee', '#e8e0d5', '#d4c4b8', '#c8b8c0'], colorNames: ['White', 'Ivory', 'Stone', 'Blush'],
        formats: ['160×260', '200×260', '240×260', '260×280'],
        coverImage: '/images/categories/bed-sheets-2.jpg',
        images: [],
        description: 'A generous flat sheet in smooth percale. Lightweight yet durable, ideal for layering or use on its own.',
        descriptionKa: 'სადა პირსაფენი გლუვ პერკალში. მსუბუქი, გამძლე, იდეალური ლეიერინგისთვის.',
        descriptionRu: 'Плоская простыня из гладкого перкаля. Лёгкая, прочная, идеальна для многослойного использования.',
        credits: '',
      },
      {
        id: 'linen-flat-sheet',
        title: 'Washed Linen Flat Sheet', nameKa: 'ნარეცხი სელის ნაფარი', nameRu: 'Плоская простыня Лён',
        price: '₾109',
        colors: ['#e8e0d5', '#d4c4b8', '#9a9080', '#8fa3a0'], colorNames: ['Ivory', 'Stone', 'Taupe', 'Dusty Blue'],
        formats: ['160×260', '200×260', '240×260'],
        coverImage: '/images/categories/bed-sheets-3.jpg',
        images: [],
        description: 'Stone-washed linen fitted sheet with a relaxed, lived-in feel. Naturally thermoregulating for all-year comfort.',
        descriptionKa: 'ქვით გარეცხილი სელის შემოსახვევი პირსაფენი. ბუნებრივი თერმორეგულაცია მთელი წლის განმავლობაში.',
        descriptionRu: 'Натяжная льняная простыня со стиранным эффектом. Естественная терморегуляция круглый год.',
        credits: '',
      },
    ],
  },
  {
    id: '03', slug: 'pillowcases',
    name: 'PILLOWCASES', nameKa: 'ბალიშის გარსები', nameRu: 'НАВОЛОЧКИ',
    collection: 'Bedding', year: '2025',
    coverImage: '/images/categories/pillowcases-cover.jpg',
    coverVideo: '/videos/categories/pillowcases-cove.mp4',
    description: 'The finishing touch of a perfect bed. Our pillowcases are cut generously, stitched with care, and available in every colour from our seasonal palette.',
    descriptionKa: 'რბილი ბალიშის გარსები სასიამოვნო ძილისთვის. ყოველი რეცხვით უფრო კომფორტული და გამძლე.',
    descriptionRu: 'Мягкие наволочки для приятного сна. С каждой стиркой становятся комфортнее и долговечнее.',
    products: [
      {
        id: 'sateen-standard-pillowcase',
        title: 'Sateen Standard Pillowcase', nameKa: 'ბამბის ბალიშის გარსი', nameRu: 'Наволочка Сатин',
        price: '₾39',
        colors: ['#f5f3ee', '#e8e0d5', '#b0b8b0', '#8fa3a0', '#c8b8c0'], colorNames: ['White', 'Ivory', 'Sage', 'Dusty Blue', 'Blush'],
        formats: ['50×70', '70×70'],
        coverImage: '/images/categories/pillowcases-1.jpg',
        images: [],
        description: 'Silky sateen pillowcase for a luxurious feel against the face. A subtle sheen with exceptional softness.',
        descriptionKa: 'სატინის ბალიშის გარსი სახეზე ფუფუნური შეხებისთვის. ოდნავი ბზინვარება განსაკუთრებული სიმშვიდით.',
        descriptionRu: 'Сатиновая наволочка для роскошного прикосновения. Лёгкий блеск с исключительной мягкостью.',
        credits: '',
      },
      {
        id: 'oxford-pillowcase',
        title: 'Oxford Pillowcase', nameKa: 'ოქსფორდის ბალიშის გარსი', nameRu: 'Наволочка Оксфорд',
        price: '₾49',
        colors: ['#f5f3ee', '#e8e0d5', '#d4c4b8', '#8fa3a0'], colorNames: ['White', 'Ivory', 'Stone', 'Dusty Blue'],
        formats: ['50×70', '70×70'],
        coverImage: '/images/categories/pillowcases-2.jpg',
        images: [],
        description: 'Classic Oxford pillowcase with a neat border flange. A timeless finish that suits any bedding style.',
        descriptionKa: 'კლასიკური ოქსფორდის ბალიშის გარსი ოთხკუთხა კიდით. უმარტეში ფინიში ნებისმიერი საძინებლისთვის.',
        descriptionRu: 'Классическая наволочка Oxford с аккуратной окантовкой. Вневременной финиш для любого стиля постели.',
        credits: '',
      },
      {
        id: 'linen-pillowcase',
        title: 'Washed Linen Pillowcase', nameKa: 'სელის ბალიშის გარსი', nameRu: 'Наволочка Лён',
        price: '₾45',
        colors: ['#e8e0d5', '#d4c4b8', '#9a9080', '#b0b8b0'], colorNames: ['Ivory', 'Stone', 'Taupe', 'Sage'],
        formats: ['50×70', '70×70'],
        coverImage: '/images/categories/pillowcases-3.jpg',
        images: [],
        description: 'Pre-washed linen pillowcase with a naturally crumpled look. Breathable and cool for warm nights.',
        descriptionKa: 'წინასწარ გარეცხილი სელის ბალიშის გარსი. სუნთქვადი და გრილი თბილი ღამეებისთვის.',
        descriptionRu: 'Льняная наволочка с предварительной стиркой и натуральным мятым видом. Дышащая и прохладная.',
        credits: '',
      },
    ],
  },
  {
    id: '04', slug: 'duvets',
    name: 'DUVETS', nameKa: 'საბნები', nameRu: 'ОДЕЯЛА',
    collection: 'Bedding', year: '2025',
    coverImage: '/images/categories/duvets-cover.jpg',
    coverVideo: '/videos/categories/duvets-cover.mp4',
    description: 'The heart of your bed. Our duvets are filled with responsibly sourced down or premium microfibre and come in summer, all-season, and winter weights.',
    descriptionKa: 'პრემიუმ საბნები ყველა სეზონისთვის. აირჩიე სეზონის მიხედვით — საზაფხულო, ყოველსეზონური ან საზამთრო.',
    descriptionRu: 'Одеяла премиум-класса для любого сезона. Выберите по сезону — летнее, всесезонное или зимнее.',
    products: [
      {
        id: 'all-season-down-duvet',
        title: 'All-Season Down Duvet', nameKa: 'ყველა სეზონის ბუმბულის საბანი', nameRu: 'Одеяло всесезонное пух',
        price: '₾299',
        colors: ['#f5f3ee'], colorNames: ['White'],
        formats: ['140×200', '160×200', '200×220', '220×240'],
        coverImage: '/images/categories/duvets-1.jpg',
        images: [],
        description: 'A versatile 200gsm duvet that works year-round. Medium weight for most climates and sleep styles.',
        descriptionKa: 'მრავალმხრივი 200gsm საბანი მთელი წლის განმავლობაში. საშუალო სიმძიმე ნებისმიერი კლიმატისთვის.',
        descriptionRu: 'Универсальное одеяло 200г/м² на весь год. Средний вес для большинства климатов.',
        credits: '',
      },
      {
        id: 'winter-duvet',
        title: 'Winter Duvet', nameKa: 'ზამთრის საბანი', nameRu: 'Зимнее одеяло',
        price: '₾349',
        colors: ['#f5f3ee'], colorNames: ['White'],
        formats: ['140×200', '160×200', '200×220', '220×240'],
        coverImage: '/images/categories/duvets-2.jpg',
        images: [],
        description: 'A generous 300gsm duvet for cold nights. Deeply warm without feeling heavy or restrictive.',
        descriptionKa: '300gsm საბანი ცივი ღამეებისთვის. ღრმა სითბო სიმძიმის შეგრძნების გარეშე.',
        descriptionRu: 'Одеяло 300г/м² для холодных ночей. Глубокое тепло без ощущения тяжести.',
        credits: '',
      },
      {
        id: 'summer-microfibre-duvet',
        title: 'Summer Microfibre Duvet', nameKa: 'ზაფხულის მიკროფიბრის საბანი', nameRu: 'Летнее одеяло микрофибра',
        price: '₾199',
        colors: ['#f5f3ee'], colorNames: ['White'],
        formats: ['140×200', '160×200', '200×220', '220×240'],
        coverImage: '/images/categories/duvets-3.jpg',
        images: [],
        description: 'A lightweight 100gsm duvet for warm nights. Breathable and easy to layer with a throw or blanket.',
        descriptionKa: 'მსუბუქი 100gsm საბანი თბილი ღამეებისთვის. სუნთქვადი და ადვილი ლეიერინგი.',
        descriptionRu: 'Лёгкое одеяло 100г/м² для тёплых ночей. Дышащее, удобно для многослойного использования.',
        credits: '',
      },
    ],
  },
  {
    id: '05', slug: 'pillows',
    name: 'PILLOWS', nameKa: 'ბალიშები', nameRu: 'ПОДУШКИ',
    collection: 'Bedding', year: '2025',
    coverImage: '/images/categories/pillows-cover.jpg',
    coverVideo: '/videos/categories/pillows-cover.mp4',
    description: 'The right pillow transforms your sleep. We offer soft, medium, and firm options in down, memory foam, and hypoallergenic microfibre fills.',
    descriptionKa: 'ჰიპოალერგენული ბალიშები ყველა ძილის სტილისთვის. სამი სიმტკიცის დონე — რბილი, საშუალო, მაგარი.',
    descriptionRu: 'Гипоаллергенные подушки для любого стиля сна. Три уровня жёсткости — мягкий, средний, жёсткий.',
    products: [
      {
        id: 'down-pillow-medium',
        title: 'Down Pillow — Medium', nameKa: 'ბუმბულის ბალიში — საშუალო', nameRu: 'Подушка пуховая — средняя',
        price: '₾129',
        colors: ['#f5f3ee'], colorNames: ['White'],
        formats: ['50×70', '70×70'],
        coverImage: '/images/categories/pillows-1.jpg',
        images: [],
        description: 'A medium-support pillow suitable for all sleep positions. The most popular choice for a balanced feel.',
        descriptionKa: 'საშუალო სიმტკიცის ბალიში ყველა ძილის პოზისთვის. ყველაზე პოპულარული არჩევანი.',
        descriptionRu: 'Подушка средней жёсткости для всех поз сна. Самый популярный выбор.',
        credits: '',
      },
      {
        id: 'memory-foam-pillow',
        title: 'Memory Foam Pillow', nameKa: 'მეხსიერების ქაფის ბალიში', nameRu: 'Подушка Memory Foam',
        price: '₾159',
        colors: ['#f5f3ee'], colorNames: ['White'],
        formats: ['50×70', '70×70'],
        coverImage: '/images/categories/pillows-2.jpg',
        images: [],
        description: 'A firm-fill pillow for side sleepers or those who need strong neck support.',
        descriptionKa: 'მაგარი ბალიში გვერდზე მძინარეთათვის ან ძლიერი კისრის მხარდაჭერის საჭიროებისთვის.',
        descriptionRu: 'Жёсткая подушка для тех, кто спит на боку или нуждается в поддержке шеи.',
        credits: '',
      },
      {
        id: 'microfibre-pillow-soft',
        title: 'Microfibre Pillow — Soft', nameKa: 'მიკროფიბრის ბალიში — რბილი', nameRu: 'Подушка микрофибра — мягкая',
        price: '₾89',
        colors: ['#f5f3ee'], colorNames: ['White'],
        formats: ['50×70', '70×70'],
        coverImage: '/images/categories/pillows-3.jpg',
        images: [],
        description: 'A soft-fill pillow for those who sleep on their stomach or prefer a gentle, yielding feel.',
        descriptionKa: 'რბილი ბალიში მუცელზე მძინარეთათვის ან მათთვის, ვისაც ნაზი შეხება ურჩევნია.',
        descriptionRu: 'Мягкая подушка для тех, кто спит на животе или предпочитает нежное ощущение.',
        credits: '',
      },
    ],
  },
  {
    id: '06', slug: 'towels',
    name: 'TOWELS', nameKa: 'პირსახოცები', nameRu: 'ПОЛОТЕНЦА',
    collection: 'Bedding', year: '2025',
    coverImage: '/images/categories/towels-cover.jpg',
    coverVideo: '/videos/categories/towels-cover.mp4',
    description: 'Absorbent, fast-drying, and indulgently soft. Our towels are woven from 600 gsm Turkish cotton and get better with every wash.',
    descriptionKa: 'შთამნთქმელი, სწრაფმშრალი პირსახოცები პრემიუმ ბამბისგან. სასტუმრო ხარისხი თქვენს სახლში.',
    descriptionRu: 'Впитывающие, быстросохнущие полотенца из хлопка премиум-класса. Качество отеля у вас дома.',
    products: [
      {
        id: 'bath-towel',
        title: 'Bath Towel', nameKa: 'აბაზანის პირსახოცი', nameRu: 'Банное полотенце',
        price: '₾79',
        colors: ['#f5f3ee', '#e8e0d5', '#b0b8b0', '#8fa3a0', '#c8b8c0'], colorNames: ['White', 'Ivory', 'Sage', 'Dusty Blue', 'Blush'],
        formats: ['70×140'],
        coverImage: '/images/categories/towels-1.jpg',
        images: [],
        description: 'A generous bath towel in 600gsm Turkish cotton. Deeply absorbent with a plush, hotel-quality feel.',
        descriptionKa: '600gsm თურქული ბამბის დიდი პირსახოცი. ღრმად შთამნთქმელი სასტუმრო ხარისხით.',
        descriptionRu: 'Большое банное полотенце из турецкого хлопка 600г/м². Глубоко впитывающее, отельного качества.',
        credits: '',
      },
      {
        id: 'hand-towel',
        title: 'Hand Towel', nameKa: 'ხელის პირსახოცი', nameRu: 'Полотенце для рук',
        price: '₾45',
        colors: ['#f5f3ee', '#e8e0d5', '#b0b8b0', '#8fa3a0', '#c8b8c0'], colorNames: ['White', 'Ivory', 'Sage', 'Dusty Blue', 'Blush'],
        formats: ['50×90'],
        coverImage: '/images/categories/towels-2.jpg',
        images: [],
        description: 'A soft hand towel in Turkish cotton. Quick-drying and gentle on the skin for everyday use.',
        descriptionKa: 'რბილი ხელის პირსახოცი თურქული ბამბაში. სწრაფმშრალი ყოველდღიური გამოყენებისთვის.',
        descriptionRu: 'Мягкое полотенце для рук из турецкого хлопка. Быстросохнущее для ежедневного использования.',
        credits: '',
      },
      {
        id: 'face-cloth',
        title: 'Face Cloth', nameKa: 'სახის ხელსახოცი', nameRu: 'Салфетка для лица',
        price: '₾25',
        colors: ['#f5f3ee', '#e8e0d5', '#b0b8b0', '#8fa3a0', '#c8b8c0'], colorNames: ['White', 'Ivory', 'Sage', 'Dusty Blue', 'Blush'],
        formats: ['30×30'],
        coverImage: '/images/categories/towels-3.jpg',
        images: [],
        description: 'A gentle face towel in soft cotton. Delicate enough for daily skincare routines.',
        descriptionKa: 'ნაზი სახის პირსახოცი რბილ ბამბაში. ყოველდღიური კანის მოვლისთვის.',
        descriptionRu: 'Нежное полотенце для лица из мягкого хлопка. Деликатное для ежедневного ухода за кожей.',
        credits: '',
      },
    ],
  },
  {
    id: '07', slug: 'blankets',
    name: 'BLANKETS', nameKa: 'პლედები', nameRu: 'ПЛЕДЫ',
    collection: 'Bedding', year: '2025',
    coverImage: '/images/categories/blankets-cover.jpg',
    description: 'A layered bed is a beautiful bed. Our blankets are made for those in-between seasons — generous enough to sleep under, elegant enough to drape.',
    descriptionKa: 'თბილი საფარები და პლედები სახლის ყოველი ოთახისთვის. ბუნებრივი მასალები, კომფორტული ტექსტურა.',
    descriptionRu: 'Уютные пледы и покрывала для каждой комнаты. Натуральные материалы, комфортная текстура.',
    products: [
      {
        id: 'waffle-weave-blanket',
        title: 'Waffle Weave Blanket', nameKa: 'ვაფლის ქსოვის პლედი', nameRu: 'Плед вафельный',
        price: '₾159',
        colors: ['#f5f3ee', '#e8e0d5', '#d4c4b8', '#9a9080'], colorNames: ['White', 'Ivory', 'Stone', 'Taupe'],
        formats: ['130×170', '150×200', '200×220'],
        coverImage: '/images/categories/blankets-1.jpg',
        images: [],
        description: 'A waffle-weave cotton blanket with a relaxed, textured look. Lightweight yet warming for year-round use.',
        descriptionKa: 'ვაფლის ქსოვილის ბამბის საფარი. მსუბუქი, მაგრამ მთელი წლის განმავლობაში სათბობი.',
        descriptionRu: 'Хлопковое покрывало вафельного переплетения. Лёгкое, но согревающее круглый год.',
        credits: '',
      },
      {
        id: 'knitted-throw',
        title: 'Chunky Knit Throw', nameKa: 'მსხვილი ქსოვის პლედი', nameRu: 'Плед крупной вязки',
        price: '₾199',
        colors: ['#e8e0d5', '#d4c4b8', '#b0b8b0', '#9a9080'], colorNames: ['Ivory', 'Stone', 'Sage', 'Taupe'],
        formats: ['130×170', '150×200'],
        coverImage: '/images/categories/blankets-2.jpg',
        images: [],
        description: 'A hand-finished chunky knit throw in soft merino-blend yarn. Adds warmth and texture to any room.',
        descriptionKa: 'ხელით დამუშავებული სქელი ნაქსოვი პლედი. სითბო და ტექსტურა ნებისმიერ ოთახში.',
        descriptionRu: 'Вязаный плед ручной работы из мягкой пряжи. Добавляет тепло и текстуру любой комнате.',
        credits: '',
      },
      {
        id: 'wool-blanket',
        title: 'Merino Wool Blanket', nameKa: 'მერინოს მატყლის პლედი', nameRu: 'Плед мериносовая шерсть',
        price: '₾249',
        colors: ['#e8e0d5', '#d4c4b8', '#8fa3a0', '#c8b8c0'], colorNames: ['Ivory', 'Stone', 'Dusty Blue', 'Blush'],
        formats: ['150×200', '200×220'],
        coverImage: '/images/categories/blankets-3.jpg',
        images: [],
        description: 'A stonewashed linen throw with a relaxed drape. Naturally cooling in summer, cosy in cooler months.',
        descriptionKa: 'ქვით გარეცხილი სელის პლედი. ბუნებრივად გამაგრილებელი ზაფხულში, თბილი გაცივებისას.',
        descriptionRu: 'Льняной плед с каменной стиркой и свободным драпе. Охлаждает летом, согревает в прохладу.',
        credits: '',
      },
    ],
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug)
}

export function getProductById(category: Category, productId: string): Product | undefined {
  return category.products.find(p => p.id === productId)
}

export function getRelatedCategories(current: Category, count = 4): Category[] {
  const same   = categories.filter(c => c.slug !== current.slug && c.collection === current.collection)
  const others = categories.filter(c => c.slug !== current.slug && c.collection !== current.collection)
  return [...same, ...others].slice(0, count)
}
