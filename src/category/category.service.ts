import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Categories } from './category.model';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('categories') private CategoryModel: Model<Categories>,
  ) {}

  async getAllCategory() {
    return await this.CategoryModel.find({
      status: true,
    });
  }

  async getCategory(categoryId: string) {
    return await this.CategoryModel.findOne({
      _id: categoryId,
      status: true,
    });
  }

  async getTypeCategory(categoryDto: any) {
    let condition = {
      categoryType: categoryDto.type,
      status: true,
    };

    console.log(categoryDto.name)
    
    if (categoryDto.name) {
      condition['categoryName'] = '/' + categoryDto.name + '/';
    }

    console.log(condition)
    return await this.CategoryModel.find(condition);
  }

  async postCategory(categoryDto: any) {
    let categoryData = {
      categoryName: categoryDto.categoryName,
      categoryImage: categoryDto.categoryImage,
      categoryType: categoryDto.categoryType,
      description: categoryDto.description,
      status: true,
    };

    if (categoryDto.parent) {
      categoryData['parent'] = categoryDto.parent;
    }

    const newCategory = new this.CategoryModel(categoryDto);

    return await newCategory.save();
  }

  async putCategory(categoryDto: any, id: string) {
    let updateData = {};
    if (categoryDto.categoryName) {
      updateData['categoryName'] = categoryDto.categoryName;
    }
    if (categoryDto.categoryImage) {
      updateData['categoryImage'] = categoryDto.categoryImage;
    }
    if (categoryDto.categoryType) {
      updateData['categoryType'] = categoryDto.categoryType;
    }
    if (categoryDto.description) {
      updateData['description'] = categoryDto.description;
    }
    if (categoryDto.parent) {
      updateData['parent'] = categoryDto.parent;
    }
    if (categoryDto.status) {
      updateData['status'] = categoryDto.status;
    }

    const updateCategory = await this.CategoryModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: updateData,
      },
      { $upsert: true },
    );

    return updateCategory;
  }

  async deleteCategory(id: string) {
    const updateCategory = await this.CategoryModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          status: false,
        },
      },
      { $upsert: true },
    );

    return updateCategory;
  }
}
