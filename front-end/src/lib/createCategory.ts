import { ICategory } from "@/app/interfaces";
import { romanize } from "es-hangul";

export function romanizeCategory(category: string): string {
  return romanize(category);
}

export function createCategory(input: string): ICategory {
  return { href: romanize(input), label: input };
}
