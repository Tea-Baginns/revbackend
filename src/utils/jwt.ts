import jwt from "jsonwebtoken";

interface Payload {
  [key: string]: any;
}

const secret = process.env.JWTSECRET;

if (!secret) {
  throw new Error(`Please provide "JWT_SECRET" as environment variable`);
}

const generate = (payload: Payload) => {
  return jwt.sign(payload, secret, { expiresIn: "1y" });
};

const verify = (token: string) => {
  return jwt.verify(token, secret) as Payload;
};

export default { generate, verify };
