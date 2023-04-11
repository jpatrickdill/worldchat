import {ThreadWithMembers} from "@/contexts/ThreadsContext";
import {ChatConfigType} from "@/schemas/config";

export const capitalize = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);

type WithId<T> = T & { id: string };


export const getMembersList = (t: ThreadWithMembers, exclude?: (string | undefined)[], max?: number) =>
    Object.entries(t.membersMap)
        .filter(([id, member]) => !!member && !exclude?.includes(id))
        .map(([, member]) => (member as ChatConfigType).displayName || "?")
        .slice(0, max)
        .join(", ")