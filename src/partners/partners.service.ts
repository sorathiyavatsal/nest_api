import { Injectable } from '@nestjs/common';

@Injectable()
export class PartnersService {
  async getAllPartners() {
    return [
      {
        partnerId: 1,
        partnerName: 'Angel',
        address: 'Location Name',
        contact: '0123456789',
        da: 5,
        partnerPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
      },
      {
        partnerId: 2,
        partnerName: 'Dianne',
        address: 'Location Name',
        contact: '0654231578',
        da: 4,
        partnerPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
      },
    ];
  }

  async postPartners() {
    return {
      _id: '61e15773d3f69678b5af40b9',
      partnerId: 1,
      partnerName: 'Angel',
      address: 'Location Name',
      contact: '0123456789',
      da: 5,
      partnerPic:
        'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
    };
  }
}
