import type { ItemModel } from "../infrastructure/SaleModel";

export class Item {
    '@id': string;
    id: number;
    title: string;

    private constructor(idIri: string, id: number, title: string) {
        this['@id'] = idIri;
        this.id = id;
        this.title = title;
    }

    public static fromModel(model: ItemModel): Item {
        return new Item(model['@id'], model['id'], model['title']);
    }
}