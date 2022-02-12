import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.model';
@Injectable()
export class CategoryService {

  constructor(
    @InjectModel('Category') private CategoryModel: Model<Category>,
  ) {}

  async getAllCategory() {
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

  async postCategory(request: Request) {

    console.log(request.body)
    // const Category = await this.CategoryModel();

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
