import React, { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import videoFile1 from "/public/0207 (3).mp4"; // Original bouncing video
import videoFile2 from "/public/0207 (1).mp4"; // First video after "Yes"
import videoFile3 from "/public/0207 (6).mp4";
import videoFile4 from "/public/sub.mp4"; // Second bouncing video
import backgroundImage from "/public/collage.jpg"; // Path to your background image

const ValentinesProposal = () => {
    const expressions = [
        "BITCHCHH",
        "Pretty please?",
        "Just be a good little chunky 🥺",
        "Don't be like that!",
        "Say try no one more time, then you like young doo",
        "Give it another thought!",
        "You're breaking my heart 💔",
        "But we're perfect together!",
        "Please please please?",
        "I'll buy you chocolate!",
        "But I made this just for you!",
        "You're so mean 🥺",
        "I'll cry...",
        "Just say yes already!",
        "Playing hard to get?",
    ];

    const bouncingVideoRef = useRef(null); // Ref for the first bouncing video
    const bouncingVideoRef2 = useRef(null); // Ref for the second bouncing video
    const videoRef = useRef(null); // Ref for the sequential videos
    const [isMuted, setIsMuted] = useState(true);
    const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
    const [videoPosition, setVideoPosition] = useState({ x: 100, y: 100 }); // First video starts at (100, 100)
    const [videoPosition2, setVideoPosition2] = useState({ x: 1300, y: 300 }); // Second video starts at (300, 300)
    const [showCelebration, setShowCelebration] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentExpression, setCurrentExpression] = useState(expressions[0]);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [direction, setDirection] = useState({ x: 1, y: 1 });
    const [direction2, setDirection2] = useState({ x: 1, y: 1 });
    const [videoIndex, setVideoIndex] = useState(0); // Tracks which video to play (0: none, 1: first video, 2: second video)

    // Autoplay bouncing videos on load
    useEffect(() => {
        if (bouncingVideoRef.current) {
            const video = bouncingVideoRef.current;
            video.muted = true;
            video.play().catch(() => console.log("Autoplay failed, user interaction required"));
        }
        if (bouncingVideoRef2.current) {
            const video = bouncingVideoRef2.current;
            video.muted = true;
            video.play().catch(() => console.log("Autoplay failed, user interaction required"));
        }
    }, []);

    // Move the first bouncing video around the screen
    useEffect(() => {
        const moveVideo = () => {
            if (bouncingVideoRef.current) {
                const container = bouncingVideoRef.current.parentElement;
                const containerRect = container.getBoundingClientRect();
                const videoRect = bouncingVideoRef.current.getBoundingClientRect();

                let newX = videoPosition.x + direction.x * 2;
                let newY = videoPosition.y + direction.y * 2;

                if (newX + videoRect.width > containerRect.width || newX < 0) {
                    setDirection(prev => ({ ...prev, x: -prev.x }));
                }
                if (newY + videoRect.height > containerRect.height || newY < 0) {
                    setDirection(prev => ({ ...prev, y: -prev.y }));
                }

                setVideoPosition({ x: newX, y: newY });
            }
        };

        const interval = setInterval(moveVideo, 16);
        return () => clearInterval(interval);
    }, [videoPosition, direction]);

    // Move the second bouncing video around the screen
    useEffect(() => {
        const moveVideo2 = () => {
            if (bouncingVideoRef2.current) {
                const container = bouncingVideoRef2.current.parentElement;
                const containerRect = container.getBoundingClientRect();
                const videoRect = bouncingVideoRef2.current.getBoundingClientRect();

                let newX = videoPosition2.x + direction2.x * 2;
                let newY = videoPosition2.y + direction2.y * 2;

                if (newX + videoRect.width > containerRect.width || newX < 0) {
                    setDirection2(prev => ({ ...prev, x: -prev.x }));
                }
                if (newY + videoRect.height > containerRect.height || newY < 0) {
                    setDirection2(prev => ({ ...prev, y: -prev.y }));
                }

                setVideoPosition2({ x: newX, y: newY });
            }
        };

        const interval = setInterval(moveVideo2, 16);
        return () => clearInterval(interval);
    }, [videoPosition2, direction2]);

    const moveNoButton = () => {
        setNoButtonPosition({
            x: (Math.random() - 0.5) * 750,
            y: (Math.random() - 0.5) * 600,
        });

        let newExpression;
        do {
            newExpression = expressions[Math.floor(Math.random() * expressions.length)];
        } while (newExpression === currentExpression);

        setCurrentExpression(newExpression);
    };

    const handleYesClick = () => {
        setIsLoading(true);
        setVideoIndex(1); // Start the first video
    };

    const enableSound = () => {
        if (bouncingVideoRef.current) {
            bouncingVideoRef.current.muted = false;
            setIsMuted(false);
        }
        if (bouncingVideoRef2.current) {
            bouncingVideoRef2.current.muted = false;
        }
    };

    // Handle video sequence
    useEffect(() => {
        if (videoIndex > 0) {
            const video = videoRef.current;
            if (video) {
                video.muted = isMuted;
                video.src = videoIndex === 1 ? videoFile2 : videoFile3;
                video.play().catch(() => console.log("Autoplay failed, user interaction required"));
            }
        }
    }, [videoIndex, isMuted]);

    const handleVideoEnd = () => {
        if (videoIndex === 1) {
            setVideoIndex(2); // Play the second video
        } else if (videoIndex === 2) {
            setShowCelebration(true); // Show the celebration screen
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Bouncing Videos (only on Yes/No screen) */}
            {!isLoading && !showCelebration && (
                <div className="absolute inset-0 overflow-hidden">
                    {/* First Bouncing Video */}
                    <video
                        ref={bouncingVideoRef}
                        src={videoFile1}
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                        className="absolute w-64 h-64"
                        style={{
                            top: videoPosition.y,
                            left: videoPosition.x,
                            transition: "top 0.1s linear, left 0.1s linear",
                        }}
                    />
                    {/* Second Bouncing Video */}
                    <video
                        ref={bouncingVideoRef2}
                        src={videoFile4}
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                        className="absolute w-64 h-64"
                        style={{
                            top: videoPosition2.y,
                            left: videoPosition2.x,
                            transition: "top 0.1s linear, left 0.1s linear",
                        }}
                    />
                </div>
            )}

            {/* Sequential Videos (after Yes click) */}
            {isLoading && !showCelebration && (
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted={isMuted}
                        className="h-screen object-cover"
                        style={{
                            width: "auto",
                            left: "50%",
                            transform: "translateX(-50%)",
                        }}
                        onEnded={handleVideoEnd}
                    />
                </div>
            )}

            {/* Unmute Button */}
            {isMuted && (
                <button
                    onClick={enableSound}
                    className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-20"
                >
                    🔊 Enable Sound
                </button>
            )}

            {/* Yes/No Screen */}
            {!isLoading && !showCelebration ? (
                <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-lg relative z-10">
                    <Heart className="mx-auto text-red-500 mb-6" size={64} />
                    <h1 className="text-3xl font-bold text-gray-800 mb-8">
                        Will you be my Valentine? 💝
                    </h1>

                    <div className="space-y-8">
                        <button
                            onClick={handleYesClick}
                            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-xl transition-colors duration-200"
                        >
                            Yes 😊
                        </button>

                        <div className="relative flex justify-center items-center h-16">
                            <p className="absolute text-gray-500 text-lg z-0">
                                {currentExpression}
                            </p>

                            <button
                                onMouseEnter={moveNoButton}
                                style={{
                                    position: "absolute",
                                    transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                                    transition: "transform 0.2s ease-out",
                                    zIndex: 10,
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full text-xl"
                            >
                                No 😢
                            </button>
                        </div>
                    </div>
                </div>
            ) : showCelebration ? (
                <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-lg relative z-10">
                    <h1 className="text-3xl font-bold text-red-500">Yay! 🎉</h1>
                    <p className="text-xl text-gray-700">Dear Lil Chunky,</p>
                    <p className="text-gray-600">
                        Sorry for not asking you sooner, but this website took much longer than expected. 
                        I just wanted to let you know that I love you a hundred million billion! 
                        It's probably very hard to understand from your POV, but everytime you walk into a room my world just lights up.
                        You are so so pretty (James certified) and I am very lucky to be able to call you my girlfriend.
                        I know that sometimes we have our rough patches, but no matter what happens, you will always have a place in my heart.
                        Thanks for being my best friend for the last 2 years.
                    </p>
                    <p className="text-xl text-gray-700">Love,</p>
                    <p className="text-xl text-gray-700">Big Chunky ❤️</p>
                    <Heart className="mx-auto text-red-500" size={48} />
                </div>
            ) : null}
        </div>
    );
};

export default ValentinesProposal;
