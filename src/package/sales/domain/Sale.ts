import type { SaleModel } from "../infrastructure/SaleModel";
import type { Item } from "./Item";

export class Sale {
    saleId: number | null = null;
    item: Item;
    price: number = 0;
    taxPrice: number = 0;
    sellPrice: number = 0;
    sold: boolean = false;

    private constructor(item: Item, price: number, sellPrice: number, sold: boolean) {
        this.item = item;
        this.price = price;
        this.sellPrice = sellPrice;
        this.sold = sold;
    }

    public static new(item: Item, price: number, sellPrice: number, sold: boolean) {
        const sale = new Sale(item, price, sellPrice, sold);

        sale.updateTaxPrice();

        return sale;
    }

    public static fromModel(model: SaleModel) {
        const sale = new Sale(model.item, model.price, model.sellPrice, model.sold);

        sale.saleId = model.id;
        sale.taxPrice = model.taxPrice;

        return sale;
    }

    updateTaxPrice() {
        this.taxPrice += this.sellPrice * 0.02;
    }

    updateSellPrice(sellPrice: number) {
        this.sellPrice = sellPrice;
        this.updateTaxPrice();
    }

    markAsSold() {
        this.sold = true;
    }
}