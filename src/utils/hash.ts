import * as argon2 from 'argon2';

const generate = async (password: string) =>
  await argon2.hash(password, { hashLength: 10 });

const compare = async (password: string, hash: string) =>
  await argon2.verify(hash, password);

export default { generate, compare };
