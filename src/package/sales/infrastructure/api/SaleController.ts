import { type SaleModel } from './SaleModel'

export default class SellController {
    private sales: SaleModel[] = []

    async retrieveSales(): Promise<SaleModel[]> {
        const response = await fetch('http://127.0.0.1:8000/api/sales?page=1');
        this.sales = await response.json();

        console.log(this.sales);

        return this.sales;
    }
}