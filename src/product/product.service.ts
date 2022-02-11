import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductService {
  async getAllProducts() {
    return [
      {
        productId: 1,
        productName: 'Angel',
        productPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        category: 'Food',
        productReview: '4.5(1300)',
        status: 'active',
      },
      {
        productId: 2,
        productName: 'Dianne',
        productPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        category: 'Fashion',
        productReview: '5.0(1000)',
        status: 'inactive',
      },
    ];
  }

  async postProduct() {
    return {
      _id: '61e15773d3f69678b5af40b9',
      productName: 'Dianne',
      productPic:
        'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
      category: 'Fashion',
      productReview: '5.0(1000)',
      status: 'inactive',
    };
  }
}
