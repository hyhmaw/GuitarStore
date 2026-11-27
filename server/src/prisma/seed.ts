// ======================================================
// SEED — заповнення бази тестовими даними.
//
// Запуск:  npm run db:seed
//
// Обсяги за технічним завданням:
//   8 категорій, 250 товарів, 40 користувачів,
//   120 замовлень, 300 відгуків (+ теги).
//
// Дані генеруються детерміновано (той самий результат
// при кожному запуску) — для цього використовується
// генератор псевдовипадкових чисел із фіксованим "зерном".
// ======================================================

import bcrypt from 'bcryptjs';
import { db } from './db.js';

// ------------------------------------------------------
// Детермінований генератор випадкових чисел (mulberry32)
// ------------------------------------------------------
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(2026);
const randomInt = (min: number, max: number) =>
  min + Math.floor(random() * (max - min + 1));
const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(random() * items.length)]!;

// Гроші зберігаються цілим числом у копійках (вимога ТЗ).
// 1 гривня = 100 копійок, тому 12 999 грн = 1 299 900.
const uah = (hryvnias: number) => hryvnias * 100;

// ======================================================
// 1. КАТЕГОРІЇ
// ======================================================

// slug — коротка назва, за якою підбираються фото категорії
const categoriesData = [
  { name: 'Electric Guitars', slug: 'electric' },
  { name: 'Acoustic Guitars', slug: 'acoustic' },
  { name: 'Bass Guitars', slug: 'bass' },
  { name: 'Classical Guitars', slug: 'classical' },
  { name: 'Guitar Amplifiers', slug: 'amp' },
  { name: 'Pedals & Effects', slug: 'pedal' },
  { name: 'Accessories', slug: 'accessory' },
  { name: 'Strings & Parts', slug: 'strings' },
] as const;

type CategorySlug = (typeof categoriesData)[number]['slug'];

// Скільки вільних фото кожної категорії лежить у public/products/stock
const stockPhotoCount: Record<CategorySlug, number> = {
  electric: 6,
  acoustic: 7,
  bass: 6,
  classical: 6,
  amp: 6,
  pedal: 6,
  accessory: 6,
  strings: 6,
};

// ======================================================
// 2. ВЛАСНІ ГІТАРИ З ВЛАСНИМИ ФОТО
// ======================================================

type ProductSeed = {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  isLimited: boolean;
  specifications: Record<string, string>;
  images: string[];
  category: CategorySlug;
};

const ownProducts: ProductSeed[] = [
  {
    name: 'YŌJU Monochrome',
    description: 'Electric guitar with a contrasting black and white finish.',
    price: uah(9999),
    stockQuantity: 10,
    isLimited: false,
    specifications: { body: 'Mahogany', neck: 'Maple', pickups: 'Humbucker', bodyShape: 'Stratocaster', color: 'Black & White' },
    images: ['/images/black_with_white_1.png', '/images/black_with_white_2.png'],
    category: 'electric',
  },
  {
    name: 'YŌJU Classic Black',
    description: 'Classic black electric guitar with a timeless design.',
    price: uah(10999),
    stockQuantity: 12,
    isLimited: false,
    specifications: { body: 'Mahogany', neck: 'Maple', pickups: 'Dual Humbucker', bodyShape: 'Les Paul', color: 'Black' },
    images: ['/images/classic_black_1.png', '/images/classic_black_2.png', '/images/classic_black_3.png'],
    category: 'electric',
  },
  {
    name: 'YŌJU Hush',
    description: 'Modern lightweight electric guitar designed for comfortable playing.',
    price: uah(11999),
    stockQuantity: 8,
    isLimited: false,
    specifications: { body: 'Maple', neck: 'Mahogany', pickups: 'Humbucker', bodyShape: 'Other', color: 'Black' },
    images: ['/images/donner_hush_1.png', '/images/donner_hush_2.png', '/images/donner_hush_3.png', '/images/donner_hush_4.png'],
    category: 'electric',
  },
  {
    name: 'YŌJU X',
    description: 'Aggressive electric guitar with a sharp modern silhouette.',
    price: uah(12999),
    stockQuantity: 7,
    isLimited: false,
    specifications: { body: 'Basswood', neck: 'Maple', pickups: 'Dual Humbucker', bodyShape: 'Other', color: 'Black' },
    images: ['/images/elektrogitara_1.png', '/images/elektrogitara_2.png', '/images/elektrogitara_3.png', '/images/elektrogitara_4.png'],
    category: 'electric',
  },
  {
    name: 'YŌJU Ordinary Black',
    description: 'Reliable everyday electric guitar with a clean black finish.',
    price: uah(8999),
    stockQuantity: 15,
    isLimited: false,
    specifications: { body: 'Alder', neck: 'Maple', pickups: 'HSS', bodyShape: 'Stratocaster', color: 'Black' },
    images: ['/images/ordinary_black_1.png', '/images/ordinary_black_2.png', '/images/ordinary_black_3.png'],
    category: 'electric',
  },
  {
    name: 'YŌJU Pix',
    description: 'Compact electric guitar with a bright, punchy tone.',
    price: uah(7999),
    stockQuantity: 9,
    isLimited: false,
    specifications: { body: 'Basswood', neck: 'Maple', pickups: 'SSS', bodyShape: 'Offset', color: 'Black' },
    images: ['/images/pix_1.png', '/images/pix_2.png', '/images/pix_3.png'],
    category: 'electric',
  },
  {
    name: 'YŌJU Black Limited',
    description: 'Exclusive limited edition black electric guitar.',
    price: uah(16999),
    stockQuantity: 3,
    isLimited: true,
    specifications: { body: 'Mahogany', neck: 'Rosewood', pickups: 'Dual Humbucker', bodyShape: 'Les Paul', color: 'Black' },
    images: ['/images/limit_black_1.png', '/images/limit_black_2.png'],
    category: 'electric',
  },
  {
    name: 'YŌJU Horns Limited',
    description: 'Rare limited edition guitar with an aggressive horned silhouette.',
    price: uah(18999),
    stockQuantity: 1, // остання штука — для демонстрації конкурентної покупки
    isLimited: true,
    specifications: { body: 'Mahogany', neck: 'Ebony', pickups: 'High Output Humbucker', bodyShape: 'Other', color: 'Black' },
    images: ['/images/limit_black_horns_1.png', '/images/limit_black_horns_2.png'],
    category: 'electric',
  },
];

