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

export function isRetryableDbError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  const code = typeof error === "object" && error && "code" in error ? String((error as { code?: unknown }).code) : "";
  return (
    msg.includes("server has closed the connection") ||
    msg.includes("connection closed") ||
    msg.includes("can't reach database") ||
    msg.includes("connection terminated") ||
    msg.includes("socket closed") ||
    msg.includes("connection reset") ||
    code === "P1001" ||
    code === "P1017"
  );
}

export async function withDbRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries && isRetryableDbError(error)) {
        console.warn(`[DB RETRY] Attempt ${attempt} failed with retryable error:`, error instanceof Error ? error.message : error);
        await new Promise((r) => setTimeout(r, 600 * attempt));
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}
