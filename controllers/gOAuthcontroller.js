import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client();

export async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "387776780566-15h89a7jmgfnkdcjhujlvro38fefa1uk.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  return payload
}