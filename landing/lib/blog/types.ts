/** A blog post, already cleaned up and ready to render. */
export interface BlogPost {
  /** The Firestore document ID. Old links used this in the URL. */
  id: string;
  /** The human-readable part of the URL, e.g. "how-to-inspect-an-excavator". */
  slug: string;
  title: string;
  /** The article body, as HTML produced by the admin editor. */
  content: string;
  /** The 1–2 sentence summary Google shows under the blue link. */
  excerpt: string;
  imageUrl?: string;
  author?: string;
  categoryName: string;
  /** URL-safe version of the category, e.g. "heavy-equipment". */
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
}
