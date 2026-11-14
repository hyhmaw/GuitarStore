import { db } from './db.js';

const guitars = [
  {
    name: 'YŌJU Classic Black',
    description: 'Classic electric guitar with a dark finish.',
    price: 89900,
    stockQuantity: 12,
    isLimited: false,
    specifications: {
      body: 'Mahogany',
      neck: 'Maple',
      pickups: 'Humbucker',
    },
    images: [
      'https://placehold.co/800x1000/png?text=YOJU+Classic+Black',
      'https://placehold.co/800x1000/png?text=YOJU+Classic+Black+02',
    ],
  },
  {
    name: 'YŌJU Crimson Limited',
    description: 'Limited edition electric guitar.',
    price: 149900,
    stockQuantity: 3,
    isLimited: true,
    specifications: {
      body: 'Mahogany',
      neck: 'Rosewood',
      pickups: 'Dual Humbucker',
    },
    images: [
      'https://placehold.co/800x1000/png?text=YOJU+Crimson',
      'https://placehold.co/800x1000/png?text=YOJU+Crimson+02',
    ],
  },
  {
    name: 'YŌJU Ivory',
    description: 'Clean and minimal electric guitar.',
    price: 109900,
    stockQuantity: 7,
    isLimited: false,
    specifications: {
      body: 'Alder',
      neck: 'Maple',
      pickups: 'Single Coil',
    },
    images: [
      'https://placehold.co/800x1000/png?text=YOJU+Ivory',
      'https://placehold.co/800x1000/png?text=YOJU+Ivory+02',
    ],
  },
];

let category = await db.orm.public.Category
  .whereUnique({ name: 'Electric Guitars' })
  .first();

if (!category) {
  category = await db.orm.public.Category.create({
    name: 'Electric Guitars',
  });
}

for (const guitar of guitars) {
  let product = await db.orm.public.Product
    .where({ name: guitar.name })
    .first();

  if (!product) {
    product = await db.orm.public.Product.create({
      name: guitar.name,
      description: guitar.description,
      price: guitar.price,
      stockQuantity: guitar.stockQuantity,
      isLimited: guitar.isLimited,
      specifications: guitar.specifications,
      categoryId: category.id,
    });
  }

  const existingImages = await db.orm.public.ProductImage
    .where({ productId: product.id })
    .all();

  if (existingImages.length === 0) {
    for (const [index, imageUrl] of guitar.images.entries()) {
      await db.orm.public.ProductImage.create({
        productId: product.id,
        imageUrl,
        sortOrder: index,
      });
    }
  }
}

console.log('Seed completed');

await db.close();
