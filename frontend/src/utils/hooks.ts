import {useCallback, useState} from "react";

export type HookSet<T> = {
    add: (v: T) => void,
    delete: (v: T) => boolean,
    has: (v: T) => boolean,
    values: () => Iterable<T>,
    size: number
}

export const useSet = <T>(): HookSet<T> => {
    const [state, setState] = useState(() => new Set<T>());

    const add = (v: T) => {
        setState(
            (state) => new Set(state).add(v)
        );
    }

    const del = (v: T) => {
        setState(state => {
            let newState = new Set(state);
            newState.delete(v);

            return newState
        })

        return state.has(v);
    }

    const has = (v: T) => {
        return state.has(v);
    }


    return {
        add, delete: del, has,
        size: state.size,
        values: state.values
    }
}

// map

type Dict<T> = { [key: string]: T };
export type UseDictT<T> = [
    Dict<T>, (key: string, val: T) => void, (key: string) => void
];
export const useDict = <T>(defaultValue?: Dict<T> | (() => Dict<T>)): UseDictT<T> => {
    const [state, setState] = useState(defaultValue ?? {});

    const setKey = (key: string, value: T) => {
        setState(oldState => {
            return {
                ...oldState,
                [key]: value
            }
        });
    }

    const deleteKey = (key: string) => {
        setState(oldState => {
            let newState = {...oldState};
            delete newState[key];
            return newState;
        });
    }

    return [{...state}, setKey, deleteKey];
}

// map hook

export type MapOrEntries<K, V> = Map<K, V> | [K, V][]

// Public interface
export interface Actions<K, V> {
    set: (key: K, value: V) => void
    setAll: (entries: MapOrEntries<K, V>) => void
    delete: (key: K) => void
    reset: Map<K, V>['clear']
}

// We hide some setters from the returned map to disable autocompletion
type Return<K, V> = [Omit<Map<K, V>, 'set' | 'clear' | 'delete'>, Actions<K, V>]

export function useMap<K, V>(
    initialState: MapOrEntries<K, V> = new Map(),
): Return<K, V> {
    const [map, setMap] = useState(new Map(initialState))

    const actions: Actions<K, V> = {
        set: useCallback((key, value) => {
            setMap(prev => {
                const copy = new Map(prev)
                copy.set(key, value)
                return copy
            })
        }, []),

        setAll: useCallback(entries => {
            setMap(() => new Map(entries))
        }, []),

        delete: useCallback(key => {
            setMap(prev => {
                const copy = new Map(prev)
                copy.delete(key)
                return copy
            })
        }, []),

        reset: useCallback(() => {
            setMap(() => new Map())
        }, []),
    }

    return [map, actions]
}

export default useMap
