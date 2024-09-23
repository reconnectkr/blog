export interface IPost {
  id: number;
  slug: string;
  title: string;
  category: {
    label: string;
    href: string;
  };
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  readingTime?: number;
}
