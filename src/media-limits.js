// Base64 expands uploads by a third. This keeps JSON requests under Vercel's 4.5 MB limit.
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
