import { readFileSync } from "fs";
import { curry, map, pipe, reduce, sort, split, sum} from "ramda";

function log(a: any) {
  console.log(a);
}

function foodByElf(foods: string[]) {
  const isEmptyString = (e: string) => e == '';
  return reduce((result, currFood) => {
    if (isEmptyString(currFood)) {
      result.push(new Array<number>());
      return result;
    }
    const top = result[result.length - 1];
    top.push(+currFood);
    return result;
  }, [new Array<number>()], foods);
}

function aggregateCaloris(calories: Array<Array<number>>): number[] {
  return map(c => sum(c), calories);
}

function myMax(numbers: number[]) {
  return Math.max(...numbers);
}

function max3Sum(arr: number[]): number {
  return arr[0] + arr[1] + arr[2];
}

const input = readFileSync('./input.txt').toString();

const splitByNewLine = curry(split)('\n')
const solveMeBaby = pipe(
  splitByNewLine,
  foodByElf,
  aggregateCaloris,
  sort((a, b) => b - a),
  max3Sum,
  log
);

solveMeBaby(input);
