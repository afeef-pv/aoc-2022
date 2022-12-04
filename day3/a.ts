import { readFileSync } from "fs";
import { curry, filter, map, pipe, reduce, split, sum } from "ramda";

function readMeBaby () {
  return readFileSync('./input.txt').toString();
}

function splitByHalfBaby (items: string) {
  const middle = items.length / 2;
  return [items.slice(0, middle), items.slice(middle, items.length)];
}

function itemToDicBaby (items: any) {
  return reduce((itemMap, currItem: string) => {
    itemMap.set(currItem, true);
    return itemMap;
  }, new Map<string, boolean>(), items as any);
}

function dicMeBay(sackItems: string[]) {
  return reduce((acc, sack: string) => {
    const dicItMe = pipe(splitByHalfBaby, curry(map)(itemToDicBaby));
    acc.push(dicItMe(sack));
    return acc;
  }, new Array<any>(), sackItems as any);
}

function getCommonBaby(dicArr: any) {
  return reduce((acc: any, currDic: any) => {
    for(const item of currDic[0].keys()) {
      if (currDic[1].has(item)) {
        acc.push(item);
      }
    }
    return acc;
  }, new Array<any>(), dicArr);
}

function numericMeBaby (chars: string[]) {
  return reduce((acc, curr) => {
    if (curr == curr.toLowerCase()){
      acc.push(curr.charCodeAt(0) - 96);
      return acc;
    }
    acc.push(curr.charCodeAt(0) - 38);
    return acc;
  }, new Array<number>(), chars);
}

function sumMeBaby (arr: number[]) {
  return sum(arr);
}

const splitByNewLineBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');
const solveMeBaby = pipe(
  readMeBaby,
  splitByNewLineBaby,
  filterMeBaby,
  dicMeBay,
  getCommonBaby,
  numericMeBaby,
  sumMeBaby,
  console.log
);

solveMeBaby();
