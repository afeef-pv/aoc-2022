import { readFileSync } from "fs";
import { camelCase, sum, toNumber, trim } from "lodash";
import { curry, split, pipe, filter, reduce, map } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const splitMeBaby = curry(split)('');
const lineMeBaby = curry(split)('\n');
const groupMeBaby = curry(split)('\n\n');
const filterMeBaby = curry(filter)((e: any) => e != '');

function parse(monkeyOps: string[]) {
  const objectify = (str: string) => {
    const splitted = lineMeBaby(str).map(s => trim(s));
    const obj: any  = {};
    obj[camelCase(splitted[0])] = {
      startingItems: splitted[1].split(':')[1].split(',').map(e => toNumber(e)),
      operations: splitted[2].split('=')[1].split(' '),
      test: `

      `,
    }
    return obj;
  } 
  return monkeyOps.map(m => objectify(m));
}

const solveMeBaby = pipe(
  readMeBaby,
  groupMeBaby,
  parse,
  JSON.stringify,
  console.log
);

solveMeBaby();
