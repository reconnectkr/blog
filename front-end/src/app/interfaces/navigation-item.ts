import { ICategory } from "./category";

export interface INavigationItem {
  category: ICategory;
  subItems?: ICategory[];
}
