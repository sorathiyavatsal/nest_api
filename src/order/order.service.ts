import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
    async getAllOrder() {
        return [
            {
                orderId: 1,
                customerName: "Angel",
                customerPic: "https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75",
                date: "22Dec, 2021",
                products: "₹545",
                location: "Location Name",
                status: "processing"
            },
            {
                orderId: 2,
                customerName: "Dianne",
                customerPic: "https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75",
                date: "22Dec, 2021",
                products: "₹545",
                location: "Location Name",
                status: "inactive"
            }
        ];
    }

    async postOrder() {
        return {
            _id: "61e15773d3f69678b5af40b9",
            customerName: "Dianne",
            customerPic: "https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75",
            date: "22Dec, 2021",
            products: "₹545",
            location: "Location Name",
            status: "inactive"
        }
    }
}
