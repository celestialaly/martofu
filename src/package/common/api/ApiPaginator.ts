import type { DataTableSortEvent } from "primevue"

type PaginatorSearchParameters = {
    page: number,
    limit: number,
    order?: undefined | PaginatorSearchParametersOrder
}

type PaginatorSearchParametersOrder = {
    [key: string]: string | undefined
}

export class ApiPaginator {
    page: number = 1
    limit: number = 25
    sortField: string | undefined
    sortOrder: string | undefined

    setPage(page: number, limit: number) {
        this.page = page + 1;
        this.limit = limit;
    }

    setSort(event: DataTableSortEvent) {
        this.sortField = event.sortField as string
        this.sortOrder = event.sortOrder == -1 ? 'desc' : 'asc'
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

        return params;
    }
}
