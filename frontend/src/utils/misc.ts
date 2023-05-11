import {LoadedThread} from "@/contexts/ThreadsContext";
import {LangConfigType} from "@/schemas/config";

export const capitalize = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);

type WithId<T> = T & { id: string };


export const getMembersList = (t: LoadedThread, exclude?: (string | undefined)[], max?: number) =>
    Object.entries(t.membersMap)
        .filter(([id, member]) => !!member && !exclude?.includes(id))
        .map(([, member]) => member?.profile?.displayName || "?")
        .slice(0, max)
        .join(", ");

export const limitLength = (str: string | null | undefined, len: number) => {
    if (!str) return str;

    if (str.length > len) {
        return str.slice(0, len-3) + "...";
    }

    return str;
}