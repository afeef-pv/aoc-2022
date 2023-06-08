import { sum } from "lodash";
import { readFileSync } from "fs";
import { curry, split, pipe, filter, reduce } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const splitMeBaby = curry(split)('');
const lineMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');

function check(cycle: number, x: number) {
  for(let i = 20; i <= 220; i += 40) {
    if (cycle == i) {
      return cycle * x;
    }
  }
  return;
}

function compute(ins: string[]) {
  let x = 1;
  let cycles = 0;
  return reduce((acc, curr) => {
    if(curr == 'noop') {
      cycles++;
      acc.push(check(cycles, x));
    } else {
      const [_, val] = curr.split(' ');
      cycles++;
      // check
      acc.push(check(cycles, x));
      cycles++;
      //check
      acc.push(check(cycles, x));
      x += +val;
    }
    return acc;
  }, new Array<number | undefined>(), ins);
}

const solveMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  filterMeBaby,
  compute,
  curry(filter)((e: any) => !!e),
  sum,
  console.log
);

solveMeBaby();
