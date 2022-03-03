import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.model';
import { UserData } from 'src/user-data/user-data.model';
import { Categories } from './category.model';
let ObjectId = require('mongodb').ObjectId;
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('categories') private CategoryModel: Model<Categories>,
    @InjectModel('Products') private ProductsModel: Model<Product>,
    @InjectModel('UserData') private UserDataModel: Model<UserData>,
  ) {}

  async getAllCategory() {
    const category = JSON.parse(
      JSON.stringify(
        await this.CategoryModel.aggregate([
          {
            $match: { status: true },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'parent',
              foreignField: '_id',
              as: 'parent',
            },
          },
        ]),
      ),
    );

    for (let i = 0; i < category.length; i++) {
      if (category[i].categoryType == 'Collection') {
        category[i]['products'] = await this.ProductsModel.find({
          collections: category[i]._id,
        }).count();
      }
      if (category[i].categoryType == 'Store') {
        category[i]['products'] = await this.ProductsModel.find({
          store: category[i]._id,
        }).count();
      }
      if (category[i].categoryType == 'Porduct') {
        category[i]['products'] = await this.ProductsModel.find({
          category: category[i]._id,
        }).count();
      }

      category[i]['stores'] = await this.UserDataModel.find({
        categoryId: category[i]._id,
      }).count();
    }

    return category;
  }

  async getCategory(categoryId: string) {
    const category = JSON.parse(
      JSON.stringify(
        await this.CategoryModel.aggregate([
          {
            $match: {
              $and: [{ _id: ObjectId(categoryId) }, { status: true }],
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'parent',
              foreignField: '_id',
              as: 'parent',
            },
          },
        ]),
      ),
    );

    for (let i = 0; i < category.length; i++) {
      if (category[i].categoryType == 'Collection') {
        category[i]['products'] = await this.ProductsModel.find({
          collections: category[i]._id,
        }).count();
      }
      if (category[i].categoryType == 'Store') {
        category[i]['products'] = await this.ProductsModel.find({
          store: category[i]._id,
        }).count();
      }
      if (category[i].categoryType == 'Porduct') {
        category[i]['products'] = await this.ProductsModel.find({
          category: category[i]._id,
        }).count();
      }

      category[i]['stores'] = await this.UserDataModel.find({
        categoryId: category[i]._id,
      }).count();
    }

    return category;
  }

  async getTypeCategory(categoryDto: any) {
    const category = JSON.parse(
      JSON.stringify(
        await this.CategoryModel.aggregate([
          {
            $match: {
              $and: [{ categoryType: categoryDto.type }, { status: true }],
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'parent',
              foreignField: '_id',
              as: 'parent',
            },
          },
          {
            $match: {
              categoryName: {
                $regex: categoryDto.name ? categoryDto.name : '',
                $options: 'i',
              },
            },
          },
        ]),
      ),
    );

    for (let i = 0; i < category.length; i++) {
      if (category[i].categoryType == 'Collection') {
        category[i]['products'] = await this.ProductsModel.find({
          collections: category[i]._id,
        }).count();
      }
      if (category[i].categoryType == 'Store') {
        category[i]['products'] = await this.ProductsModel.find({
          store: category[i]._id,
        }).count();
      }
      if (category[i].categoryType == 'Porduct') {
        category[i]['products'] = await this.ProductsModel.find({
          category: category[i]._id,
        }).count();
      }

      category[i]['stores'] = await this.UserDataModel.find({
        categoryId: category[i]._id,
      }).count();
    }

    return category;
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
      categoryData['parent'] = ObjectId(categoryDto.parent);
    }

    const newCategory = await new this.CategoryModel(categoryDto);

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
