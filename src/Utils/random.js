export const random = () =>
  crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
