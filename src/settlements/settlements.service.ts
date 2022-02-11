import { Injectable } from '@nestjs/common';
import { Parser } from 'json2csv';

@Injectable()
export class SettlementsService {
  async getAllSettlements() {
    return [
      {
        settlementId: 1,
        daName: 'Angel',
        daProfilePic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        partnerName: 'Angel',
        partnerPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        settlementAmount: '₹545',
        lastSettlementDate: '22 Dec, 2021',
        currentBalance: '₹545',
      },
      {
        settlementId: 1,
        daName: 'Dianne',
        daProfilePic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        partnerName: 'Dianne',
        partnerPic:
          'https://byecom.in/_next/image?url=%2Fbyecom-logo.png&w=256&q=75',
        settlementAmount: '₹545',
        lastSettlementDate: '22 Dec, 2021',
        currentBalance: '₹545',
      },
    ];
  }

  async postSettlements() {
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

  async downloadResource(res, fileName, fields, data) {
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment(fileName);
    return res.send(csv);
  }
}
