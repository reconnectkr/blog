import { ICategory } from "./category";

export interface IPost {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  categories: ICategory[];
}
