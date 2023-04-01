import {useState} from "react";

export type HookSet<T> = {
    add: (v: T) => void,
    del: (v: T) => boolean,
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
        add, del, has,
        size: state.size,
        values: state.values
    }
}

// map

type Dict<T> = {[key: string]: T};
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

    return [state, setKey, deleteKey];
}