import { useEffect, useState } from "react";

export const LoadingScreen = ({ onComplete }) => {
    const [text, setText] = useState("");
    const fullText = "<Hello World!/>";

    useEffect(() => {
        // Capture the current scroll position
        const scrollY = window.scrollY;

        // Disable scrolling
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.substring(0, index));
            index++;

            if (index > fullText.length) {
                clearInterval(interval);
                setTimeout(() => {
                    // Re-enable scrolling
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    window.scrollTo(0, scrollY);
                    onComplete();
                }, 2000);
            }
        }, 100);

        // Cleanup function to re-enable scrolling if the component unmounts
        return () => {
            clearInterval(interval);
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 bg-black text-gray-100 flex justify-center items-center">
            <div className="text-center">
                <div className="mb-4 text-4xl font-mono font-bold">
                    {text}<span className="animate-blink ml-1">|</span>
                </div>
                <div className="w-[300px] h-[2px] bg-gray-100 rounded relative overflow-hidden m-auto">
                    <div className="w-[40%] h-full bg-blue-500 shadow-[0_0_15px_#3b82f3] animate-loading-bar"></div>
                </div>
            </div>
        </div>
    );
};