// ======================================================
// 3. ДАНІ ДЛЯ ГЕНЕРАЦІЇ ІНШИХ ТОВАРІВ
// ======================================================

const series = [
  'Shadow', 'Nova', 'Eclipse', 'Phantom', 'Storm', 'Aurora', 'Vortex', 'Obsidian',
  'Scarlet', 'Lunar', 'Solar', 'Echo', 'Drift', 'Pulse', 'Noir', 'Zenith',
  'Venom', 'Spectre', 'Crimson', 'Abyss', 'Ember', 'Frost', 'Halo', 'Onyx',
];
const colors = ['Black', 'White', 'Red', 'Blue', 'Natural', 'Sunburst', 'Purple', 'Green', 'Silver', 'Graphite'];
const woods = ['Mahogany', 'Alder', 'Basswood', 'Maple', 'Ash', 'Walnut', 'Spruce', 'Cedar', 'Rosewood'];

// Скільки згенерувати в кожній категорії (8 власних + 242 = 250)
const generatedCount: Record<CategorySlug, number> = {
  electric: 50,
  acoustic: 35,
  bass: 30,
  classical: 25,
  amp: 30,
  pedal: 30,
  accessory: 22,
  strings: 20,
};

type Generated = Omit<ProductSeed, 'images' | 'category' | 'isLimited' | 'stockQuantity'>;

