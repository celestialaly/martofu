export type HydraCollectionResponseType<T> = {
    '@context': string,
    '@id': string,
    '@type': string,
    'hydra:totalItems': number,
    'hydra:member': T[],
}

export class HydraCollectionResponse<T> {
    public total: number;
    public data: T[];

    constructor(total: number, data: T[]) {
        this.total = total;
        this.data = data;
    }

    static from<T, U>(hydraCollection: HydraCollectionResponseType<U>, domainMapper: (value: U) => T) {
        return new HydraCollectionResponse(
            hydraCollection['hydra:totalItems'],
            hydraCollection['hydra:member'].map(domainMapper)
        );
    }
}