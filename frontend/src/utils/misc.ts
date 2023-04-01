export const capitalize = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);

type WithId<T> = T & {id: string};

export const objectValuesWithIds = <T>(o: { [key: string]: T }) => {
    let vals: WithId<T>[] = [];

    for (const [id, val] of Object.entries(o)) {
        vals.push({
            ...val,
            id
        })
    }

    return vals;
}
