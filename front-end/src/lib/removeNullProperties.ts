import { IUser } from "@/app/interfaces";

export function removeNullProperties(user: IUser | null): Partial<IUser> {
  if (!user) return {};

  const input: Partial<IUser> = {};

  for (const [key, value] of Object.entries(user)) {
    if (value !== null) {
      input[key as keyof IUser] = value;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...result } = input;

  return result;
}
