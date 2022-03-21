import type { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect';
import Cookies from 'cookies';
import { EncryptJWT, decodeJwt, JWTPayload } from 'jose';


function validateCsrfToken(
  csrf_token_cookie: string | undefined, 
  csrf_token_body: string | undefined,
) {
  if (csrf_token_cookie === undefined) {
    throw Error("No CSRF Token in cookie.");
  }

  if (csrf_token_body === undefined) {
    throw Error("No CSRF Token in body.");
  }

  if (csrf_token_cookie !== csrf_token_body) {
    throw Error('Failed to verify double submit cookie.')
  }
}

function validateJwt(payload: JWTPayload) {
  if (payload.aud !== process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    throw Error('Unexpected audience.')
  }

  if (['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss || '')) {
    throw Error('Unexpected issuer.')
  }
}

const handler = nc({
  onError: (err, _req, res: NextApiResponse) => {
    res.status(500).json({ message: err.toString() });
  },
  onNoMatch: (_req, res) => {
    res.status(405).json({ message: "not found" });
  },
}).post(async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = new Cookies(req, res, { keys: [process.env.COOKIE_KEY || ''] });

  validateCsrfToken(cookies.get("g_csrc_token"), req.body.g_csrc_token);

  const claims = decodeJwt(req.body.credential);

  validateJwt(claims)

  const jwe = await new EncryptJWT(claims)
    .encrypt(new TextEncoder().encode(process.env.JWE_PUBLIC_KEY || ''))

  cookies.set('jwe', jwe, { signed: true, httpOnly: true, sameSite: 'lax' })

})

export default handler;
