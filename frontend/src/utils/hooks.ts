import {useCallback, useMemo, useState} from "react";
import {MessageT} from "@/schemas/message";
import {langCompare} from "@/utils/misc";
import {useUser} from "@/contexts/UserContext";

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

// state history hook

export const useStateHistory = <T>(value: T, limit = 1) => {
    const [history, setHistory] = useState(() => {
        let initial = [value];
        for (let i=0; i<limit; i++) initial.push(value);

        return initial
    });

    if (value !== history[0]) {
        setHistory(oldState => {
            let newState = [
                value,
                ...oldState
            ];

            if (newState.length > limit + 1) newState.splice(limit + 1);

            return newState;
        })
    }

    return history.slice(1);
}

export default useMap;

export const useClosestTranslation = (message?: MessageT) => {
    const {langConfig} = useUser();

    return useMemo(() => {
        if (!langConfig?.language) return;

        let myLang = langConfig.language;
        let translations = [...(message?.translations || [])];

        translations.sort((a, b) => {
            return langCompare(myLang, a.language) - langCompare(myLang, b.language);
        });

        let closest = translations.at(0);


        if (!closest) return;
        if (langCompare(myLang, closest.language) === 4) return;

        return closest;
    }, [message?.translations, langConfig?.language?.code, langConfig?.language?.region]);
}
