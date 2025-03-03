import type { Sale } from "../../domain/Sale";

export class UpdateSaleModel {
    quantity: number;
    price: number;
    sellPrice: number;
    taxPrice: number;
    sold: boolean;
    item: string;

    constructor(sale: Sale) {
        this.quantity = 1;
        this.price = sale.price;
        this.sellPrice = sale.sellPrice;
        this.taxPrice = sale.taxPrice;
        this.sold = sale.sold;
        this.item = sale.item["@id"];
    }
}