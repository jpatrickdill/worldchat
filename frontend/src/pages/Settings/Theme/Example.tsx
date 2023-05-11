export default function Example() {
    return <div className="flex-grow overflow-y-scroll overflow-x-hidden flex flex-col gap-y-2 py-2 bg-background">
        <div className="flex gap-2 relative w-full">
            <div className="flex-grow flex flex-col w-full">
                <div className="px-3 py-1">
                    <div className="flex items-center justify-between flex-row-reverse">
                        <div
                            className="px-3 py-1 rounded-xl flex justify-center items-center max-w-sm bg-primary text-copy-white">
                            <div className="flex flex-col">
                                <div className="break-words"><p>hello!</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex gap-2 relative w-full">
            <div className="flex-grow flex flex-col w-full">
                <div className="flex gap-x-2 items-center text-copy-gray select-none px-3 py-1">
                    <div
                        className="text-copy-dark font-semibold hover:underline"
                    >Friend
                    </div>
                    <span>·</span><span>May 01, 3:03 PM</span></div>
                <div className="px-3 py-1">
                    <div className="flex items-center justify-between">
                        <div
                            className="px-3 py-1 rounded-xl flex justify-center items-center max-w-sm bg-background-accent text-copy-dark border border-background-accent-darker">
                            <div className="flex flex-col">
                                <div className="break-words"><p>hello. How are you?</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}