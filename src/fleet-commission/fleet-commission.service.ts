import { Injectable } from '@nestjs/common';

@Injectable()
export class FleetCommissionService {
    async getAllFleetCommission() {
        return [
            {
                _id: "61e15773d3f69678b5af40b9",
                Variant: "fixed",
                wages: "₹8190.00",
                fuel: "₹1900.00",
                addtionalPerKM: "₹3.50",
                addtionalPerHours: "₹3.50",
                incentive: "75% of incentive received",
                surcharge: "80% of surcharge received",
                shipment: "₹-"
            },
            {
                _id: "61e15773d3f69678b5af40b9",
                Variant: "Variant 01",
                wages: "₹-",
                fuel: "₹-",
                addtionalPerKM: "₹4.00",
                addtionalPerHours: "₹35.00",
                incentive: "75% of incentive received",
                surcharge: "80% of surcharge received",
                shipment: "₹35.00"
            }
        ];
    }

    async postSettlements() {
        return {
            _id: "61e15773d3f69678b5af40b9",
            Name: "fixed",
            wagesTime: "100 Hours",
            wagesDay: "25 Days",
            wagesAmount: "₹8190.00",
            fuelPrice: "₹1500.00",
            fuelKM: "15 km",
            addtionalPerKM: "₹3.50",
            addtionalPerHours: "₹3.50",
            incentive: "75%",
            surcharge: "80%"
        }
    }
}
