import type { SaleModel } from "../infrastructure/SaleModel";
import type { Item } from "./Item";

export const CREATE_SALE_TAX_PRICE: number = 0.02;
export const UPDATE_SALE_TAX_PRICE: number = 0.01;

export class Sale {
    saleId: number | null = null;
    item: Item;
    price: number = 0;
    taxPrice: number = 0;
    sellPrice: number = 0;
    sold: boolean = false;

    private constructor(saleId: number | null, item: Item, price: number, sellPrice: number, sold: boolean, taxPrice?: number | null) {
        this.saleId = saleId;
        this.item = item;
        this.price = price;
        this.sellPrice = sellPrice;
        this.sold = sold;

        if (taxPrice) {
            this.taxPrice = taxPrice;
        }
    }

    public static new(item: Item, price: number, sellPrice: number, sold: boolean): Sale {
        const sale = new Sale(null, item, price, sellPrice, sold);

        sale.taxPrice = sale.sellPrice * CREATE_SALE_TAX_PRICE;

        return sale;
    }

    public static fromModel(model: SaleModel): Sale {
        return new Sale(model.id, model.item, model.price, model.sellPrice, model.sold, model.taxPrice);
    }

    clone(): Sale {
        return new Sale(this.saleId, this.item, this.price, this.sellPrice, this.sold, this.taxPrice);
    }

    refreshTaxPrice() {
        this.taxPrice += Math.round(this.sellPrice * UPDATE_SALE_TAX_PRICE);
    }

    updateSellPrice(sellPrice: number, refreshTaxPrice: boolean = true) {
        this.sellPrice = sellPrice;

        if (refreshTaxPrice) {
            this.refreshTaxPrice();
        }
    }

    undoSale() {
        this.sold = false
    }
    markAsSold() {
        this.sold = true;
    }
}