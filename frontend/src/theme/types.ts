export interface Colors {
    [key: string]: string | Colors
}

export interface Theme {
    name: string,
    order: number,
    colors: Colors
}