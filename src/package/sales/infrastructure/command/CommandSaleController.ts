import { Sale } from '../../domain/Sale';
import { type SaleModel } from '../SaleModel'
import { UpdateSaleModel } from './UpdateSaleModel';
import ApiController from '@/package/common/api/ApiController';

export default class CommandSaleController extends ApiController {
    async saveSale(sale: Sale): Promise<void> {
        const response = await this.api.post<SaleModel>('/sales', new UpdateSaleModel(sale));

        console.log(response);
    }
}