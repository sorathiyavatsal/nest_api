import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
import { metaData } from './metaData.model';
import { Product } from './product.model';
let ObjectId = require('mongodb').ObjectId;
@Injectable()
export class ProductService {
  constructor(
    @InjectModel('metaData') private metaDataModel: Model<metaData>,
    @InjectModel('Products') private ProductsModel: Model<Product>,
  ) {}

  async getProductId() {
    return {
      productId: ObjectId(),
    };
  }

  async getAllProducts(filter: any) {
    return await this.ProductsModel.aggregate([
      {
        $lookup: {
          from: 'metadatas',
          localField: 'metaOptions',
          foreignField: '_id',
          as: 'metaOptions',
        },
      },
      {
        $unwind: {
          path: '$metaOptions',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'userdatas',
          localField: 'store',
          foreignField: '_id',
          as: 'store',
        },
      },
      {
        $unwind: {
          path: '$store',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'storeCategory',
          foreignField: '_id',
          as: 'storeCategories',
        },
      },
      {
        $unwind: {
          path: '$storeCategories',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'collections',
          foreignField: '_id',
          as: 'collections',
        },
      },
      {
        $unwind: {
          path: '$collections',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'menus',
          localField: 'menu',
          foreignField: '_id',
          as: 'menu',
        },
      },
      {
        $unwind: {
          path: '$menu',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'review',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      {
        $match: {
          name: {
            $regex: filter.name ? filter.name : '',
            $options: 'i',
          },
        },
      },
      {
        $match: {
          pageTitle: {
            $regex: filter.title ? filter.title : '',
            $options: 'i',
          },
        },
      },
      {
        $match: {
          'store.shop_name': {
            $regex: filter.store ? filter.store : '',
            $options: 'i',
          },
        },
      },
      {
        $match: {
          'category.categoryName': {
            $regex: filter.category ? filter.category : '',
            $options: 'i',
          },
        },
      },
      {
        $match: {
          'collections.categoryName': {
            $regex: filter.collection ? filter.collection : '',
            $options: 'i',
          },
        },
      },
    ]);
  }

  async getFilterProducts(filter: any) {
    var products = JSON.parse(
      JSON.stringify(
        await this.ProductsModel.aggregate([
          {
            $lookup: {
              from: 'metadatas',
              localField: 'metaOptions',
              foreignField: '_id',
              as: 'metaOptions',
            },
          },
          {
            $unwind: {
              path: '$metaOptions',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'userdatas',
              localField: 'store',
              foreignField: '_id',
              as: 'store',
            },
          },
          {
            $unwind: {
              path: '$store',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'storeCategory',
              foreignField: '_id',
              as: 'storeCategories',
            },
          },
          {
            $unwind: {
              path: '$storeCategories',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $unwind: {
              path: '$category',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'collections',
              foreignField: '_id',
              as: 'collections',
            },
          },
          {
            $unwind: {
              path: '$collections',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'menus',
              localField: 'menu',
              foreignField: '_id',
              as: 'menu',
            },
          },
          {
            $unwind: {
              path: '$menu',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'brands',
              localField: 'brand',
              foreignField: '_id',
              as: 'brand',
            },
          },
          {
            $unwind: {
              path: '$brand',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'reviews',
              localField: 'review',
              foreignField: '_id',
              as: 'reviews',
            },
          },
          {
            $match: {
              name: {
                $regex: filter.name ? filter.name : '',
                $options: 'i',
              },
            },
          },
          {
            $match: {
              keywords: {
                $regex: filter.keyword ? filter.keyword : '',
                $options: 'i',
              },
            },
          },
          {
            $match: {
              'store.shop_name': {
                $regex: filter.store ? filter.store : '',
                $options: 'i',
              },
            },
          },
          {
            $match: {
              'category.categoryName': {
                $regex: filter.category ? filter.category : '',
                $options: 'i',
              },
            },
          },
          {
            $match: {
              'collections.categoryName': {
                $regex: filter.collection ? filter.collection : '',
                $options: 'i',
              },
            },
          },
          { $skip: parseInt(filter.page) * parseInt(filter.limit) },
          { $limit: parseInt(filter.limit) },
        ]),
      ),
    );

    let storeCategory = [],
      store = [],
      collection = [],
      category = [],
      brand = [];

    for (let i = 0; i < products.length; i++) {
      if (
        products[i] &&
        products[i]['store'] &&
        products[i]['store']['shop_name']
      ) {
        store.push(products[i]['store']['shop_name']);
      }
      if (
        products[i] &&
        products[i]['collections'] &&
        products[i]['collections']['categoryName']
      ) {
        collection.push(products[i]['collections']['categoryName']);
      }

      if (
        products[i] &&
        products[i]['storeCategories'] &&
        products[i]['storeCategories']['categoryName']
      ) {
        storeCategory.push(products[i]['storeCategories']['categoryName']);
      }

      if (
        products[i] &&
        products[i]['category'] &&
        products[i]['category']['categoryName']
      ) {
        category.push(products[i]['category']['categoryName']);
      }
      if (
        products[i] &&
        products[i]['brand'] &&
        products[i]['brand']['brandName']
      ) {
        brand.push(products[i]['brand']['brandName']);
      }
    }

    return {
      products: products,
      filters: {
        store: [...new Set(store)],
        collection: [...new Set(collection)],
        storeCategory: [...new Set(storeCategory)],
        category: [...new Set(category)],
        brand: [...new Set(brand)],
      },
      pages:
        Math.ceil((await this.ProductsModel.find({}).count()) / filter.limit) -
        1,
    };
  }

  async getProducts(productId: string) {
    var products = JSON.parse(
      JSON.stringify(
        await this.ProductsModel.aggregate([
          {
            $lookup: {
              from: 'metadatas',
              localField: 'metaOptions',
              foreignField: '_id',
              as: 'metaOptions',
            },
          },
          {
            $unwind: {
              path: '$metaOptions',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'userdatas',
              localField: 'store',
              foreignField: '_id',
              as: 'store',
            },
          },
          {
            $unwind: {
              path: '$store',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'storeCategory',
              foreignField: '_id',
              as: 'storeCategories',
            },
          },
          {
            $unwind: {
              path: '$storeCategories',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'category',
            },
          },
          {
            $unwind: {
              path: '$category',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'collections',
              foreignField: '_id',
              as: 'collections',
            },
          },
          {
            $unwind: {
              path: '$collections',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'menus',
              localField: 'menu',
              foreignField: '_id',
              as: 'menu',
            },
          },
          {
            $unwind: {
              path: '$menu',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'brands',
              localField: 'brand',
              foreignField: '_id',
              as: 'brand',
            },
          },
          {
            $unwind: {
              path: '$brand',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'reviews',
              localField: 'review',
              foreignField: '_id',
              as: 'reviews',
            },
          },
          {
            $match: {
              _id: ObjectId(productId),
            },
          },
        ]),
      ),
    );

    return products[0];
  }

  async postProduct(productDto: any) {
    let productCollection = {
      _id: productDto.productId,
      name: productDto.productName,
      secondary_name: productDto.secodary_productName,
      description: productDto.description,
      pageTitle: productDto.pageTitle,
      metaOptions: productDto.metaOptions,
      metaDescription: productDto.metaDescription,
      urlHandle: productDto.urlHandle,
      productImage: productDto.productImage,
      storeCategory: productDto.store.storeCategory,
      category: productDto.category,
      collections: productDto.collection,
      store: productDto.store,
      brand: productDto.brand,
      keywords: productDto.keywords,
      type: productDto.type,
      status: productDto.status,
    };

    if (productDto.parentId) {
      productCollection['parentId'] = productDto.parentId;
    }

    if (productDto.menu) {
      productCollection['menu'] = productDto.menu;
    }

    const product = await new this.ProductsModel(productCollection);

    if (productDto.type == 'addon') {
      await this.ProductsModel.findOneAndUpdate(
        { _id: productDto.parentId },
        {
          addon: product._id,
        },
        { upsert: true },
      );
    }

    return await product.save();
  }

  async putProduct(productDto: any, productId: string) {
    let productCollection = {};

    if (productDto.productName) {
      productCollection['name'] = productDto.productName;
    }
    if (productDto.secodary_productName) {
      productCollection['secondary_name'] = productDto.secodary_productName;
    }
    if (productDto.description) {
      productCollection['description'] = productDto.description;
    }
    if (productDto.pageTitle) {
      productCollection['pageTitle'] = productDto.pageTitle;
    }
    if (productDto.metaOptions) {
      productCollection['metaOptions'] = ObjectId(productDto.metaOptions);
    }
    if (productDto.metaDescription) {
      productCollection['metaDescription'] = productDto.metaDescription;
    }
    if (productDto.urlHandle) {
      productCollection['urlHandle'] = productDto.urlHandle;
    }
    if (productDto.productImage[0]) {
      productCollection['productImage'] = productDto.productImage;
    }
    if (productDto.store) {
      productCollection['store'] = productDto.store;
    }
    if (productDto.category) {
      productCollection['category'] = productDto.category;
    }
    if (productDto.collection) {
      productCollection['collections'] = productDto.collection;
    }
    if (productDto.brand) {
      productCollection['brand'] = productDto.brand;
    }
    if (productDto.status) {
      productCollection['status'] = productDto.status;
    }

    if (productDto.keywords) {
      productCollection['keywords'] = productDto.keywords;
    }

    if (productDto.menu) {
      productCollection['menu'] = productDto.menu;
    }

    if (productDto.type) {
      productCollection['type'] = productDto.type;
    }

    if (productDto.parentId) {
      productCollection['parentId'] = productDto.parentId;

      await this.ProductsModel.findOneAndUpdate(
        { _id: productDto.parentId },
        {
          addon: productId,
        },
        { upsert: true },
      );
    }

    if (productDto.type) {
      productCollection['type'] = productDto.type;
    }

    return await this.ProductsModel.findByIdAndUpdate(
      { _id: productId },
      {
        $set: productCollection,
      },
      { $upsert: true },
    );
  }

  async postVariant(metaDto: any) {
    const metaDataResult = await this.metaDataModel.findOne({
      productId: ObjectId(metaDto.productId),
      metaKey: 'product_options',
    });

    if (metaDataResult) {
      await this.metaDataModel.updateOne(
        {
          _id: metaDataResult._id,
        },
        {
          $push: {
            metaValue: {
              optionName: metaDto.optionName,
              optionValue: metaDto.optionValue,
              optionImage: metaDto.image,
            },
          },
        },
      );

      return await this.metaDataModel.findOne({
        productId: ObjectId(metaDto.productId),
        metaKey: 'product_options',
      });
    } else {
      const metaData = await new this.metaDataModel({
        productId: ObjectId(metaDto.productId),
        metaKey: 'product_options',
        metaValue: [
          {
            optionName: metaDto.optionName,
            optionValue: metaDto.optionValue,
            optionImage: metaDto.image,
          },
        ],
        status: true,
      });

      return await metaData.save();
    }
  }

  async postVariantOptions(optionsDto: any) {
    const metaDataResult = await this.metaDataModel.findOne({
      productId: ObjectId(optionsDto.productId),
      metaKey: 'product_variants',
      parentMetaId: ObjectId(optionsDto.parentMetaId),
    });

    if (metaDataResult) {
      await this.metaDataModel.updateOne(
        {
          _id: metaDataResult._id,
        },
        {
          $push: {
            metaValue: [
              {
                options: JSON.parse(JSON.stringify(optionsDto.options)),
                optionsImage: optionsDto.optionsImage,
              },
            ],
          },
        },
      );

      return await this.metaDataModel.findOne({
        productId: ObjectId(optionsDto.productId),
        metaKey: 'product_variants',
      });
    } else {
      return await new this.metaDataModel({
        productId: ObjectId(optionsDto.productId),
        metaKey: 'product_variants',
        parentMetaId: ObjectId(optionsDto.parentMetaId),
        metaValue: [
          {
            options: JSON.parse(JSON.stringify(optionsDto.options)),
            optionsImage: optionsDto.optionsImage,
          },
        ],
        status: true,
      }).save();
    }
  }

  async deleteProduct(productId: string) {
    return await this.ProductsModel.findByIdAndUpdate(
      { _id: productId },
      {
        $set: {
          status: false,
        },
      },
      { $upsert: true },
    );
  }
}
