import {LoadedThread} from "@/contexts/ThreadsContext";
import {LangConfigType} from "@/schemas/config";
import {LanguageType} from "@/schemas/langauge";

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

// lang sorting

// language sort key function for finding closest translation
// 0 = exact match
// 2 = language matches but not region
// 4 = no match
export const langCompare = (a: LanguageType, b: LanguageType) => {
    if (a.code !== b.code && a.name.toLowerCase() !== b.code.toLowerCase()) return 4;

    return ((a.region || "").toLowerCase() === (b.region || "").toLowerCase()) ? 0 : 2
}