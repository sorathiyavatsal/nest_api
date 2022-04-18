import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catalogue } from './catalogue.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { metaData } from 'src/product/metaData.model';
import { Product } from 'src/product/product.model';
import { ConstraintMetadata } from 'class-validator/types/metadata/ConstraintMetadata';
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
          productImage: '$product.productImage',
          price: { $first: '$variants.metaValue.salepprice' },
          productName: { $first: '$product.name' },
          productSecondaryName: { $first: '$product.secondary_name' },
          storeId: { $first: '$stores._id' },
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

    if (filter.storeId) {
      let storeId = [];
      filter.storeId.split(',').forEach((element) => {
        storeId.push({
          storeId: ObjectId(element),
        });
      });

      condition.push({
        $match: {
          $or: storeId,
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
        product: {
          _id: '$product._id',
          name: '$product.name',
          secondary_name: '$product.secondary_name',
          productImage: '$product.productImage',
          type: '$product.type',
          review: '$product.review',
          status: '$product.status',
          collection: '$product.collection.categoryName',
          storeCategory: '$product.storeCategory.categoryName',
          category: '$product.category.categoryName',
          brand: '$product.brand.brandName',
        },
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
      if (catalogue[i].product && catalogue[i].product['collection']) {
        collection.push(catalogue[i].product['collection']);
      }

      if (catalogue[i].product && catalogue[i].product['storeCategory']) {
        storeCategory.push(catalogue[i].product['storeCategory']);
      }

      if (catalogue[i].product && catalogue[i].product['category']) {
        category.push(catalogue[i].product['category']);
      }
      if (catalogue[i].product && catalogue[i].product['brand']) {
        brand.push(catalogue[i].product['brand']);
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

  async getcatalogue(dto: any) {
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
            $lookup: {
              from: 'products',
              localField: 'addon',
              foreignField: '_id',
              as: 'addon',
            },
          },
          {
            $unwind: {
              path: '$options',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $match: {
              _id: ObjectId(dto.id),
            },
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

    return catalogue;
  }

  async getcatalogueById(product: any) {
    try {
      let condition = {};
      if (product.productid) {
        condition['productId'] = ObjectId(product.productid);
      }

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
              $lookup: {
                from: 'products',
                localField: 'addon',
                foreignField: '_id',
                as: 'addon',
              },
            },
            {
              $match: {
                storeId: ObjectId(product.storeid),
              },
            },
            {
              $match: condition,
            },
          ]),
        ),
      );

      var response = [];

      for (let i = 0; i < catalogue.length; i++) {
        var variants = {};
        if (catalogue[i] && catalogue[i]['options']) {
          variants = await this.metaDataModel.find({
            _id: ObjectId(catalogue[i]['options']['parentMetaId']),
          });

          catalogue[i]['variants'] = catalogue[i]['options']['metaValue'];
          catalogue[i]['options'] = variants[0]['metaValue'];
        }

        var catalogueDetails = {
          _id: catalogue[i]['_id'],
          productId: catalogue[i]['productId'],
          catalogueStatus: catalogue[i]['catalogueStatus'],
          variants: catalogue[i]['variants'],
          name: catalogue[i]['products'][0]['name'],
          secondary_name: catalogue[i]['products'][0]['secondary_name'],
          description: catalogue[i]['products'][0]['description'],
          pageTitle: catalogue[i]['products'][0]['pageTitle'],
          metaOptions: catalogue[i]['products'][0]['metaOptions'],
          metaDescription: catalogue[i]['products'][0]['metaDescription'],
          urlHandle: catalogue[i]['products'][0]['urlHandle'],
          productImage: catalogue[i]['products'][0]['productImage'],
          storeCategory: catalogue[i]['products'][0]['storeCategory'],
          category: catalogue[i]['products'][0]['category'],
          collections: catalogue[i]['products'][0]['collections'],
          brand: catalogue[i]['products'][0]['brand'],
          review: catalogue[i]['products'][0]['review'],
          keywords: catalogue[i]['products'][0]['keywords'],
          stores: {
            _id: catalogue[i]['stores'][0]['_id'],
            userId: catalogue[i]['stores'][0]['userId'],
            fullName: catalogue[i]['stores'][0]['fullName'],
            gender: catalogue[i]['stores'][0]['gender'],
            dob: catalogue[i]['stores'][0]['dob'],
            shop_name: catalogue[i]['stores'][0]['shop_name'],
            shop_address: catalogue[i]['stores'][0]['shop_address'],
            sell_items: catalogue[i]['stores'][0]['sell_items'],
            store_image: catalogue[i]['stores'][0]['store_image'],
            adharcard_no: catalogue[i]['stores'][0]['adharcard_no'],
            pancard_no: catalogue[i]['stores'][0]['pancard_no'],
            gst_no: catalogue[i]['stores'][0]['gst_no'],
            license_image: catalogue[i]['stores'][0]['license_image'],
            vehicle_image: catalogue[i]['stores'][0]['vehicle_image'],
            store_no_image: catalogue[i]['stores'][0]['store_no_image'],
            aadhar_card_image: catalogue[i]['stores'][0]['aadhar_card_image'],
            driving_card_image: catalogue[i]['stores'][0]['driving_card_image'],
            pan_card_image: catalogue[i]['stores'][0]['pan_card_image'],
            services_area: catalogue[i]['stores'][0]['services_area'],
            shop_located_at: catalogue[i]['stores'][0]['shop_located_at'],
            delegate_access: catalogue[i]['stores'][0]['delegate_access'],
            store_timing: catalogue[i]['stores'][0]['store_timing'],
            review: catalogue[i]['stores'][0]['review'],
          },
          options: catalogue[i]['options'],
          addon: catalogue[i]['addon'],
        };

        response.push(catalogueDetails);
      }

      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async addNewcatalogue(dto: any) {
    var newcatalogue = {
      _id: ObjectId(dto.catalogueId),
      productId: ObjectId(dto.productId),
      storeId: ObjectId(dto.storeId),
      catalogueStatus: dto.catalogueStatus ? dto.catalogueStatus : true,
      variants: ObjectId(dto.variants),
      catalogueImages: dto.catalogueImages,
    };

    if (dto.addon) {
      newcatalogue['addon'] = dto.addon.map((addon) => ObjectId(addon));
    }

    return await new this.catalogueModel(newcatalogue).save();
  }

  async updatecatalogue(id: string, dto: any) {
    var updateData = {};
    if (dto.catalogueStatus == true || dto.catalogueStatus == false) {
      updateData['catalogueStatus'] = dto.catalogueStatus;
    }

    if (dto.catalogueImages) {
      updateData['catalogueImages'] = dto.catalogueImages;
    }

    if (dto.addon) {
      updateData['addon'] = dto.addon.map((addon) => ObjectId(addon));
    }

    return await this.catalogueModel.updateOne(
      { _id: ObjectId(id) },
      { $set: updateData },
      { upsert: true },
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
              _id: ObjectId(),
              optionName: metaDto.optionName,
              optionValue: metaDto.optionValue.split(','),
              optionImage: metaDto.image,
            },
          },
        },
      );

      var catelogue = JSON.parse(
        JSON.stringify(
          await this.metaDataModel.findOne({
            productId: ObjectId(metaDto.catalogueId),
            metaKey: 'catalogue_options',
          }),
        ),
      );
      catelogue['catalogueId'] = catelogue['productId'];

      delete catelogue['productId'];

      return catelogue;
    } else {
      const metaData = await new this.metaDataModel({
        productId: ObjectId(metaDto.catalogueId),
        metaKey: 'catalogue_options',
        metaValue: [
          {
            _id: ObjectId(),
            optionName: metaDto.optionName,
            optionValue: metaDto.optionValue.split(','),
            optionImage:
              metaDto.image && metaDto.image != 'string' && metaDto.image != ''
                ? metaDto.image
                : '',
          },
        ],
        status: true,
      });

      var catelogue = JSON.parse(JSON.stringify(await metaData.save()));
      catelogue['catalogueId'] = catelogue['productId'];

      delete catelogue['productId'];

      return catelogue;
    }
  }

  async postVariantOption(optionsDto: any) {
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
                _id: ObjectId(),
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

      var catelogue = JSON.parse(
        JSON.stringify(
          await this.metaDataModel.findOne({
            productId: ObjectId(optionsDto.catalogueId),
            metaKey: 'catalogue_variants',
            parentMetaId: ObjectId(optionsDto.parentMetaId),
          }),
        ),
      );
      catelogue['catalogueId'] = catelogue['productId'];

      delete catelogue['productId'];

      return catelogue;
    } else {
      var catelogue = JSON.parse(
        JSON.stringify(
          await new this.metaDataModel({
            productId: ObjectId(optionsDto.catalogueId),
            metaKey: 'catalogue_variants',
            parentMetaId: ObjectId(optionsDto.parentMetaId),
            metaValue: [
              {
                _id: ObjectId(),
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
          }).save(),
        ),
      );
      catelogue['catalogueId'] = catelogue['productId'];

      delete catelogue['productId'];

      return catelogue;
    }
  }

  async patchVariantOptions(id: String, updatedto: any) {
    for (let i = 0; i < updatedto.options.length; i++) {
      var metaOptions = JSON.parse(
        JSON.stringify(
          await this.metaDataModel.findOne({
            productId: ObjectId(id),
            metaKey: 'catalogue_options',
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
            metaKey: 'catalogue_options',
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
      metaKey: 'catalogue_options',
    });
  }

  async patchVariant(id: String, updateDto: any) {
    for (let i = 0; i < updateDto.variants.length; i++) {
      const metaVariants = JSON.parse(
        JSON.stringify(
          await this.metaDataModel.findOne({
            productId: ObjectId(id),
            metaKey: 'catalogue_variants',
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
            metaKey: 'catalogue_variants',
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
      metaKey: 'catalogue_variants',
    });
  }

  async removeVariantOptions(removedto: any) {
    var metaOptions = JSON.parse(
      JSON.stringify(
        await this.metaDataModel.findOne({
          productId: ObjectId(removedto.productId),
          metaKey: 'catalogue_options',
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
          metaKey: 'catalogue_options',
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
      metaKey: 'catalogue_options',
    });
  }

  async removeVariant(removedto: any) {
    var metaVariants = JSON.parse(
      JSON.stringify(
        await this.metaDataModel.findOne({
          productId: ObjectId(removedto.productId),
          metaKey: 'catalogue_variants',
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
          metaKey: 'catalogue_variants',
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
      metaKey: 'catalogue_variants',
    });
  }
}
