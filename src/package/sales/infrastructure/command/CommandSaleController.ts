import { Sale } from '../../domain/Sale';
import { type SaleModel } from '../SaleModel'
import { UpdateSaleModel } from './UpdateSaleModel';
import ApiController from '@/package/common/api/ApiController';

export default class CommandSaleController extends ApiController {
    async saveSale(sale: Sale): Promise<void> {
        await this.post<SaleModel>('/sales', new UpdateSaleModel(sale));
    }
}