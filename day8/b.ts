import { readFileSync } from "fs";
import { max } from "lodash";
import { curry, split, pipe, filter } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const splitMeBaby = curry(split)('');
const lineMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');

function amIVisible(trees: [number[]], i: number, j: number) {
  // go left
  let leftCount = 0;
  for(let left = j + 1; left < trees[0].length; ++left) {
    if (trees[i][left] >= trees[i][j]) {
      ++leftCount;
      break;
    }
    ++leftCount;
  }
  let rightCount = 0;
  for(let right = j - 1; right >= 0; --right) {
    if (trees[i][right] >= trees[i][j]) {
      ++rightCount;
      break;
    }
    ++rightCount;
  }
  let topCount = 0;
  for(let top = i - 1; top >= 0; --top) {
    if (trees[top][j] >= trees[i][j]) {
      ++topCount;
      break;
    }
    ++topCount;
  }
  let bottomCount = 0;
  for(let bottom = i + 1; bottom < trees.length; ++bottom) {
    if (trees[bottom][j] >= trees[i][j]) {
      ++bottomCount;
      break;
    }
    ++bottomCount;
  }
  return (leftCount || 1) * (bottomCount || 1) * (rightCount || 1) * (topCount || 1);
}

function getVisilbe(trees: any) {
  let count: number[] = [];
  for (let i = 1; i < trees.length - 1; ++i) {
    for (let j = 1; j < trees[0].length - 1; ++j) {
      if (amIVisible(trees, i, j)) {
        count.push(amIVisible(trees, i, j));
      }
    }
  }
  return max(count);
}

function tableMeBaby(arr: string[]) {
  return arr.reduce((acc, curr) => {
    acc.push(curr.split('').map(e => +e));
    return acc;
  }, new Array<number[]>());
}

const solveMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  filterMeBaby,
  tableMeBaby,
  getVisilbe,
  console.log
);

solveMeBaby();

