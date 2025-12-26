"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLocationArrow } from "react-icons/fa6";

export interface ProductCardProps {
    id: number;
    title: string;
    des: string;
    img: string;
    iconLists: string[];
    link: string;
}

export const ProductCard = ({
    id,
    title,
    des,
    img,
    iconLists,
    link,
}: ProductCardProps) => {
    return (
        <Link href={link} className="group flex flex-col space-y-3">
            {/* Image Container */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md border border-border bg-muted">
                <Image
                    src={img}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Content info */}
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground group-hover:underline decoration-1 underline-offset-4">
                        {title}
                    </h3>
                    {/* Tech Stack Icons (Optional: Mini) */}
                    <div className="flex items-center -space-x-1">
                        {iconLists.slice(0, 3).map((icon, index) => (
                            <div
                                key={index}
                                className="relative h-6 w-6 overflow-hidden rounded-full border border-background bg-muted ring-2 ring-background"
                            >
                                <img src={icon} alt="tech" className="h-full w-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>

                <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                    {des}
                </p>
            </div>
        </Link>
    );
};
