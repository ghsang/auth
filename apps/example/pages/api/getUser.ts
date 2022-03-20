// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies';
import { jwtDecrypt, JWTPayload } from 'jose';
import nc from 'next-connect';
import { User } from 'commands/get-user';

type Error = {
  message: string
}

async function getUser(_payload: JWTPayload) {
  return ({ email: "test@example.com" })
}

const handler = nc({
  onError: (err, _req, res: NextApiResponse) => {
    res.status(500).json({ message: err.toString() });
  },
  onNoMatch: (_req, res) => {
    res.status(405).json({ message: "not found" });
  },
}).get(async (req: NextApiRequest, res: NextApiResponse<User | Error>) => {
  const cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEY || ''] });

  const jwe = cookies.get('jwe', { signed: true });

  if (jwe === undefined) {
    throw Error("jwe not found");
  }

  const { payload } = await jwtDecrypt(
    jwe, 
    new TextEncoder().encode(process.env.JWE_PRIVATE_KEY || '')
  );

  res.status(200).json(await getUser(payload))
})

export default handler;
