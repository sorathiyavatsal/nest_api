import { Injectable } from '@nestjs/common';

@Injectable()
export class BrandService {
    async getAllBrand() {
        return [
            {
                brandId: 1,
                brandName: "Angel",
                brandPic: "https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75",
                products: 545,
                status: "active"
            },
            {
                brandId: 2,
                brandName: "Dianne",
                brandPic: "https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75",
                products: "545",
                status: "inactive"
            }
        ];
    }

    async postBrand() {
        return {
            _id: "61e15773d3f69678b5af40b9",
            brandName: "Dianne",
            brandPic: "https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75",
            products: "545",
            status: "inactive"
        }
    }
}
