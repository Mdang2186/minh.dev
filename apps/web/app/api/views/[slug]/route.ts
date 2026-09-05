import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const viewsFilePath = path.join(process.cwd(), "data", "project-views.json");

function getViewsData(): Record<string, number> {
    try {
        if (!fs.existsSync(viewsFilePath)) {
            return {};
        }
        const data = fs.readFileSync(viewsFilePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading views file:", error);
        return {};
    }
}

function saveViewsData(data: Record<string, number>) {
    try {
        const dir = path.dirname(viewsFilePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(viewsFilePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
        console.error("Error saving views file:", error);
    }
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> | { slug: string } }
) {
    const params = await Promise.resolve(context.params);
    const slug = params.slug;
    const viewsData = getViewsData();
    const currentViews = viewsData[slug] || 0;
    return NextResponse.json({ views: currentViews });
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ slug: string }> | { slug: string } }
) {
    const params = await Promise.resolve(context.params);
    const slug = params.slug;
    const viewsData = getViewsData();
    const currentViews = (viewsData[slug] || 0) + 1;
    viewsData[slug] = currentViews;
    saveViewsData(viewsData);

    return NextResponse.json({ views: currentViews });
}
