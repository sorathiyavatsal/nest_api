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

  async getAllProducts() {
    return await this.ProductsModel.find({
      status: true,
    });
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
      status: productDto.status,
    };
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
      meta_key: metaDto.metakey,
      meta_value: metaDto.metavalue,
      meta_type: metaDto.metatype,
      meta_status: true,
    });

    return await variant.save();
  }

  async postVariantOptions(optionsDto: any) {
    const variant = await this.VariantModel.findOne({
      _id: optionsDto.variantId,
    });

    if (
      (optionsDto.optionsImage && variant.meta_type == true) ||
      (optionsDto.optionsText && variant.meta_type == false)
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
            meta_options: options._id,
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
