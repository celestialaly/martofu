import { Item } from '../../domain/Item';
import { Sale } from '../../domain/Sale';
import { type ItemModel, type SaleModel } from '../SaleModel'
import { HydraCollectionResponse } from '@/package/common/api/HydraCollectionResponse';
import ApiController from '@/package/common/api/ApiController';
import type { ApiPaginator } from '@/package/common/api/ApiPaginator';

export default class QuerySaleController extends ApiController {
    async retrieveSales(paginator: ApiPaginator): Promise<HydraCollectionResponse<Sale>> {
        const sales = await this.getPaginated<SaleModel>('/sales', paginator);

        return HydraCollectionResponse.from<Sale, SaleModel>(sales, (model => Sale.fromModel(model)));
    }

    async retrieveItems(query?: string): Promise<HydraCollectionResponse<Item>> {
        const items = await this.getCollection<ItemModel>(`/items?title=${query}`);

        return HydraCollectionResponse.from<Item, ItemModel>(items, (model => Item.fromModel(model)));
    }
}