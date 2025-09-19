export const OrderData = [
  {
    _id: '68bfdc69024705a3f86c526d',
    orderType: '外帶',
    orderCode: 'A-001',
    orderList: [
      {
        itemCode: 'A-001-1',
        item: [
          {
            productId: '68775442e77f9e8571d63a1d',
            name: '冬瓜茶',
            price: 25,
            qty: 2,
            addons: [
              {
                group: '份量',
                options: [
                  {
                    name: '中杯',
                    price: 0,
                    selected: true,
                  },
                  {
                    name: '大杯',
                    price: 10,
                    selected: false,
                  },
                ],
              },
              {
                group: '冰塊',
                options: [
                  {
                    name: '正常',
                    price: 0,
                    selected: false,
                  },
                  {
                    name: '少冰',
                    price: 0,
                    selected: true,
                  },
                  {
                    name: '去冰',
                    price: 0,
                    selected: false,
                  },
                ],
              },
            ],
          },
        ],
        isServed: false,
        createdBy: '67e3e56a92d90a19268d36a3',
      },
    ],
    totalPrice: 50,
    isAllServed: true,
    isPaid: true,
    isComplete: false,
    isDeleted: false,
    createdAt: '2025-09-09T07:51:05.296Z',
    updatedAt: '2025-09-09T07:51:05.296Z',
    __v: 0,
  },
  {
    _id: '68bfd8f5024705a3f86c5257',
    orderType: '內用',
    orderCode: 'T-01-001',
    tableId: {
      _id: '67e7b857b0da2c2418bc9728',
      tableNumber: 1,
    },
    orderList: [
      {
        itemCode: 'T-01-001-1',
        item: [
          {
            productId: '6877539be77f9e8571d63a05',
            name: '牛肉麵',
            price: 140,
            qty: 1,
            addons: [
              {
                group: '加麵',
                options: [
                  {
                    name: '不加',
                    price: 0,
                    selected: true,
                  },
                  {
                    name: '加麵',
                    price: 10,
                    selected: false,
                  },
                ],
              },
              {
                group: '辣度',
                options: [
                  {
                    name: '不辣',
                    price: 0,
                    selected: true,
                  },
                  {
                    name: '小辣',
                    price: 0,
                    selected: false,
                  },
                  {
                    name: '大辣',
                    price: 0,
                    selected: false,
                  },
                ],
              },
            ],
            compositeId: '6877539be77f9e8571d63a05_不加_不辣',
          },
          {
            productId: '687753e6e77f9e8571d63a0b',
            name: '水餃 (10顆)',
            price: 60,
            qty: 1,
            addons: null,
            compositeId: '687753e6e77f9e8571d63a0b',
          },
          {
            productId: '687753fce77f9e8571d63a0f',
            name: '魯蛋 (1顆)',
            price: 15,
            qty: 1,
            addons: null,
            compositeId: '687753fce77f9e8571d63a0f',
          },
        ],
        isServed: false,
        createdBy: null,
      },
      {
        itemCode: 'T-01-001-2',
        item: [
          {
            productId: '68775423e77f9e8571d63a17',
            name: '蛋花湯',
            price: 30,
            qty: 1,
            addons: null,
            compositeId: '68775423e77f9e8571d63a17',
          },
          {
            productId: '68775439e77f9e8571d63a1b',
            name: '古早味紅茶',
            price: 20,
            qty: 1,
            addons: [
              {
                group: '份量',
                options: [
                  {
                    name: '中杯',
                    price: 0,
                    selected: true,
                  },
                  {
                    name: '大杯',
                    price: 10,
                    selected: false,
                  },
                ],
              },
              {
                group: '冰塊',
                options: [
                  {
                    name: '正常',
                    price: 0,
                    selected: false,
                  },
                  {
                    name: '少冰',
                    price: 0,
                    selected: true,
                  },
                  {
                    name: '去冰',
                    price: 0,
                    selected: false,
                  },
                ],
              },
            ],
            compositeId: '68775439e77f9e8571d63a1b_中杯_少冰',
          },
        ],
        isServed: false,
        createdBy: null,
      },
    ],
    totalPrice: 265,
    isAllServed: false,
    isPaid: false,
    isComplete: false,
    isDeleted: false,
    createdAt: '2025-09-09T07:36:21.657Z',
    updatedAt: '2025-09-09T07:36:47.643Z',
    __v: 1,
  },
];

const bb = {
  _id: '68c77e9d7a0c637895608518',
  orderType: '內用',
  orderCode: 'T-03-001',
  tableId: {
    _id: '67e7b860b0da2c2418bc972e',
    tableNumber: 3,
  },
  orderList: [
    {
      itemCode: 'T-03-001-1',
      item: [
        {
          productId: '6877539be77f9e8571d63a05',
          name: '牛肉麵',
          price: 140,
          qty: 2,
          addons: [
            {
              group: '加麵',
              options: [
                {
                  name: '不加',
                  price: 0,
                  selected: false,
                },
                {
                  name: '加麵',
                  price: 10,
                  selected: true,
                },
              ],
            },
            {
              group: '辣度',
              options: [
                {
                  name: '不辣',
                  price: 0,
                  selected: true,
                },
                {
                  name: '小辣',
                  price: 0,
                  selected: false,
                },
                {
                  name: '大辣',
                  price: 0,
                  selected: false,
                },
              ],
            },
          ],
          compositeId: '6877539be77f9e8571d63a05_加麵_不辣',
        },
        {
          productId: '687753e6e77f9e8571d63a0b',
          name: '水餃 (10顆)',
          price: 60,
          qty: 1,
          addons: null,
          compositeId: '687753e6e77f9e8571d63a0b',
        },
        {
          productId: '68775439e77f9e8571d63a1b',
          name: '古早味紅茶',
          price: 20,
          qty: 1,
          addons: [
            {
              group: '份量',
              options: [
                {
                  name: '中杯',
                  price: 0,
                  selected: true,
                },
                {
                  name: '大杯',
                  price: 10,
                  selected: false,
                },
              ],
            },
            {
              group: '冰塊',
              options: [
                {
                  name: '正常',
                  price: 0,
                  selected: true,
                },
                {
                  name: '少冰',
                  price: 0,
                  selected: false,
                },
                {
                  name: '去冰',
                  price: 0,
                  selected: false,
                },
              ],
            },
          ],
          compositeId: '68775439e77f9e8571d63a1b_中杯_正常',
        },
      ],
      isServed: true,
      createdBy: null,
    },
    {
      itemCode: 'T-03-001-2',
      item: [
        {
          productId: '6877542fe77f9e8571d63a19',
          name: '貢丸湯',
          price: 35,
          qty: 1,
          addons: null,
          compositeId: '6877542fe77f9e8571d63a19',
        },
      ],
      isServed: true,
      createdBy: null,
    },
  ],
  totalPrice: 415,
  isAllServed: true,
  isPaid: true,
  isComplete: true,
  isDeleted: false,
  createdAt: '2025-09-15T02:49:01.918Z',
  updatedAt: '2025-09-15T08:52:08.899Z',
  __v: 1,
};
