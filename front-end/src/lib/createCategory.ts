import { ICategory } from "@/app/interfaces";
import { romanize } from "es-hangul";

export default function createCategory(input: string): ICategory {
  return { href: input, label: romanize(input) };
}
