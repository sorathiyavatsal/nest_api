import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catalogue } from './catalogue.model';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Variant } from 'src/product/variant.model';
import { VariantOptions } from 'src/product/variantOptions.model';
let ObjectId = require('mongodb').ObjectId;

@Injectable()
export class CatalogueService {
  constructor(
    @InjectModel('Variant') private VariantModel: Model<Variant>,
    @InjectModel('VariantOptions')
    private VariantOptionsModel: Model<VariantOptions>,
    @InjectModel('catalogue') private catalogueModel: Model<catalogue>,
  ) {}
  async getAllcatalogue() {
    return await this.catalogueModel.aggregate([
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
  }

  async getcatalogueById(product: any) {
    return await this.catalogueModel.findById(product);
  }

  async addNewcatalogue(dto: any) {
    const newcatalogue = {
      productId: ObjectId(dto.productId),
      storeId: ObjectId(dto.storeId),
      catalogueStatus: dto.catalogueStatus,
      variants: dto.variants.map((s) => ObjectId(s)),
      variantoptions: dto.variantoptions.map((s) => ObjectId(s)),
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
