import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
import { Variant } from './variant.model';
import { VariantOptions } from './variantOptions.model';
import { Product } from './product.model';
@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Variant') private VariantModel: Model<Variant>,
    @InjectModel('VariantOptions')
    private VariantOptionsModel: Model<VariantOptions>,
    @InjectModel('Products') private ProductsModel: Model<Product>,
  ) {}

  async getAllProducts(filter: any) {
    return await this.ProductsModel.aggregate([
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
          secondary_name: {
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
    ]);
  }

  async getProducts(productId: string) {
    return await this.ProductsModel.findOne({
      _id: productId,
      status: true,
    });
  }

  async postProduct(productDto: any) {
    let productCollection = {
      name: productDto.productName,
      secondary_name: productDto.secodary_productName,
      description: productDto.description,
      pageTitle: productDto.pageTitle,
      Variant: productDto.variant.split(','),
      metaDescription: productDto.metaDescription,
      urlHandle: productDto.urlHandle,
      productImage: productDto.productImage,
      store: productDto.store,
      category: productDto.category,
      collections: productDto.collection,
      brand: productDto.brand,
      keywords: productDto.keywords,
      type: productDto.type,
      status: productDto.status,
    };

    if (productDto.menu) {
      productCollection['menu'] = productDto.menu;
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
    if (productDto.variant) {
      productCollection['Variant'] = productDto.variant.split(',');
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

    return await this.ProductsModel.findByIdAndUpdate(
      { _id: productId },
      {
        $set: productCollection,
      },
      { $upsert: true },
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
        variant_id: optionsDto.variantId,
        value: optionsDto.optionsValue,
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
