import jwt from 'jsonwebtoken';

type Payload = Record<string, any>;

const secret = process.env.JWT_SECRET;

console.log({ secret });

if (secret === undefined) {
  throw new Error('Please provide "JWT_SECRET" as environment variable');
}

const generate = (payload: Payload) =>
  jwt.sign(payload, secret, { expiresIn: '1y' });

const verify = (token: string) => jwt.verify(token, secret) as Payload;

export default { generate, verify };
