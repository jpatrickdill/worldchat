import {ReactNode, useEffect, useMemo, useState} from "react";
import clsx from "clsx";
import {useDocumentData} from "react-firebase-hooks/firestore";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {profileSchema, ProfileType} from "@/schemas/profile";

export default function ProfilePic({userId, imageId, size=32, fallbackCls, className}: {
    userId?: string | null, imageId?: string | null, size?: number, fallbackCls?: string, className?: string
}) {
    const [resolvedImageId, setResolvedImageId] = useState<string | null | undefined>(imageId);
    const [displayName, setDisplayName] = useState<string>()

    useEffect(() => {
        if (!imageId) {
            if (!userId) return;

            const profileRef = doc(getFirestore(), `profiles/${userId}`);
            getDoc(profileRef)
                .then(snap => {
                    if (!snap.exists()) {
                        console.warn("ProfilePic user is nonexistent");
                    } else {
                        const profile = snap.data() as ProfileType;
                        setDisplayName(profile.displayName);

                        if (profile.profileImageId) {
                            setResolvedImageId(profile.profileImageId);
                        }
                    }
                });
        }
    });

    const initials = useMemo(() => {
        if (!displayName) return "";

        return displayName.split(" ").map(s => s.charAt(0).toUpperCase()).join();
    }, [displayName]);

    return <div
        style={{width: size, height: size}}
        className={clsx(
            "flex-none rounded-full overflow-hidden",
            "rounded-full overflow-hidden bg-gray-400/50",
            "flex items-center justify-center",
            fallbackCls,
            className
        )}
    >
        <span className="text-white font-bold" style={{
            fontSize: size/2.2
        }}>
            {initials}
        </span>
    </div>
}