export interface IPost {
  id: number;
  slug: string;
  title: string;
  categories: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  readingTime?: number;
}
