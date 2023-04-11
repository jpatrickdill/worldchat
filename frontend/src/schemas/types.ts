export interface Dialect {
    language: string,
    region: string
}

export type WithId<T> = T & {id: string}