import { readFileSync } from "fs";
import { flatMap, toInteger } from "lodash";
import { curry, split, filter, map, pipe } from "ramda";

function readMeBaby () {
  return readFileSync('./input.txt').toString();
} function isOverlaping(str: string) { const splitByComma = curry(split)(','); const splitByDash = map(curry(split)('-'));
  const toNumber = map(toInteger);
  const [a, b, c, d] = pipe(splitByComma, splitByDash, flatMap, toNumber)(str);
  return (a >= c && a <= d) || (c >= a && c <= b) || 
    (d >= a && d <= b) || (b >= c && b <= d)
}

const splitByNewLineBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');
const filterOutFlase = curry(filter)((e: any) => !!e);
const countMeBaby = (arr: any[]) => arr.length;

const solveMeBaby = pipe(
  readMeBaby,
  splitByNewLineBaby,
  filterMeBaby,
  map(isOverlaping),
  filterOutFlase,
  countMeBaby,
  console.log);
solveMeBaby();

