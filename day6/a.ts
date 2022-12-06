import { readFileSync } from "fs";
import { curry, map, pipe, split } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const splitMeBaby = curry(split)('');
const lineMeBaby = curry(split)('\n');

function checkUniq(...a: string[]) {
  const dic = new Map<string, boolean>();
  for(let i of a) {
    if (dic.has(i)) {
      return false;
    }
    dic.set(i, true);
  }
  return true;
}

function getTheHeader(packet: string) {
  const windowSize = 14;
  for(let i = 0; i < packet.length - windowSize; ++i) {
    if (checkUniq(...(packet.slice(i, i + windowSize)))) {
      return i + windowSize;
    }
  }
}

const solveMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  map(getTheHeader),
  console.log
);

solveMeBaby();
