export type SaleModel = {
    saleId: number | null;
    itemId: number | null;
    price: number;
    taxPrice: number;
    sellPrice: number;
    sold: boolean;
}