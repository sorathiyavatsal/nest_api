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

  async filterCondition(filter: any) {
    let condition = [];
    condition.push(
      {
        $lookup: {
          from: 'products',
          let: { pId: '$productId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$pId'] } } },
            {
              $lookup: {
                from: 'categories',
                let: { cId: '$category' },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$cId'] } } }],
                as: 'category',
              },
            },
            {
              $lookup: {
                from: 'categories',
                let: { scId: '$storeCategory' },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$scId'] } } }],
                as: 'storeCategory',
              },
            },
            {
              $lookup: {
                from: 'categories',
                let: { colId: '$collections' },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$colId'] } } }],
                as: 'collection',
              },
            },
            {
              $lookup: {
                from: 'brands',
                let: { bId: '$brand' },
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$bId'] } } }],
                as: 'brand',
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                secondary_name: 1,
                description: 1,
                pageTitle: 1,
                metaOptions: 1,
                metaDescription: 1,
                urlHandle: 1,
                productImage: 1,
                keywords: 1,
                category: { $first: '$category' },
                storeCategory: { $first: '$storeCategory' },
                collection: { $first: '$collection' },
                brand: { $first: '$brand' },
                type: 1,
                review: 1,
                addon: 1,
                status: 1,
              },
            },
          ],
          as: 'product',
        },
      },
      {
        $unwind: {
          path: '$products',
          preserveNullAndEmptyArrays: true,
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
          localField: 'variants',
          foreignField: '_id',
          as: 'variants',
        },
      },
      {
        $unwind: {
          path: '$variants',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          catalogueStatus: 1,
          variants: '$variants.metaValue',
          product: { $first: '$product' },
          stores: { $first: '$stores' },
          shopName: { $first: '$stores.shop_name' },
          loc: { $first: '$stores.shop_Lat_Long' },
          keywords: { $first: '$product.keywords' },
          price: { $first: '$variants.metaValue.salepprice' },
          productName: { $first: '$product.name' },
          productSecondaryName: { $first: '$product.secondary_name' },
          storeName: { $first: '$stores.shop_name' },
          brandName: { $first: '$product.brand.brandName' },
          storeCategoryName: { $first: '$product.storeCategory.categoryName' },
          collectionName: { $first: '$product.collection.categoryName' },
          categoryName: { $first: '$product.category.categoryName' },
        },
      },
    );

    if (filter.catalogue) {
      let catalogueId = [];
      filter.storeName.split(',').forEach((element) => {
        condition.push({
          _id: ObjectId(element),
        });
      });

      condition.push({
        $match: {
          $or: catalogueId,
        },
      });
    }

    if (filter.maxprice && filter.minprice) {
      condition.push({
        $match: {
          $and: [
            { price: { $gte: parseInt(filter.minprice) } },
            { price: { $lte: parseInt(filter.maxprice) } },
          ],
        },
      });
    }

    if (filter.storeName) {
      let storeName = [];
      filter.storeName.split(',').forEach((element) => {
        storeName.push({
          storeName: {
            $regex: element,
            $options: 'i',
          },
        });
      });

      condition.push({
        $match: {
          $or: storeName,
        },
      });
    }

    if (filter.brandName) {
      let brandName = [];
      filter.brandName.split(',').forEach((element) => {
        brandName.push({
          brandName: {
            $regex: element,
            $options: 'i',
          },
        });
      });

      condition.push({
        $match: {
          $or: brandName,
        },
      });
    }

    if (filter.storeCategoryName) {
      let storeCategoryName = [];
      filter.storeCategoryName.split(',').forEach((element) => {
        storeCategoryName.push({
          storeCategoryName: {
            $regex: element,
            $options: 'i',
          },
        });
      });

      condition.push({
        $match: {
          $or: storeCategoryName,
        },
      });
    }

    if (filter.collectionName) {
      let collectionName = [];
      filter.collectionName.split(',').forEach((element) => {
        collectionName.push({
          collectionName: {
            $regex: element,
            $options: 'i',
          },
        });
      });

      condition.push({
        $match: {
          $or: collectionName,
        },
      });
    }

    if (filter.categoryName) {
      let categoryName = [];
      filter.categoryName.split(',').forEach((element) => {
        categoryName.push({
          categoryName: {
            $regex: element,
            $options: 'i',
          },
        });
      });

      condition.push({
        $match: {
          $or: categoryName,
        },
      });
    }

    if (filter.productName) {
      let productName = [];
      filter.productName.split(',').forEach((element) => {
        productName.push({
          productName: {
            $regex: element,
            $options: 'i',
          },
        });

        productName.push({
          productSecondaryName: {
            $regex: element,
            $options: 'i',
          },
        });
      });

      condition.push({
        $match: {
          $or: productName,
        },
      });
    }

    if (filter.keywords) {
      let words = [];
      filter.keywords.split(',').forEach((element) => {
        words.push({
          keywords: {
            $regex: element,
            $options: 'i',
          },
        });
      });

      condition.push({
        $match: {
          $or: words,
        },
      });
    }

    if (filter.lat && filter.lng && filter.radius) {
      condition.push({
        $match: {
          loc: {
            $geoWithin: {
              $centerSphere: [
                [parseFloat(filter.lat), parseFloat(filter.lng)],
                filter.radius / 1000 / 6378.1,
              ],
            },
          },
        },
      });
    }

    condition.push({
      $project: {
        _id: 1,
        catalogueStatus: 1,
        variants: 1,
        product: 1,
        stores: 1,
      },
    });

    return condition;
  }

  async getFilter(filter: any) {
    const condition = await this.filterCondition(filter);

    let catalogue = await this.catalogueModel.aggregate(condition);

    let storeCategory = [],
      store = [],
      collection = [],
      category = [],
      brand = [];

    for (let i = 0; i < catalogue.length; i++) {
      if (
        catalogue[i].product &&
        catalogue[i]['stores'] &&
        catalogue[i]['stores']['shop_name']
      ) {
        store.push(catalogue[i]['stores']['shop_name']);
      }
      if (
        catalogue[i].product &&
        catalogue[i].product['collection'] &&
        catalogue[i].product['collection']['categoryName']
      ) {
        collection.push(catalogue[i].product['collection']['categoryName']);
      }

      if (
        catalogue[i].product &&
        catalogue[i].product['storeCategory'] &&
        catalogue[i].product['storeCategory']['categoryName']
      ) {
        storeCategory.push(
          catalogue[i].product['storeCategory']['categoryName'],
        );
      }

      if (
        catalogue[i].product &&
        catalogue[i].product['category'] &&
        catalogue[i].product['category']['categoryName']
      ) {
        category.push(catalogue[i].product['category']['categoryName']);
      }
      if (
        catalogue[i].product &&
        catalogue[i].product['brand'] &&
        catalogue[i].product['brand']['brandName']
      ) {
        brand.push(catalogue[i].product['brand']['brandName']);
      }
    }

    return {
      filter: {
        store: [...new Set(store)],
        collection: [...new Set(collection)],
        storeCategory: [...new Set(storeCategory)],
        category: [...new Set(category)],
        brand: [...new Set(brand)],
      },
    };
  }

  async getFiltercatalogue(filter: any) {
    const condition = await this.filterCondition(filter);

    let catalogue = await this.catalogueModel
      .aggregate(condition)
      .skip(filter.page ? parseInt(filter.page) * parseInt(filter.limit) : 0)
      .limit(filter.limit ? parseInt(filter.limit) : 20);

    let count = await this.catalogueModel.aggregate(condition);

    let pages = count.length / (filter.limit ? parseInt(filter.limit) : 20);

    return {
      catalogue: catalogue,
      pages: pages == 0 ? 0 : pages <= 1 ? 1 : Math.ceil(pages),
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

    var catalogue = JSON.parse(
      JSON.stringify(
        await this.catalogueModel.aggregate([
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
              localField: 'variants',
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
          {
            $match: condition,
          },
        ]),
      ),
    );

    for (let i = 0; i < catalogue.length; i++) {
      const variants = await this.metaDataModel.find({
        _id: ObjectId(catalogue[i]['options']['parentMetaId']),
      });

      catalogue[i]['variants'] = catalogue[i]['options']['metaValue'];
      catalogue[i]['options'] = variants[0]['metaValue'];
    }

    return catalogue; //await this.catalogueModel.find(condition);
  }

  async addNewcatalogue(dto: any) {
    const newcatalogue = {
      _id: ObjectId(dto.catalogueId),
      productId: ObjectId(dto.productId),
      storeId: ObjectId(dto.storeId),
      catalogueStatus: dto.catalogueStatus ? dto.catalogueStatus : true,
      variants: ObjectId(dto.variants),
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
                variants: JSON.parse(JSON.stringify(optionsDto.variants)),
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
