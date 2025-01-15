class Sale {
    saleId: number | null = null;
    itemId: number | null = null;
    price: number;
    taxPrice: number = 0;
    sellPrice: number = 0;
    sold: boolean = false;

    constructor(price: number) {
        this.price = price;
    }

    updateSellPrice(sellPrice: number) {
        this.sellPrice = sellPrice;
        this.taxPrice += sellPrice * 0.02;
    }

    markAsSold() {
        this.sold = true;
    }
}