import { db } from './db.js';

// ======================================================
// КАТЕГОРИИ
// ======================================================

const categoriesData = [
  'Electric Guitars',
  'Acoustic Guitars',
  'Bass Guitars',
  'Classical Guitars',
  'Guitar Amplifiers',
  'Pedals & Effects',
  'Accessories',
  'Strings & Parts',
];

// ======================================================
// 4 ТВОИ РЕАЛЬНЫЕ ОБЫЧНЫЕ ГИТАРЫ
// ======================================================

const realOrdinaryProducts = [
  {
    name: 'YŌJU Monochrome',
    description:
      'Electric guitar with a contrasting black and white finish.',
    price: 99900,
    stockQuantity: 10,

    specifications: {
      body: 'Mahogany',
      neck: 'Maple',
      pickups: 'Humbucker',
      bodyShape: 'Stratocaster',
      color: 'Black & White',
    },

    images: [
      'http://localhost:3000/images/black_with_white_1.png',
      'http://localhost:3000/images/black_with_white_2.png',
    ],
  },

  {
    name: 'YŌJU Classic Black',
    description:
      'Classic black electric guitar with a timeless design.',
    price: 109900,
    stockQuantity: 12,

    specifications: {
      body: 'Mahogany',
      neck: 'Maple',
      pickups: 'Dual Humbucker',
      bodyShape: 'Les Paul',
      color: 'Black',
    },

    images: [
      'http://localhost:3000/images/classic_black_1.png',
      'http://localhost:3000/images/classic_black_2.png',
      'http://localhost:3000/images/classic_black_3.png',
    ],
  },

  {
    name: 'YŌJU Hush',
    description:
      'Modern lightweight electric guitar designed for comfortable playing.',
    price: 119900,
    stockQuantity: 8,

    specifications: {
      body: 'Maple',
      neck: 'Mahogany',
      pickups: 'Humbucker',
      bodyShape: 'Other',
      color: 'Black',
    },

    images: [
      'http://localhost:3000/images/donner_hush_1.png',
      'http://localhost:3000/images/donner_hush_2.png',
      'http://localhost:3000/images/donner_hush_3.png',
      'http://localhost:3000/images/donner_hush_4.png',
    ],
  },

  {
    name: 'YŌJU X',
    description:
      'Aggressive electric guitar with a sharp modern silhouette.',
    price: 129900,
    stockQuantity: 7,

    specifications: {
      body: 'Basswood',
      neck: 'Maple',
      pickups: 'Dual Humbucker',
      bodyShape: 'Other',
      color: 'Black',
    },

    images: [
      'http://localhost:3000/images/elektrohgitara_1.png',
      'http://localhost:3000/images/elektrohgitara_2.png',
      'http://localhost:3000/images/elektrohgitara_3.png',
      'http://localhost:3000/images/elektrohgitara_4.png',
    ],
  },
];

// ======================================================
// 2 ТВОИ РЕАЛЬНЫЕ LIMITED
// ======================================================

const realLimitedProducts = [
  {
    name: 'YŌJU Black Limited',
    description:
      'Exclusive limited edition black electric guitar.',
    price: 169900,
    stockQuantity: 3,

    specifications: {
      body: 'Mahogany',
      neck: 'Rosewood',
      pickups: 'Dual Humbucker',
      bodyShape: 'Les Paul',
      color: 'Black',
    },

    images: [
      'http://localhost:3000/images/limit_black_1.png',
      'http://localhost:3000/images/limit_black_2.png',
    ],
  },

  {
    name: 'YŌJU Horns Limited',
    description:
      'Rare limited edition guitar with an aggressive horned silhouette.',
    price: 189900,
    stockQuantity: 2,

    specifications: {
      body: 'Mahogany',
      neck: 'Ebony',
      pickups: 'High Output Humbucker',
      bodyShape: 'Other',
      color: 'Black',
    },

    images: [
      'http://localhost:3000/images/limit_black_horns_1.png',
      'http://localhost:3000/images/limit_black_horns_2.png',
    ],
  },
];

// ======================================================
// ДАННЫЕ ДЛЯ ГЕНЕРАЦИИ ТОВАРОВ
// ======================================================

const modelNames = [
  'Shadow',
  'Nova',
  'Eclipse',
  'Phantom',
  'Storm',
  'Aurora',
  'Vortex',
  'Obsidian',
  'Scarlet',
  'Lunar',
  'Solar',
  'Echo',
  'Drift',
  'Pulse',
  'Noir',
  'Zenith',
  'Venom',
  'Spectre',
  'Crimson',
  'Abyss',
];

const colors = [
  'Black',
  'White',
  'Red',
  'Blue',
  'Natural',
  'Sunburst',
  'Purple',
  'Green',
  'Silver',
  'Graphite',
];

const bodyShapes = [
  'Stratocaster',
  'Telecaster',
  'Les Paul',
  'SG',
  'Flying V',
  'Explorer',
  'Offset',
  'Other',
];

const bodyMaterials = [
  'Mahogany',
  'Alder',
  'Basswood',
  'Maple',
  'Ash',
  'Walnut',
];

const neckMaterials = [
  'Maple',
  'Mahogany',
  'Rosewood',
  'Ebony',
];

const pickupTypes = [
  'Single Coil',
  'Humbucker',
  'Dual Humbucker',
  'HSS',
  'SSS',
  'P90',
];

// ======================================================
// СОЗДАЁМ ИЛИ НАХОДИМ 8 КАТЕГОРИЙ
// ======================================================

