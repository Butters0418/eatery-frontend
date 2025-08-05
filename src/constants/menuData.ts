import { Product } from '../types/productType';
import { v4 as uuidv4 } from 'uuid';

export const menuData: Product[] = [
  {
    productId: '687217ff5f3ae3892f5d82cd',
    name: '牛肉麵',
    description: '濃郁紅燒湯頭，搭配軟嫩牛肉與彈牙麵條！',
    price: 140,
    category: '麵類',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647236197-beef-noodle.png',
    isAvailable: true,
    isPopular: true,
    addons: [
      {
        group: '加麵',
        options: [
          {
            name: '不加',
            price: 0,
          },
          {
            name: '加麵',
            price: 10,
          },
        ],
      },
      {
        group: '辣度',
        options: [
          {
            name: '不辣',
            price: 0,
          },
          {
            name: '小辣',
            price: 0,
          },
          {
            name: '大辣',
            price: 0,
          },
        ],
      },
    ],
  },
  {
    productId: uuidv4(),
    name: '餛飩麵',
    description: '皮薄餡多的餛飩，搭配Q彈細麵，清爽不油膩。',
    price: 70,
    category: '麵類',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647863310-wonton-noodle.png',
    isAvailable: true,
    isPopular: false,
    addons: [
      {
        group: '加麵',
        options: [
          {
            name: '不加',
            price: 0,
          },
          {
            name: '加麵',
            price: 10,
          },
        ],
      },
      {
        group: '辣度',
        options: [
          {
            name: '不辣',
            price: 0,
          },
          {
            name: '小辣',
            price: 0,
          },
          {
            name: '大辣',
            price: 0,
          },
        ],
      },
    ],
  },
  {
    productId: uuidv4(),
    name: '乾意麵',
    description: '香肉燥拌勻手工意麵。',
    price: 55,
    category: '麵類',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647643777-dry-noodle.png',
    isAvailable: true,
    isPopular: true,
    addons: [
      {
        group: '加麵',
        options: [
          {
            name: '不加',
            price: 0,
          },
          {
            name: '加麵',
            price: 10,
          },
        ],
      },
      {
        group: '辣度',
        options: [
          {
            name: '不辣',
            price: 0,
          },
          {
            name: '小辣',
            price: 0,
          },
          {
            name: '大辣',
            price: 0,
          },
        ],
      },
    ],
  },

  {
    productId: uuidv4(),
    name: '水餃 (10顆)',
    description: '手工豬肉高麗菜水餃。',
    price: 60,
    category: '主食',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647669137-dumpling.png',
    isAvailable: true,
    isPopular: true,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '高麗菜',
    description: '-',
    price: 35,
    category: '滷味',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647616427-cabbage.png',
    isAvailable: true,
    isPopular: false,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '魯蛋 (1顆)',
    description: '-',
    price: 15,
    category: '滷味',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647589910-braised-egg.png',
    isAvailable: true,
    isPopular: true,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '豆干 (3份)',
    description: '-',
    price: 30,
    category: '滷味',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647813633-tofu.png',
    isAvailable: true,
    isPopular: false,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '海帶',
    description: '-',
    price: 20,
    category: '滷味',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647712795-kelp.png',
    isAvailable: true,
    isPopular: false,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '地瓜葉',
    description: '-',
    price: 35,
    category: '滷味',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647787654-sweet-potato-leaf.png',
    isAvailable: true,
    isPopular: true,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '豬耳朵',
    description: '-',
    price: 35,
    category: '滷味',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647766187-pig-ear.png',
    isAvailable: true,
    isPopular: false,
    addons: null,
  },
  {
    productId: '68721c30fa9e459299e4fe89',
    name: '蛋花湯',
    description: '金黃蛋絲搭配清爽湯頭。',
    price: 30,
    category: '湯類',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647689000-egg-drop-soup.png',
    isAvailable: true,
    isPopular: false,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '貢丸湯',
    description: 'Q 彈扎實的手工貢丸，湯頭清甜回甘。',
    price: 35,
    category: '湯類',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647742171-meatball-soup.png',
    isAvailable: true,
    isPopular: true,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '古早味紅茶',
    description: '古早味紅茶香濃甘醇，微甜不膩。',
    price: 20,
    category: '飲料',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647541135-black-tea.png',
    isAvailable: true,
    isPopular: false,
    addons: [
      {
        group: '份量',
        options: [
          {
            name: '中杯',
            price: 0,
          },
          {
            name: '大杯',
            price: 10,
          },
        ],
      },
      {
        group: '冰塊',
        options: [
          {
            name: '正常',
            price: 0,
          },
          {
            name: '少冰',
            price: 0,
          },
          {
            name: '去冰',
            price: 0,
          },
        ],
      },
    ],
  },
  {
    productId: uuidv4(),
    name: '冬瓜茶',
    description: '清涼解渴的冬瓜茶，甘甜順口。',
    price: 25,
    category: '飲料',
    imageUrl:
      'https://storage.googleapis.com/eatery-mvp.firebasestorage.app/products/1752647842159-winter-melon-tea.png',
    isAvailable: true,
    isPopular: true,
    addons: [
      {
        group: '份量',
        options: [
          {
            name: '中杯',
            price: 0,
          },
          {
            name: '大杯',
            price: 10,
          },
        ],
      },
      {
        group: '冰塊',
        options: [
          {
            name: '正常',
            price: 0,
          },
          {
            name: '少冰',
            price: 0,
          },
          {
            name: '去冰',
            price: 0,
          },
        ],
      },
    ],
  },
];
