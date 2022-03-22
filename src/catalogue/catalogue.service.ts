import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catalogue } from './catalogue.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { metaData } from 'src/product/metaData.model';
import { Product } from 'src/product/product.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class CatalogueService {
  constructor(
    @InjectModel('metaData') private metaDataModel: Model<metaData>,
    @InjectModel('catalogue') private catalogueModel: Model<catalogue>,
    @InjectModel('Products') private ProductsModel: Model<Product>,
  ) {}

  async getcatalogueId() {
    return {
      catalogueId: ObjectId(),
    };
  }

  async getFiltercatalogue(filter: any) {
    let condition = [];

    if (filter.catalogue) {
      condition.push({
        $match: {
          _id: ObjectId(filter.catalogue),
        },
      });
    }

    condition.push(
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'userdatas',
          localField: 'storeId',
          foreignField: '_id',
          as: 'stores',
        },
      },
      {
        $lookup: {
          from: 'metadatas',
          localField: 'options',
          foreignField: '_id',
          as: 'options',
        },
      },
      {
        $unwind: '$options',
      },
      { $skip: parseInt(filter.page) * parseInt(filter.limit) },
      { $limit: parseInt(filter.limit) },
    );

    var catalogue = await this.catalogueModel.aggregate(condition);

    let storeCategory = [],
      store = [],
      collection = [],
      category = [],
      brand = [];

    for (let i = 0; i < catalogue.length; i++) {
      for (let j = 0; j < catalogue[i]['products'].length; j++) {
        var products = JSON.parse(
          JSON.stringify(
            await this.ProductsModel.aggregate([
              {
                $match: {
                  _id: catalogue[i]['products'][j]['_id'],
                },
              },
              {
                $lookup: {
                  from: 'userdatas',
                  localField: 'store',
                  foreignField: '_id',
                  as: 'stores',
                },
              },
              {
                $unwind: {
                  path: '$stores',
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
                  as: 'categories',
                },
              },
              {
                $unwind: {
                  path: '$categories',
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $lookup: {
                  from: 'categories',
                  localField: 'collections',
                  foreignField: '_id',
                  as: 'collection',
                },
              },
              {
                $unwind: {
                  path: '$collection',
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
                  'variantoptionDetails.salepprice': {
                    $gte: filter.minprice,
                    $lte: filter.maxprice,
                  },
                },
              },
              {
                $match: {
                  'stores.shop_name': {
                    $regex: filter.store ? filter.store : '',
                    $options: 'i',
                  },
                },
              },
              {
                $match: {
                  'categories.categoryName': {
                    $regex: filter.category ? filter.category : '',
                    $options: 'i',
                  },
                },
              },
              {
                $match: {
                  'collection.categoryName': {
                    $regex: filter.collection ? filter.collection : '',
                    $options: 'i',
                  },
                },
              },
              {
                $match: {
                  'brand.brandName': {
                    $regex: filter.brand ? filter.brand : '',
                    $options: 'i',
                  },
                },
              },
            ]),
          ),
        );

        for (let k = 0; k < products.length; k++) {
          if (
            products[k] &&
            products[k]['stores'] &&
            products[k]['stores']['shop_name']
          ) {
            store.push(products[k]['stores']['shop_name']);
          }
          if (
            products[k] &&
            products[k]['collection'] &&
            products[k]['collection']['categoryName']
          ) {
            collection.push(products[k]['collection']['categoryName']);
          }

          if (
            products[k] &&
            products[k]['storeCategories'] &&
            products[k]['storeCategories']['categoryName']
          ) {
            storeCategory.push(products[k]['storeCategories']['categoryName']);
          }

          if (
            products[k] &&
            products[k]['categories'] &&
            products[k]['categories']['categoryName']
          ) {
            category.push(products[k]['categories']['categoryName']);
          }
          if (
            products[k] &&
            products[k]['brand'] &&
            products[k]['brand']['brandName']
          ) {
            brand.push(products[k]['brand']['brandName']);
          }
        }
      }
    }

    return {
      catalogues: catalogue,
      filters: {
        store: [...new Set(store)],
        collection: [...new Set(collection)],
        storeCategory: [...new Set(storeCategory)],
        category: [...new Set(category)],
        brand: [...new Set(brand)],
      },
      pages: Math.ceil(
        (await this.catalogueModel.find({}).count()) / filter.limit,
      ),
    };
  }

  async getAllcatalogue() {
    var catalogue = await this.catalogueModel.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'userdatas',
          localField: 'storeId',
          foreignField: '_id',
          as: 'stores',
        },
      },
      {
        $lookup: {
          from: 'metadatas',
          localField: 'options',
          foreignField: '_id',
          as: 'options',
        },
      },
      {
        $unwind: {
          path: '$options',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    return catalogue;
  }

  async getcatalogueById(product: any) {
    let condition = {};
    if (product.productid) {
      condition['productId'] = ObjectId(product.productid);
    }
    condition['storeId'] = ObjectId(product.storeid);
    console.log(condition);

    var catalogue = await this.catalogueModel.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'products',
        },
      },
      {
        $lookup: {
          from: 'userdatas',
          localField: 'storeId',
          foreignField: '_id',
          as: 'stores',
        },
      },
      {
        $lookup: {
          from: 'variants',
          localField: 'variants',
          foreignField: '_id',
          as: 'variantsDetails',
        },
      },
      {
        $unwind: {
          path: '$variantsDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'variantoptions',
          localField: 'variantsDetails.options',
          foreignField: '_id',
          as: 'variantoptionDetails',
        },
      },
      {
        $match: condition,
      },
    ]);

    for (let i = 0; i < catalogue.length; i++) {
      catalogue[i].variantsDetails['variantoptionDetails'] =
        catalogue[i].variantoptionDetails;
      delete catalogue[i].variantoptionDetails;
    }

    return catalogue; //await this.catalogueModel.find(condition);
  }

  async addNewcatalogue(dto: any) {
    const newcatalogue = {
      productId: ObjectId(dto.productId),
      storeId: ObjectId(dto.storeId),
      catalogueStatus: dto.catalogueStatus,
      options: ObjectId(dto.options),
    };
    return await new this.catalogueModel(newcatalogue).save();
  }

  async updatecatalogue(id: string, dto: any) {
    return await this.catalogueModel
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: dto }, { new: true })
      .then(
        (data: any) => {
          return data.toObject({ versionKey: false });
        },
        (error) => {
          let msg = 'Something went wrong!';
          if (error.errmsg) msg = error.errmsg;
          return new BadRequestException(msg);
        },
      );
  }

  async postVariant(metaDto: any) {
    const metaDataResult = await this.metaDataModel.findOne({
      productId: ObjectId(metaDto.catalogueId),
      metaKey: 'catalogue_options',
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
        productId: ObjectId(metaDto.catalogueId),
        metaKey: 'catalogue_options',
      });
    } else {
      const metaData = await new this.metaDataModel({
        productId: ObjectId(metaDto.catalogueId),
        metaKey: 'catalogue_options',
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
      productId: ObjectId(optionsDto.catalogueId),
      metaKey: 'catalogue_variants',
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
                mrpprice: optionsDto.mrpprice,
                salepprice: optionsDto.salepprice,
                qty: optionsDto.qty,
                discount: JSON.parse(JSON.stringify(optionsDto.discount)),
                unitWight: optionsDto.unitWight,
                pics: optionsDto.pics,
              },
            ],
          },
        },
      );

      return await this.metaDataModel.findOne({
        productId: ObjectId(optionsDto.catalogueId),
        metaKey: 'catalogue_variants',
      });
    } else {
      return await new this.metaDataModel({
        productId: ObjectId(optionsDto.catalogueId),
        metaKey: 'catalogue_variants',
        parentMetaId: ObjectId(optionsDto.parentMetaId),
        metaValue: [
          {
            options: JSON.parse(JSON.stringify(optionsDto.options)),
            optionsImage: optionsDto.optionsImage,
            mrpprice: optionsDto.mrpprice,
            salepprice: optionsDto.salepprice,
            qty: optionsDto.qty,
            discount: JSON.parse(JSON.stringify(optionsDto.discount)),
            unitWight: optionsDto.unitWight,
            pics: optionsDto.pics,
          },
        ],
        status: true,
      }).save();
    }
  }
}
