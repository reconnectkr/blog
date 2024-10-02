export interface INavigationItem {
  href: string;
  label: string;
  subItems?: INavigationItem[];
}
