import type { DataTableFilterEvent, DataTableSortEvent } from "primevue"

type PaginatorSearchParameters = {
    page: number,
    limit: number,
    order?: undefined | PaginatorSearchParametersOrder,
    [key: string]: string | number | PaginatorSearchParametersOrder | undefined
}

type PaginatorSearchParametersOrder = {
    [key: string]: string | undefined
}

export class ApiPaginator {
    page: number = 1
    limit: number = 25
    sortField: string | undefined
    sortOrder: string | undefined
    filterField: string | undefined
    filterValue: string | undefined | null

    setPage(page: number, limit: number) {
        this.page = page + 1;
        this.limit = limit;
    }

    setSort(event: DataTableSortEvent) {
        this.sortField = event.sortField as string;
        this.sortOrder = event.sortOrder == -1 ? 'desc' : 'asc';
    }

    setFilter(field: string, value: string | null) {
        this.filterField = field;
        this.filterValue = value;

        console.log(field, value)
    }

    getSearchParameters() {
        const params: PaginatorSearchParameters = {
            page: this.page,
            limit: this.limit
        }

        if (this.sortField) {
            params['order'] = {
                [this.sortField]: this.sortOrder
            }
        }
        if (this.filterValue && this.filterField) {
            params[this.filterField] = this.filterValue
        }

        return params;
    }
}
