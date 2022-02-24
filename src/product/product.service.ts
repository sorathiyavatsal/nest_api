import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Variant } from './variant.model';
import { VariantOptions } from './variantOptions.model';
@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Variant') private VariantModel: Model<Variant>,
    @InjectModel('VariantOptions')
    private VariantOptionsModel: Model<VariantOptions>,
  ) {}

  async getAllProducts() {
    return [
      {
        productId: 1,
        productName: 'Angel',
        productPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        category: 'Food',
        productReview: '4.5(1300)',
        status: 'active',
      },
      {
        productId: 2,
        productName: 'Dianne',
        productPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        category: 'Fashion',
        productReview: '5.0(1000)',
        status: 'inactive',
      },
    ];
  }

  async postProduct() {
    return {
      _id: '61e15773d3f69678b5af40b9',
      productName: 'Dianne',
      productPic:
        'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
      category: 'Fashion',
      productReview: '5.0(1000)',
      status: 'inactive',
    };
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
}
