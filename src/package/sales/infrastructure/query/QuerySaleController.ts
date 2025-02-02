import { Item } from '../../domain/Item';
import { Sale } from '../../domain/Sale';
import { type ItemModel, type SaleModel } from '../SaleModel'
import { HydraCollectionResponse } from '@/package/common/api/HydraCollectionResponse';
import ApiController from '@/package/common/api/ApiController';

export default class QuerySaleController extends ApiController {
    async retrieveSales(): Promise<HydraCollectionResponse<Sale>> {
        const sales = await this.get<SaleModel>('/sales');

        return HydraCollectionResponse.from<Sale, SaleModel>(sales, (model => Sale.fromModel(model)));
    }

    async retrieveItems(query?: string): Promise<HydraCollectionResponse<Item>> {
        const items = await this.get<ItemModel>(`/items?title=${query}`);

        return HydraCollectionResponse.from<Item, ItemModel>(items, (model => Item.fromModel(model)));
    }
}