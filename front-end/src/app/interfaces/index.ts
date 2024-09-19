export interface ICategory {
  href: string;
  label: string;
}

export interface INavigationItem {
  category: ICategory;
  subItems?: ICategory[];
}

export interface IPost {
  slug: string;
  data: {
    title: string;
    category: {
      label: string;
      href: string;
    };
    date: string;
  };
  content: string;
}
