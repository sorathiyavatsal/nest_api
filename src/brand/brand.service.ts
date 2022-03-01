import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/product/product.model';
import { Brands } from './brand.model';
@Injectable()
export class BrandService {
  constructor(
    @InjectModel('Brands') private BrandModel: Model<Brands>,
    @InjectModel('Products') private ProductsModel: Model<Product>,
  ) {}

  async getAllBrand() {
    let brand = JSON.parse(
      JSON.stringify(
        await this.BrandModel.find({
          status: true,
        }),
      ),
    );

    for (let i = 0; i < brand.length; i++) {
      brand[i]['products'] = await this.ProductsModel.find({
        brand: brand[i]._id,
      }).count();
    }

    return brand;
  }

  async getBrand(brandId: string) {
    let brand = JSON.parse(
      JSON.stringify(
        await this.BrandModel.findOne({
          _id: brandId,
          status: true,
        }),
      ),
    );
    brand['products'] = await this.ProductsModel.find({
      brand: brand._id,
    }).count();

    return brand;
  }

  async postBrand(brandDto: any) {
    const newBrand = new this.BrandModel({
      brandName: brandDto.brandName,
      brandPic: brandDto.brandImage,
      description: brandDto.description,
      status: brandDto.status || true,
    });

    return await newBrand.save();
  }

  async putBrand(brandDto: any, id: string) {
    let updateData = {};
    if (brandDto.brandName) {
      updateData['brandName'] = brandDto.brandName;
    }
    if (brandDto.brandImage) {
      updateData['brandPic'] = brandDto.brandImage;
    }
    if (brandDto.description) {
      updateData['description'] = brandDto.description;
    }
    if (brandDto.status) {
      updateData['status'] = brandDto.status;
    }

    const updateBrand = await this.BrandModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: updateData,
      },
      { $upsert: true },
    );

    return updateBrand;
  }

  async deleteBrand(id: string) {
    const updateBrand = await this.BrandModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          status: false,
        },
      },
      { $upsert: true },
    );

    return updateBrand;
  }
}
