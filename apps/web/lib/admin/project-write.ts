import { jsonError } from "./api";

type ProjectImageInput = {
  imageUrl: string;
  altText?: string | null;
  folder?: string | null;
  sortOrder: number;
};

export function buildProjectImageCreates(images: ProjectImageInput[]) {
  return images.map((image) => ({
    imageUrl: image.imageUrl.trim(),
    altText: image.altText?.trim() || null,
    folder: image.folder?.trim() || "",
    sortOrder: image.sortOrder,
  }));
}

export function buildProjectTechStackCreates(names: string[]) {
  return Array.from(new Set(names.map((name) => name.trim()).filter(Boolean))).map((name) => ({
    techStack: {
      connectOrCreate: {
        where: { name },
        create: { name },
      },
    },
  }));
}

export function projectWriteErrorResponse(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? (error as { code?: unknown }).code : null;
  if (code === "P2002" || (error instanceof Error && error.message.includes("Unique constraint"))) {
    return jsonError("Slug đã tồn tại.", 409);
  }

  return null;
}
