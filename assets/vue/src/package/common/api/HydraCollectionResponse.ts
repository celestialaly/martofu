export type HydraCollectionResponseViewType = {
    '@id': string,
    '@type': string,
    'hydra:first': string,
    'hydra:last': string,
    'hydra:next': string
}

export type HydraCollectionResponseType<T> = {
    '@context': string,
    '@id': string,
    '@type': string,
    'hydra:totalItems': number,
    'hydra:member': T[],
    'hydra:view': HydraCollectionResponseViewType
}

export class HydraCollectionResponse<T> {
    public total: number;
    public data: T[];
    public view: HydraCollectionResponseViewType;

    constructor(total: number, data: T[], view: HydraCollectionResponseViewType) {
        this.total = total;
        this.data = data;
        this.view = view;
    }

    static from<T, U>(hydraCollection: HydraCollectionResponseType<U>, domainMapper: (value: U) => T) {
        return new HydraCollectionResponse(
            hydraCollection['hydra:totalItems'],
            hydraCollection['hydra:member'].map(domainMapper),
            hydraCollection['hydra:view']
        );
    }
}