import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreService {
  async getAllStore() {
    return [
      {
        storeId: 1,
        storeName: 'Angel',
        storePic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        merchantName: 'Angel',
        merchantPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        products: 545,
        reviews: 4.5,
        status: 'active',
      },
      {
        storeId: 2,
        storeName: 'Dianne',
        storePic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        merchantName: 'Dianne',
        merchantPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        products: '545',
        reviews: 5.0,
        status: 'inactive',
      },
    ];
  }

  async postStore() {
    return {
      _id: '61e15773d3f69678b5af40b9',
      storeName: 'Dianne',
      storePic:
        'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
      merchantName: 'Dianne',
      merchantPic:
        'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
      products: '545',
      reviews: 5.0,
      status: 'inactive',
    };
  }
}
