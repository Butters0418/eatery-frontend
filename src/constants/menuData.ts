import { Product } from '../types/productType';
import { v4 as uuidv4 } from 'uuid';

import {
  beefNoodle,
  blackTea,
  braisedEgg,
  cabbage,
  dryNoodle,
  dumpling,
  eggDropSoup,
  kelp,
  meatballSoup,
  pigEar,
  sweetPotatoLeaf,
  tofu,
  winterMelonTea,
  wontonNoodle,
} from '../assets';

export const menuData: Product[] = [
  {
    productId: uuidv4(),
    name: '牛肉麵',
    description: '濃郁紅燒湯頭，搭配軟嫩牛肉與彈牙麵條！',
    price: 140,
    category: '麵類',
    imageUrl: beefNoodle,
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
    price: 100,
    category: '麵類',
    imageUrl: wontonNoodle,
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
    imageUrl: dryNoodle,
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
    price: 30,
    category: '主食',
    imageUrl: dumpling,
    isAvailable: true,
    isPopular: false,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '高麗菜',
    description: '-',
    price: 35,
    category: '滷味',
    imageUrl: cabbage,
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
    imageUrl: braisedEgg,
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
    imageUrl: tofu,
    isAvailable: true,
    isPopular: true,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '海帶',
    description: '-',
    price: 30,
    category: '滷味',
    imageUrl: kelp,
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
    imageUrl: sweetPotatoLeaf,
    isAvailable: true,
    isPopular: true,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '豬耳朵',
    description: '-',
    price: 45,
    category: '滷味',
    imageUrl: pigEar,
    isAvailable: true,
    isPopular: false,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '蛋花湯',
    description: '金黃蛋絲搭配清爽湯頭。',
    price: 25,
    category: '湯類',
    imageUrl: eggDropSoup,
    isAvailable: true,
    isPopular: false,
    addons: null,
  },
  {
    productId: uuidv4(),
    name: '貢丸湯',
    description: 'Q 彈扎實的手工貢丸，湯頭清甜回甘。',
    price: 30,
    category: '湯類',
    imageUrl: meatballSoup,
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
    imageUrl: blackTea,
    isAvailable: true,
    isPopular: true,
    addons: [
      {
        group: '杯型',
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
    price: 20,
    category: '飲料',
    imageUrl: winterMelonTea,
    isAvailable: true,
    isPopular: false,
    addons: [
      {
        group: '杯型',
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
            name: '去冰',
            price: 0,
          },
        ],
      },
    ],
  },
];
