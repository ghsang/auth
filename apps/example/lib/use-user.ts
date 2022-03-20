import { useEffect, useState } from "react";
import getUser from "@commands/get-user";
import {useRouter} from "next/router";

type User = {
	email: string;
}

export default function useUser() {
  const [user, setUser] = useState<User>();

  const router = useRouter();

  useEffect(() => {
    (
      async () => {
        try {
          setUser(await getUser())
        } catch(err) {
          console.log(err);
          router.push("/login");
        }
      }
    )();
  })

  return { user }
}