const generators: Record<CategorySlug, (s: string) => Generated> = {
  electric: (s) => {
    const shape = pick(['Stratocaster', 'Telecaster', 'Les Paul', 'SG', 'Offset', 'Explorer']);
    const pickups = pick(['Single Coil', 'Humbucker', 'Dual Humbucker', 'HSS', 'SSS', 'P90']);
    const color = pick(colors);
    const body = pick(woods);
    return {
      name: `YŌJU ${s} ${shape}`,
      description: `${color} electric guitar with a ${body.toLowerCase()} body and ${pickups.toLowerCase()} pickups.`,
      price: uah(randomInt(60, 450) * 100 - 1),
      specifications: { bodyShape: shape, body, neck: pick(['Maple', 'Mahogany', 'Roasted Maple']), pickups, color, frets: String(pick([22, 24])) },
    };
  },
  acoustic: (s) => {
    const shape = pick(['Dreadnought', 'Jumbo', 'Auditorium', 'Parlor', 'Concert']);
    const top = pick(['Solid Spruce', 'Solid Cedar', 'Laminated Spruce', 'Mahogany']);
    return {
      name: `YŌJU ${s} ${shape}`,
      description: `${shape} acoustic guitar with a ${top.toLowerCase()} top and a warm, balanced sound.`,
      price: uah(randomInt(40, 350) * 100 - 1),
      specifications: { bodyShape: shape, top, backAndSides: pick(woods), electronics: pick(['None', 'Piezo pickup with tuner']), color: pick(['Natural', 'Sunburst', 'Black']) },
    };
  },
  bass: (s) => {
    const strings = pick(['4', '5']);
    const pickups = pick(['P', 'J', 'PJ', 'Dual Humbucker']);
    return {
      name: `YŌJU ${s} Bass ${strings}`,
      description: `${strings}-string bass guitar with ${pickups} pickups and a tight, punchy low end.`,
      price: uah(randomInt(70, 400) * 100 - 1),
      specifications: { strings, pickups, body: pick(woods), scale: pick(['34"', '35"']), color: pick(colors) },
    };
  },
  classical: (s) => {
    const size = pick(['4/4', '3/4', '1/2']);
    return {
      name: `YŌJU ${s} Classic ${size}`,
      description: `Classical nylon-string guitar, size ${size}, ideal for study and fingerstyle.`,
      price: uah(randomInt(25, 250) * 100 - 1),
      specifications: { size, top: pick(['Solid Cedar', 'Solid Spruce', 'Laminated Spruce']), backAndSides: pick(woods), strings: 'Nylon', color: 'Natural' },
    };
  },
  amp: (s) => {
    const watts = pick([10, 15, 20, 30, 50, 100]);
    const type = pick(['Combo', 'Head', 'Bass Combo']);
    return {
      name: `YŌJU ${s} ${watts}W ${type}`,
      description: `${watts}-watt ${type.toLowerCase()} amplifier with clean and drive channels.`,
      price: uah(randomInt(30, 600) * 100 - 1),
      specifications: { power: `${watts} W`, type, technology: pick(['Solid State', 'Tube', 'Modeling']), speaker: pick(['8"', '10"', '12"', '2x12"']) },
    };
  },
  pedal: (s) => {
    const effect = pick(['Overdrive', 'Distortion', 'Fuzz', 'Delay', 'Reverb', 'Chorus', 'Compressor', 'Tuner']);
    return {
      name: `YŌJU ${s} ${effect}`,
      description: `${effect} effects pedal with true bypass and a rugged metal enclosure.`,
      price: uah(randomInt(15, 120) * 100 - 1),
      specifications: { effect, bypass: 'True bypass', power: '9V DC', enclosure: 'Aluminium' },
    };
  },
  accessory: (s) => {
    const item = pick(['Strap', 'Capo', 'Pick Set', 'Gig Bag', 'Stand', 'Clip Tuner', 'Cable 3m', 'Wall Hanger']);
    return {
      name: `YŌJU ${s} ${item}`,
      description: `Durable ${item.toLowerCase()} for everyday playing and touring.`,
      price: uah(randomInt(2, 40) * 100 - 1),
      specifications: { type: item, material: pick(['Leather', 'Nylon', 'Steel', 'Celluloid', 'Cotton']), color: pick(colors) },
    };
  },
  strings: (s) => {
    const gauge = pick(['09-42', '10-46', '11-52', '12-53', '45-105']);
    const material = pick(['Nickel Wound', 'Stainless Steel', 'Phosphor Bronze', 'Nylon']);
    return {
      name: `YŌJU ${s} ${material} ${gauge}`,
      description: `${material} string set, gauge ${gauge}, with a bright and long-lasting tone.`,
      price: uah(randomInt(3, 15) * 100 - 1),
      specifications: { gauge, material, coating: pick(['None', 'Coated']) },
    };
  },
};

const tagNames = [
  'new', 'bestseller', 'sale', 'limited', 'beginner', 'professional',
  'vintage', 'left-handed', 'gift-idea', 'studio', 'stage', 'eco',
];

// ======================================================
// 4. КОРИСТУВАЧІ
// ======================================================

// Пароль для ВСІХ тестових акаунтів (у базі лише його bcrypt-хеш)
const DEMO_PASSWORD = 'Password123!';

