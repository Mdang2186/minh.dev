import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import RecentProjects from "@/components/RecentProjects";
import Experience from "@/components/Experience"; // Bạn cần tạo file này dựa trên code bước trước
import { Footer } from "@/components/layout/footer";

export default function Home() {
    return (
        <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-clip mx-auto sm:px-10 px-5">
            <div className="max-w-7xl w-full">
                <Hero />
                <Grid />
                <RecentProjects />
                <Experience />
                <Footer />
            </div>
        </main>
    );
}