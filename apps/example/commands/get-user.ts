export type User = {
  email: string
}

export default async function getUser(): Promise<User> {
  const response = await fetch("/api/getUser");

  if (!response.ok) {
    throw Error(await response.text())
  }

  return response.json();
}
