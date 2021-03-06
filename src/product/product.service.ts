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

  async patchVariantOptions(id: String, updatedto: any) {
    for (let i = 0; i < updatedto.options.length; i++) {
      var metaOptions = JSON.parse(
        JSON.stringify(
          await this.metaDataModel.findOne({
            productId: ObjectId(id),
            metaKey: 'product_options',
          }),
        ),
      );

      if (metaOptions && metaOptions.metaValue) {
        for (let j = 0; j < metaOptions.metaValue.length; j++) {
          if (metaOptions.metaValue[j]['_id'] == updatedto.options[i]['_id']) {
            if (updatedto.options[i]['optionName']) {
              metaOptions.metaValue[j]['optionName'] =
                updatedto.options[i]['optionName'];
            }

            if (updatedto.options[i]['optionValue']) {
              metaOptions.metaValue[j]['optionValue'] =
                updatedto.options[i]['optionValue'];
            }

            if (updatedto.options[i]['optionImage']) {
              metaOptions.metaValue[j]['optionImage'] =
                updatedto.options[i]['optionImage'];
            }
          }
        }

        await this.metaDataModel.update(
          {
            productId: ObjectId(id),
            metaKey: 'product_options',
          },
          {
            $set: {
              metaValue: metaOptions.metaValue,
            },
          },
          {
            $upsert: true,
          },
        );
      }
    }

    return await this.metaDataModel.findOne({
      productId: ObjectId(id),
      metaKey: 'product_options',
    });
  }

  async removeVariantOptions(removedto: any) {
    var metaOptions = JSON.parse(
      JSON.stringify(
        await this.metaDataModel.findOne({
          productId: ObjectId(removedto.productId),
          metaKey: 'product_options',
        }),
      ),
    );

    if (metaOptions && metaOptions.metaValue) {
      var metaValue = [];
      for (let j = 0; j < metaOptions.metaValue.length; j++) {
        if (metaOptions.metaValue[j]['_id'] != removedto.optionId) {
          metaValue.push(metaOptions.metaValue[j]);
        }
      }
      await this.metaDataModel.update(
        {
          productId: ObjectId(removedto.productId),
          metaKey: 'product_options',
        },
        {
          $set: {
            metaValue: metaValue,
          },
        },
      );
    }

    return await this.metaDataModel.findOne({
      productId: ObjectId(removedto.productId),
      metaKey: 'product_options',
    });
  }

  async removeVariant(removedto: any) {
    var metaVariants = JSON.parse(
      JSON.stringify(
        await this.metaDataModel.findOne({
          productId: ObjectId(removedto.productId),
          metaKey: 'product_variants',
        }),
      ),
    );

    if (metaVariants && metaVariants.metaValue) {
      var metaValue = [];
      for (let j = 0; j < metaVariants.metaValue.length; j++) {
        if (metaVariants.metaValue[j]['_id'] != removedto.variantId) {
          metaValue.push(metaVariants.metaValue[j]);
        }
      }
      await this.metaDataModel.update(
        {
          productId: ObjectId(removedto.productId),
          metaKey: 'product_variants',
        },
        {
          $set: {
            metaValue: metaValue,
          },
        },
      );
    }

    return await this.metaDataModel.findOne({
      productId: ObjectId(removedto.productId),
      metaKey: 'product_variants',
    });
  }

  async patchVariant(id: String, updateDto: any) {
    for (let i = 0; i < updateDto.variants.length; i++) {
      const metaVariants = JSON.parse(
        JSON.stringify(
          await this.metaDataModel.findOne({
            productId: ObjectId(id),
            metaKey: 'product_variants',
          }),
        ),
      );

      if (metaVariants && metaVariants.metaValue) {
        for (let j = 0; j < metaVariants.metaValue.length; j++) {
          if (
            metaVariants.metaValue[j]['_id'] == updateDto.variants[i]['_id']
          ) {
            if (updateDto.variants[i]['options']) {
              metaVariants.metaValue[j]['options'] =
                updateDto.variants[i]['options'];
            }

            if (updateDto.variants[i]['optionImage']) {
              metaVariants.metaValue[j]['optionImage'] =
                updateDto.variants[i]['optionImage'];
            }
          }
        }

        await this.metaDataModel.update(
          {
            productId: ObjectId(id),
            metaKey: 'product_variants',
          },
          {
            $set: {
              metaValue: metaVariants.metaValue,
            },
          },
          {
            $upsert: true,
          },
        );
      }
    }

    return await this.metaDataModel.findOne({
      productId: ObjectId(id),
      metaKey: 'product_variants',
    });
  }

  async filterCondition(filter: any) {
    let condition = [];
    condition.push(
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
          'storeCategories.categoryName': {
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
      {
        $skip: filter.page ? parseInt(filter.page) * parseInt(filter.limit) : 0,
      },
      { $limit: filter.limit ? parseInt(filter.limit) : 20 },
    );

    if (filter.sort) {
      if (filter.sort == 'DATE') {
        condition.push({
          $sort: {
            createdAt: filter.sort_order == 'AESC' ? 1 : -1,
          },
        });
      }
      if (filter.sort == 'NAME') {
        condition.push({
          $sort: {
            name: filter.sort_order == 'AESC' ? 1 : -1,
          },
        });
      }
      if (filter.sort == 'PRICE') {
        condition.push({
          $sort: {
            name: filter.sort_order == 'AESC' ? 1 : -1,
          },
        });
      }
    }

    return condition;
  }

  async getAllProducts(filter: any) {
    const condition = await this.filterCondition(filter);

    const product = await this.ProductsModel.aggregate(condition);

    var page = parseInt(filter.page) || 1,
      per_page = parseInt(filter.limit) || 20,
      offset = (page - 1) * per_page,
      paginatedItems = product.slice(offset).slice(0, per_page),
      total_pages = Math.ceil(product.length / per_page);

    return {
      currentPage: page,
      pages: total_pages,
      count: product.length,
      products: paginatedItems,
    };
  }

  async getFilterProducts(filter: any) {
    const condition = await this.filterCondition(filter);

    var products = JSON.parse(
      JSON.stringify(await this.ProductsModel.aggregate(condition)),
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
      filters: {
        store: [...new Set(store)],
        collection: [...new Set(collection)],
        storeCategory: [...new Set(storeCategory)],
        category: [...new Set(category)],
        brand: [...new Set(brand)],
      },
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
              from: 'products',
              localField: 'addon',
              foreignField: '_id',
              as: 'addons',
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

    if (products && products[0] && products[0]['metaOptions']) {
      products[0]['parentMetaId'] = products[0]['metaOptions']['parentMetaId'];

      products[0]['options'] = products[0]['metaOptions']['metaValue'];

      const variants = await this.metaDataModel.find({
        productId: ObjectId(products[0]['metaOptions']['productId']),
        metaKey: 'product_variants',
      });

      if (variants) {
        products[0]['variants'] = variants[0]['metaValue'];
      }

      delete products[0]['metaOptions'];
    }

    return products.isEmpty ? {} : products[0];
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
      storeCategory: productDto.storeCategory,
      category: productDto.category,
      collections: productDto.collection,
      brand: productDto.brand,
      keywords: productDto.keywords,
      type: 'products',
      status: productDto.status,
    };

    if (productDto.menu) {
      productCollection['menu'] = productDto.menu;
    }

    if (productDto.addon) {
      productCollection['addon'] = productDto.addon;
    }

    const product = await new this.ProductsModel(productCollection);

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
              _id: ObjectId(),
              optionName: metaDto.optionName,
              optionValue: metaDto.optionValue.split(','),
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
            _id: ObjectId(),
            optionName: metaDto.optionName,
            optionValue: metaDto.optionValue.split(','),
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
            metaValue: {
              _id: ObjectId(),
              options: JSON.parse(JSON.stringify(optionsDto.options)),
              optionsImage: optionsDto.optionsImage,
            },
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
            _id: ObjectId(),
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
