import { random } from "./random";

export default function ({ count, die, exploding }) {
  let remaining = count;
  if (remaining <= 0) {
    return [];
  }

  const rolls = [];
  while (remaining) {
    remaining--;
    const result = Math.floor(random() * die) + 1;
    if (exploding && result === die) {
      remaining++;
    }
    rolls.push(result);
  }
}