const categories = [];

for (const name of categoriesData) {
  let category = await db.orm.public.Category
    .whereUnique({ name })
    .first();

  if (!category) {
    category = await db.orm.public.Category.create({
      name,
    });
  }

  categories.push(category);
}

const electricCategory = categories.find(
  (category) => category.name === 'Electric Guitars'
);

if (!electricCategory) {
  throw new Error(
    'Electric Guitars category was not created.'
  );
}

// ======================================================
// СОЗДАЁМ 4 РЕАЛЬНЫХ ОБЫЧНЫХ
// ======================================================

for (const guitar of realOrdinaryProducts) {
  const product = await db.orm.public.Product.create({
    name: guitar.name,
    description: guitar.description,
    price: guitar.price,
    stockQuantity: guitar.stockQuantity,

    isLimited: false,

    specifications: guitar.specifications,

    categoryId: electricCategory.id,
  });

  for (const [index, imageUrl] of guitar.images.entries()) {
    await db.orm.public.ProductImage.create({
      productId: product.id,
      imageUrl,
      sortOrder: index,
    });
  }
}

// ======================================================
// ЕЩЁ 4 ОБЫЧНЫХ
//
// 4 настоящих + 4 generated = 8 обычных
//
// Используем SVG 241-244.
// ======================================================

for (let i = 1; i <= 4; i++) {
  const model = modelNames[i]!;
  const color = colors[i]!;
  const bodyShape = bodyShapes[i]!;
  const body = bodyMaterials[i]!;
  const neck = neckMaterials[i % neckMaterials.length]!;
  const pickups =
    pickupTypes[i % pickupTypes.length]!;

  const imageNumber = 240 + i;

  const imageUrl =
    `http://localhost:3000/images/generated/product-${String(
      imageNumber
    ).padStart(3, '0')}.svg`;

  const product = await db.orm.public.Product.create({
    name: `YŌJU ${model}`,

    description:
      `${color} electric guitar with ${body.toLowerCase()} body ` +
      `and ${pickups.toLowerCase()} pickups.`,

    price: 109900 + i * 7000,

    stockQuantity: 5 + i,

    isLimited: false,

    specifications: {
      color,
      bodyShape,
      body,
      neck,
      pickups,
      series: model,
    },

    categoryId: electricCategory.id,
  });

  await db.orm.public.ProductImage.create({
    productId: product.id,
    imageUrl,
    sortOrder: 0,
  });
}

// ======================================================
// СОЗДАЁМ 2 РЕАЛЬНЫХ LIMITED
// ======================================================

for (const guitar of realLimitedProducts) {
  const product = await db.orm.public.Product.create({
    name: guitar.name,
    description: guitar.description,
    price: guitar.price,
    stockQuantity: guitar.stockQuantity,

    isLimited: true,

    specifications: guitar.specifications,

    categoryId: electricCategory.id,
  });

  for (const [index, imageUrl] of guitar.images.entries()) {
    await db.orm.public.ProductImage.create({
      productId: product.id,
      imageUrl,
      sortOrder: index,
    });
  }
}

// ======================================================
// ЕЩЁ 240 LIMITED
//
// 2 настоящих + 240 generated = 242 limited
//
// Каждый получает СВОЮ SVG:
// product-001.svg
// product-002.svg
// ...
// product-240.svg
// ======================================================

for (let i = 1; i <= 240; i++) {
  const category =
    categories[i % categories.length]!;

  const model =
    modelNames[i % modelNames.length]!;

  const color =
    colors[i % colors.length]!;

  const bodyShape =
    bodyShapes[i % bodyShapes.length]!;

  const body =
    bodyMaterials[i % bodyMaterials.length]!;

  const neck =
    neckMaterials[
      (i + 1) % neckMaterials.length
    ]!;

  const pickups =
    pickupTypes[
      (i + 2) % pickupTypes.length
    ]!;

  // Каждый товар получает собственный SVG
  const imageUrl =
    `http://localhost:3000/images/generated/product-${String(
      i
    ).padStart(3, '0')}.svg`;

  // Некоторые товары специально Out of stock,
  // чтобы потом проверить фильтр Availability.
  const stockQuantity =
    i % 18 === 0
      ? 0
      : (i % 5) + 1;

  // Цена хранится целым числом.
  // Например 149900 = 1499.00 €
  const price =
    129900 +
    (i % 30) * 5000 +
    (i % 7) * 1000;

  const product = await db.orm.public.Product.create({
    name:
      `YŌJU ${model} ${color} Limited ` +
      `${String(i).padStart(3, '0')}`,

    description:
      `${color} limited edition ${category.name.toLowerCase()} ` +
      `with ${body.toLowerCase()} body, ` +
      `${neck.toLowerCase()} neck and ` +
      `${pickups.toLowerCase()} pickups.`,

    price,

    stockQuantity,

    isLimited: true,

    specifications: {
      color,
      bodyShape,
      body,
      neck,
      pickups,
      series: model,
      edition: `Limited ${String(i).padStart(
        3,
        '0'
      )}`,
      modelNumber: i,
    },

    categoryId: category.id,
  });

  await db.orm.public.ProductImage.create({
    productId: product.id,
    imageUrl,
    sortOrder: 0,
  });
}

// ======================================================
// ГОТОВО
// ======================================================

console.log('Seed completed.');
console.log('Categories: 8');
console.log('Ordinary products: 8');
console.log('Limited products: 242');
console.log('Total products: 250');