import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';

// 1. Load env variables from .env.local manually
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove surrounding quotes if any
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error('Failed to parse .env.local:', e);
}

// Ensure critical Firebase environment variables are loaded
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error('CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not defined. Make sure .env.local exists with correct keys.');
  process.exit(1);
}

// 2. Initialize Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Mock Products data
const MOCK_PRODUCTS = [
  {
    id: 'coffee-001',
    name: 'Noir Latte',
    description:
      'Double-shot espresso, velvety micro-foam, single-origin Ethiopian Yirgacheffe. Dark, precise, intentional.',
    price: 380,
    category: 'coffee',
    imageUrl: '/images/menu-noir-latte.png',
    isAvailable: true,
    isFeatured: true,
    createdAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'coffee-002',
    name: 'Cappuccino',
    description:
      'Classic equal-thirds construction — espresso, steamed milk, dry foam. No embellishments. Just craft.',
    price: 320,
    category: 'coffee',
    imageUrl: '/images/menu-cappuccino.png',
    isAvailable: true,
    isFeatured: false,
    createdAt: '2025-01-10T08:05:00Z',
  },
  {
    id: 'coffee-003',
    name: 'Signature Cold Brew',
    description:
      'Steeped for 18 hours. Served over hand-carved ice. Clean, bold, and entirely deliberate.',
    price: 340,
    category: 'coffee',
    imageUrl: '/images/menu-cold-brew.png',
    isAvailable: true,
    isFeatured: true,
    createdAt: '2025-01-10T08:10:00Z',
  },
  {
    id: 'coffee-004',
    name: 'Mocha Reserve',
    description:
      'Rich Valrhona dark chocolate, double-shot espresso, silken steamed milk. A controlled indulgence.',
    price: 420,
    category: 'coffee',
    imageUrl: '/images/menu-mocha-reserve.png',
    isAvailable: false,
    isFeatured: false,
    createdAt: '2025-01-10T08:15:00Z',
  },
  {
    id: 'dessert-001',
    name: 'Belgian Brownie',
    description:
      'Dense, fudge-centred, 72% Callebaut chocolate with a glossy ganache crust. Restrained excess.',
    price: 280,
    category: 'dessert',
    imageUrl: '/images/menu-belgian-brownie.png',
    isAvailable: true,
    isFeatured: false,
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'dessert-002',
    name: 'Blueberry Cheesecake',
    description:
      'New York-style cream cheese base, wild blueberry compote, Graham cracker crust. Silken perfection.',
    price: 360,
    category: 'dessert',
    imageUrl: '/images/menu-cheesecake.png',
    isAvailable: true,
    isFeatured: true,
    createdAt: '2025-01-10T09:05:00Z',
  },
  {
    id: 'dessert-003',
    name: 'Chocolate Truffle Tart',
    description:
      'Dark Valrhona ganache, hazelnut praline shell, edible gold leaf. Our most deliberate creation.',
    price: 420,
    category: 'dessert',
    imageUrl: '/images/menu-truffle-tart.png',
    isAvailable: true,
    isFeatured: true,
    createdAt: '2025-01-10T09:10:00Z',
  },
  {
    id: 'dessert-004',
    name: 'Classic Tiramisu',
    description:
      'House-pulled espresso-soaked ladyfingers, mascarpone cream, unsweetened cocoa. The original.',
    price: 320,
    category: 'dessert',
    imageUrl: '/images/menu-tiramisu.png',
    isAvailable: false,
    isFeatured: false,
    createdAt: '2025-01-10T09:15:00Z',
  },
];

async function seed() {
  try {
    const colRef = collection(db, 'products');
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
      console.log(`Database already has ${snapshot.size} products. Skipping seeding to prevent duplication.`);
      return;
    }

    console.log('Starting seed process...');
    for (const product of MOCK_PRODUCTS) {
      const { id, ...data } = product;
      const docRef = doc(db, 'products', id);
      await setDoc(docRef, data);
      console.log(`✔ Seeded: ${data.name} (ID: ${id})`);
    }
    console.log('🎉 Seeding successfully completed!');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
}

seed();