const firstNames = [
  'Olena', 'Andrii', 'Iryna', 'Dmytro', 'Kateryna', 'Oleksandr', 'Yulia', 'Maksym',
  'Sofiia', 'Taras', 'Anna', 'Bohdan', 'Mariia', 'Ivan', 'Daria', 'Serhii',
];
const lastNames = [
  'Kovalenko', 'Shevchenko', 'Bondarenko', 'Tkachenko', 'Kravchenko', 'Melnyk',
  'Boiko', 'Oliinyk', 'Lysenko', 'Moroz', 'Petrenko', 'Savchenko',
];
const cities = ['Odesa', 'Kyiv', 'Lviv', 'Kharkiv', 'Dnipro', 'Vinnytsia', 'Poltava', 'Chernihiv'];

const reviewTexts: Record<number, string[]> = {
  5: ['Excellent instrument, sounds amazing!', 'Exactly as described, fast delivery.', 'Best purchase this year.', 'Great build quality, highly recommend.'],
  4: ['Very good for the price.', 'Nice sound, needed a small setup.', 'Solid choice, minor cosmetic flaw.'],
  3: ['Okay, but expected more.', 'Average quality, does the job.'],
  2: ['Packaging was damaged, sound is mediocre.', 'Not worth the price in my opinion.'],
  1: ['Arrived with a defect, very disappointed.'],
};

// ======================================================
// ВИКОНАННЯ
// ======================================================

console.log('Очищення таблиць...');
await db.execute(
  db.raw.sql`TRUNCATE reviews, order_items, orders, product_tags, tags, product_images, products, users, categories RESTART IDENTITY CASCADE`
    .affectedCount()
    .build(),
);

// ---------- категорії ----------
const categoryIdBySlug = {} as Record<CategorySlug, number>;
for (const category of categoriesData) {
  const row = await db.orm.public.Category.create({ name: category.name });
  categoryIdBySlug[category.slug] = row.id;
}

// ---------- теги ----------
const tagIds: number[] = [];
for (const name of tagNames) {
  const tag = await db.orm.public.Tag.create({ name });
  tagIds.push(tag.id);
}
const limitedTagId = tagIds[tagNames.indexOf('limited')]!;

// ---------- список усіх 250 товарів ----------
const productSeeds: ProductSeed[] = [...ownProducts];

for (const category of categoriesData) {
  const slug = category.slug;
  const photos = stockPhotoCount[slug];
  for (let i = 0; i < generatedCount[slug]; i++) {
    const seriesName = series[i % series.length]!;
    const generated = generators[slug](seriesName);
    // Кожен товар отримує 2 фото своєї категорії (по колу)
    const first = (i % photos) + 1;
    const second = ((i + 1) % photos) + 1;
    // ~10 % товарів закінчились, ~10 % мають лише 1 штуку
    const roll = random();
    const stockQuantity = roll < 0.1 ? 0 : roll < 0.2 ? 1 : randomInt(2, 25);

    productSeeds.push({
      ...generated,
      // Номер серії, щоб назви не повторювались
      name: i >= series.length ? `${generated.name} Mk${Math.floor(i / series.length) + 1}` : generated.name,
      stockQuantity,
      isLimited: slug === 'electric' && i % 5 === 0, // кожна 5-та електрогітара — лімітована
      images: [`/images/stock/${slug}-${first}.jpg`, `/images/stock/${slug}-${second}.jpg`],
      category: slug,
    });
  }
}

console.log(`Створення ${productSeeds.length} товарів...`);
const products: { id: number; name: string; price: number }[] = [];

for (const seed of productSeeds) {
  const product = await db.orm.public.Product.create({
    name: seed.name,
    description: seed.description,
    price: seed.price,
    stockQuantity: seed.stockQuantity,
    isLimited: seed.isLimited,
    specifications: seed.specifications,
    categoryId: categoryIdBySlug[seed.category],
  });
  products.push({ id: product.id, name: product.name, price: product.price });

  for (const [index, imageUrl] of seed.images.entries()) {
    await db.orm.public.ProductImage.create({ productId: product.id, imageUrl, sortOrder: index });
  }

  // Теги (зв'язок М:М через таблицю product_tags з датою додавання)
  const productTagIds = new Set<number>();
  if (seed.isLimited) productTagIds.add(limitedTagId);
  const extra = randomInt(1, 3);
  while (productTagIds.size < extra) productTagIds.add(pick(tagIds));
  for (const tagId of productTagIds) {
    await db.orm.public.ProductTag.create({ productId: product.id, tagId });
  }
}

// ---------- користувачі: 1 адмін + 8 менеджерів + 31 покупець = 40 ----------
console.log('Створення 40 користувачів...');
const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

