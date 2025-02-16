export type ItemModel = {
    '@id': string;
    'id': number;
    'title': string;
}

export type SaleModel = {
    id: number | null;
    item: ItemModel;
    price: number;
    taxPrice: number;
    sellPrice: number;
    sold: boolean;
}