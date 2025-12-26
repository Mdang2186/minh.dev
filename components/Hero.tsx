import React from "react";
import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "@/components/ui/MagicButton"; // Đảm bảo đường dẫn đúng
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect"; // Đảm bảo đường dẫn đúng
import { Spotlight } from "@/components/ui/Spotlight"; // Nếu bạn có Spotlight

const Hero = () => {
    return (
        <div className="pb-20 pt-36">
            {/* 1. Spotlight Effect */}
            <div>
                <Spotlight className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
                <Spotlight className="top-10 left-full h-[80vh] w-[50vw]" fill="purple" />
                <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
            </div>

            {/* 2. Grid Background */}
            <div className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black/[0.2] absolute top-0 left-0 flex items-center justify-center">
                {/* Radial gradient mask */}
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
            </div>

            {/* 3. Content */}
            <div className="flex justify-center relative my-20 z-10">
                <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
                    <p className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
                        Dynamic Web Portfolio
                    </p>

                    <TextGenerateEffect
                        className="text-center text-[40px] md:text-5xl lg:text-6xl"
                        words="Biến ý tưởng thành hiện thực với Trải nghiệm mượt mà"
                    />

                    <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl text-white-200">
                        Chào bạn, tôi là Đỗ Công Minh, một Lập trình viên Next.js.
                    </p>

                    <a href="#projects">
                        <MagicButton
                            title="Xem dự án của tôi"
                            icon={<FaLocationArrow />}
                            position="right"
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Hero;