await db.orm.public.User.create({
  name: 'Admin YŌJU',
  email: 'admin@yoju.test',
  passwordHash,
  role: 'administrator',
  managedCategoryId: null,
});

for (const [index, category] of categoriesData.entries()) {
  await db.orm.public.User.create({
    name: `${firstNames[index]} ${lastNames[index]}`,
    email: `manager${index + 1}@yoju.test`,
    passwordHash,
    role: 'manager',
    managedCategoryId: categoryIdBySlug[category.slug],
  });
}

const customerIds: number[] = [];
for (let i = 1; i <= 31; i++) {
  const user = await db.orm.public.User.create({
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    email: `customer${i}@yoju.test`,
    passwordHash,
    role: 'customer',
    managedCategoryId: null,
  });
  customerIds.push(user.id);
}

// ---------- замовлення: 120 ----------
console.log('Створення 120 замовлень...');
// Хто що купив (не скасовані замовлення) — потрібно для відгуків
const purchases: { userId: number; productId: number }[] = [];

for (let n = 1; n <= 120; n++) {
  const userId = pick(customerIds);
  const roll = random();
  const status = roll < 0.5 ? 'shipped' : roll < 0.65 ? 'assembled' : roll < 0.85 ? 'accepted' : 'cancelled';

  // 2–5 різних товарів у замовленні
  const items = new Map<number, { productId: number; productName: string; quantity: number; priceAtPurchase: number }>();
  const itemCount = randomInt(2, 5);
  while (items.size < itemCount) {
    const product = pick(products);
    // Ціна на момент покупки могла відрізнятися від поточної (до -15 %)
    const priceAtPurchase = Math.round((product.price * randomInt(85, 100)) / 100);
    items.set(product.id, { productId: product.id, productName: product.name, quantity: randomInt(1, 2), priceAtPurchase });
  }
  const totalPrice = [...items.values()].reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0);

  const order = await db.orm.public.Order.create({
    userId,
    status,
    deliveryAddress: `${pick(cities)}, ${randomInt(1, 150)} ${pick(['Shevchenka', 'Franka', 'Soborna', 'Nezalezhnosti'])} St.`,
    totalPrice,
    idempotencyKey: `seed-order-${n}`,
  });

  for (const item of items.values()) {
    await db.orm.public.OrderItem.create({ orderId: order.id, ...item });
    if (status !== 'cancelled') purchases.push({ userId, productId: item.productId });
  }
}

// ---------- відгуки: 300, тільки від тих, хто купив ----------
console.log('Створення 300 відгуків...');
const reviewed = new Set<string>();
let reviewCount = 0;

for (const purchase of purchases) {
  if (reviewCount >= 300) break;
  const key = `${purchase.userId}:${purchase.productId}`;
  if (reviewed.has(key)) continue; // один відгук на товар від одного покупця
  reviewed.add(key);

  const roll = random();
  const rating = roll < 0.45 ? 5 : roll < 0.75 ? 4 : roll < 0.88 ? 3 : roll < 0.95 ? 2 : 1;
  const hasComplaint = random() < 0.05;

  await db.orm.public.Review.create({
    userId: purchase.userId,
    productId: purchase.productId,
    rating,
    comment: pick(reviewTexts[rating]!),
    hasComplaint,
    isHidden: hasComplaint && random() < 0.5,
  });
  reviewCount++;
}

if (reviewCount < 300) {
  throw new Error(`Вийшло лише ${reviewCount} відгуків — замало покупок для 300.`);
}

// ---------- реалістичні дати (замовлення за останні пів року) ----------
await db.execute(
  db.raw.sql`UPDATE users SET created_at = now() - make_interval(days => 200 + (id * 7) % 300)`.affectedCount().build(),
);
await db.execute(
  db.raw.sql`UPDATE orders SET created_at = now() - make_interval(days => (id * 37) % 180, hours => id % 24), updated_at = now() - make_interval(days => (id * 37) % 180)`
    .affectedCount()
    .build(),
);
await db.execute(
  db.raw.sql`UPDATE reviews SET created_at = now() - make_interval(days => (id * 13) % 150)`.affectedCount().build(),
);

console.log(`Готово: ${productSeeds.length} товарів, 40 користувачів, 120 замовлень, ${reviewCount} відгуків.`);
console.log(`Тестові акаунти: admin@yoju.test, manager1..8@yoju.test, customer1..31@yoju.test — пароль ${DEMO_PASSWORD}`);

await db.close();
