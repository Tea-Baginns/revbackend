import * as argon2 from "argon2";

const generate = (password: string) =>
  argon2.hash(password, { hashLength: 10 });

const compare = (password: string, hash: string) =>
  argon2.verify(password, hash);

export default { generate, compare };
