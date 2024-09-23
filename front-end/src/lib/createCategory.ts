import { romanize } from "es-hangul";

export default function convertToRomanized(input: string): string {
  return romanize(input);
}
