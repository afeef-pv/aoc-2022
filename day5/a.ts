import { readFileSync } from "fs";
import { reverse, some, zip } from "lodash";
import { curry, filter, length, map, pipe, reduce, replace, split } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const splitMeBaby = curry(split)('');
const lineMeBaby = curry(split)('\n');

function getStacksAndOps(str: string[]) {
  const replaceItBitch = curry(replace)(/\[|\]/g)(' ');
  let isShip = true;

  const [ship, ops] = reduce((acc, curr) => {
    if(curr == '') {
      isShip = false;
      return acc;
    }
    if(isShip) {
      acc[0].push(pipe(replaceItBitch, splitMeBaby)(curr))
      return acc;
    }
    acc[1].push(curr)
    return acc;
  }, [new Array<any>(), new Array<any>()], str);
  const isEmptyStack = (e: any[]) => some(e, i => i != ' ');
  const stacks = map((e: any[]) => {
    e.pop();
    e = e.filter((i: string) => i != ' ');
    return reverse(e);
  }, filter(isEmptyStack, zip(...ship)));
  return [stacks as [string[]], ops as string[]];
}

function rearrange(count: number, from: number, to: number, stacks: [string[]]) {
  const fromStack = stacks[from - 1];
  const toStack = stacks[to - 1];
  const tempStack: string[] = [];
  for(let i = 0; i < count; ++i) {
    tempStack.push(fromStack.pop()!);
  }
  toStack.push(...tempStack as string[]);
  return stacks;
}

function getCountFromTo(str: string) {
  const splittedAction = split(' ', str);
  return [+splittedAction[1], +splittedAction[3], +splittedAction[5]]
}

function moveItBaby(shipAndOps: any) {
  return reduce((acc, curr) => {
    const [count, from, to] = getCountFromTo(curr as string);
    const rearrangedShip =  rearrange(count, from, to, acc);
    return rearrangedShip;
  }, shipAndOps[0], shipAndOps[1]);
}

function getTopBaby(stacks: [string[]]) {
  return reduce((acc, curr) => {
    acc += curr.pop();
    return acc;
  }, '', stacks);
}

const solveMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  getStacksAndOps,
  moveItBaby,
  getTopBaby,
  console.log
);

solveMeBaby();
