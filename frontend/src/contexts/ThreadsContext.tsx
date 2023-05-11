import {createContext, ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {ThreadT} from "@/schemas/thread";
import {getFirestore, query, collection, where, orderBy, doc, getDoc} from "firebase/firestore";
import {useUser} from "@/contexts/UserContext";
import {useCollection} from "react-firebase-hooks/firestore";
import {WithId} from "@/schemas/types";
import {Alert} from "@/contexts/AlertsContext";
import {LangConfigType} from "@/schemas/config";
import {ProfileType} from "@/schemas/profile";

interface Member {
    config: LangConfigType,
    profile: ProfileType
}

export type LoadedThread = ThreadT & {
    membersMap: { [key: string]: Member | null }
}

const ThreadsContext = createContext<{
    threads: WithId<LoadedThread>[],
    loading: boolean
}>(undefined!);

export function ThreadsProvider({children}: { children?: ReactNode }) {
    const {user} = useUser();

    // members cache
    const [allMembers, setAllMembers] = useState<{ [key: string]: Member | null }>({});

    const q = query(
        collection(getFirestore(), "threads"),
        where("members", "array-contains", user?.uid || "undefined")
    );
    const [snap, loading, err] = useCollection(q);

    const loadUsers = async (ids: string[]) => {
        let promises: Promise<Member | null>[] = [];

        for (let userId of ids) {
            const getUser = async () => {
                const configRef = doc(getFirestore(), `configs/${userId}`);
                const configDoc = await getDoc(configRef);

                if (!configDoc.exists()) return null;

                const profileRef = doc(getFirestore(), `profiles/${userId}`);
                const profileDoc = await getDoc(profileRef);

                return profileDoc.exists() ? {
                        profile: profileDoc.data() as ProfileType,
                        config: configDoc.data() as LangConfigType
                    } : null;
            }

            promises.push(getUser())
        }

        let usersList = await Promise.all(promises);
        setAllMembers(state => {
            let newState = {...state};

            usersList.forEach((user, idx) => {
                let userId = ids[idx];
                newState[userId] = user;
            });

            return newState
        })
    }

    let threads: WithId<LoadedThread>[] = useMemo(() => {
        if (!snap) return [];

        // members to be loaded
        let missingMembers: string[] = [];

        let threads = snap.docs.map(doc => {
            let thread = doc.data() as ThreadT

            let membersById: { [key: string]: Member | null } = {};

            for (let memberId of thread.members) {
                if (allMembers[memberId] === undefined) {
                    missingMembers.push(memberId);
                    membersById[memberId] = null;
                } else {
                    membersById[memberId] = allMembers[memberId]
                }
            }

            return {
                id: doc.id,
                ...thread,
                membersMap: membersById
            }
        })

        const getThreadTS = (t: WithId<ThreadT>) => t.lastMessage?.createdAt.toDate() || t.createdAt.toDate();
        threads.sort((a, b) => {
            return getThreadTS(b).valueOf() - getThreadTS(a).valueOf()
        });

        if (missingMembers.length > 0) loadUsers(missingMembers).then();

        return threads;
    }, [snap, loading, err, allMembers]);

    return <ThreadsContext.Provider value={{threads, loading}}>
        {children}

        {err ? <Alert err canClose={false}>
            {err.message}
        </Alert> : null}
    </ThreadsContext.Provider>
}

export const useThreads = () => useContext(ThreadsContext);