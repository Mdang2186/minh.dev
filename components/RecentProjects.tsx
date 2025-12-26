"use client";

import { projects } from "../data";
import { ProductCard } from "./ui/product-card";

const RecentProjects = () => {
    return (
        <div className="py-20" id="projects">
            <div className="mb-10 text-center">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                    Collection 2024
                </h2>
                <h1 className="heading mt-2">
                    Curated <span className="text-purple">Projects</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-12 px-4 md:px-10">
                {projects.map((item) => (
                    <ProductCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        des={item.des}
                        img={item.img}
                        iconLists={item.iconLists}
                        link={item.link}
                    />
                ))}
            </div>

            <div className="mt-16 flex justify-center">
                <a
                    href="https://github.com/docongminh"
                    target="_blank"
                    className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                    View All Collections
                </a>
            </div>
        </div>
    );
};

export default RecentProjects;
