import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import Cookies from 'cookies';
import { EncryptJWT, decodeJwt } from 'jose';

const handler = nc({
  onError: (err, _req, res: NextApiResponse) => {
    res.status(500).json({ message: err.toString() });
  },
  onNoMatch: (_req, res) => {
    res.status(405).json({ message: "not found" });
  },
}).post(async (req: NextApiRequest, res: NextApiResponse) => {
  const claims = decodeJwt(req.body.credentials);

  const jwe = await new EncryptJWT(claims)
    .encrypt(new TextEncoder().encode(process.env.JWE_PUBLIC_KEY || ''))

  new Cookies(req, res, { keys: [process.env.COOKIE_KEY || ''] })
    .set('jwe', jwe, { signed: true, httpOnly: true, sameSite: 'lax' })

})

export default handler;
