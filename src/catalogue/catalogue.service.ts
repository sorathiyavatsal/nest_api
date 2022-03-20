import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catalogue } from './catalogue.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Variant } from 'src/product/variant.model';
import { VariantOptions } from 'src/product/variantOptions.model';
import { Product } from 'src/product/product.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class CatalogueService {
  constructor(
    @InjectModel('Variant') private VariantModel: Model<Variant>,
    @InjectModel('VariantOptions')
    private VariantOptionsModel: Model<VariantOptions>,
    @InjectModel('catalogue') private catalogueModel: Model<catalogue>,
    @InjectModel('Products') private ProductsModel: Model<Product>,
  ) {}

  async getFiltercatalogue(filter: any) {
      let condition = []

      if(filter.catalogue) {
        condition.push({
            $match: {
              _id: ObjectId(filter.catalogue),
            },
          })
      }

      condition.push({
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
        $unwind: '$variantsDetails',
      },
      {
        $lookup: {
          from: 'variantoptions',
          localField: 'variantsDetails.options',
          foreignField: '_id',
          as: 'variantoptionDetails',
        },
      })
    var catalogue = await this.catalogueModel.aggregate(condition);

    let storeCategory = [], store = [], collection = [], category = [], brand = []

    for (let i = 0; i < catalogue.length; i++) {
      for (let j = 0; j < catalogue[i]['products'].length; j++) {
        var products = JSON.parse(
          JSON.stringify(
            await this.ProductsModel.aggregate([
              {
                $match: {
                  _id: catalogue[i]['products'][j]["_id"],
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

        for(let k = 0; k < products.length; k++) {
            if(products[k] && products[k]["stores"] && products[k]["stores"]["shop_name"]) {
                store.push(products[k]["stores"]["shop_name"])
            }
            if(products[k] && products[k]["collection"] && products[k]["collection"]["categoryName"]) {
                collection.push(products[k]["collection"]["categoryName"])
            }

            if(products[k] && products[k]["storeCategories"] && products[k]["storeCategories"]["categoryName"]) {
                storeCategory.push(products[k]["storeCategories"]["categoryName"])
            }
            
            if(products[k] && products[k]["categories"] && products[k]["categories"]["categoryName"]) {
                category.push(products[k]["categories"]["categoryName"])
            }
            if(products[k] && products[k]["brand"] && products[k]["brand"]["brandName"]) {
                brand.push(products[k]["brand"]["brandName"])
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
          brand: [...new Set(brand)]
        },
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
          from: 'variants',
          localField: 'variants',
          foreignField: '_id',
          as: 'variantsDetails',
        },
      },
      {
        $unwind: '$variantsDetails',
      },
      {
        $lookup: {
          from: 'variantoptions',
          localField: 'variantsDetails.options',
          foreignField: '_id',
          as: 'variantoptionDetails',
        },
      },
    ]);

    for (let i = 0; i < catalogue.length; i++) {
      catalogue[i].variantsDetails['variantoptionDetails'] =
        catalogue[i].variantoptionDetails;
      delete catalogue[i].variantoptionDetails;
    }

    return catalogue;
  }

  async getcatalogueId(catlog: any) {
    var catalogue = await this.catalogueModel.aggregate([
      {
        $match: {
          _id: ObjectId(catlog.id),
        },
      },
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
    ]);

    for (let i = 0; i < catalogue.length; i++) {
      if (catalogue[i] ?? catalogue[i].variantoptionDetails) {
        catalogue[i].variantsDetails['variantoptionDetails'] =
          catalogue[i].variantoptionDetails;
        delete catalogue[i].variantoptionDetails;
      }
    }

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
      variants: dto.variants.map((s) => ObjectId(s)),
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
    const variant = await new this.VariantModel({
      name: metaDto.name,
      type: metaDto.type,
      image: metaDto.image,
      status: true,
    });

    return await variant.save();
  }

  async postVariantOptions(optionsDto: any) {
    const variant = await this.VariantModel.findOne({
      _id: optionsDto.variantId,
    });

    if (
      (optionsDto.optionsImage && variant.type == true) ||
      (optionsDto.optionsText && variant.type == false)
    ) {
      let optionPayload = {
        variant_id: ObjectId(optionsDto.variantId),
        value: optionsDto.optionsValue,
        mrpprice: optionsDto.mrpprice,
        salepprice: optionsDto.salepprice,
        qty: optionsDto.qty,
        status: true,
      };

      if (optionsDto.optionsImage) {
        optionPayload['image'] = optionsDto.optionsImage;
      }

      if (optionsDto.optionsImage) {
        optionPayload['text'] = optionsDto.optionsText;
      }
      const variantOptions = await new this.VariantOptionsModel(optionPayload);

      const options = await variantOptions.save();

      await this.VariantModel.findByIdAndUpdate(
        {
          _id: optionsDto.variantId,
        },
        {
          $push: {
            options: options._id,
          },
        },
      );

      return options;
    } else {
      return false;
    }
  }
}
