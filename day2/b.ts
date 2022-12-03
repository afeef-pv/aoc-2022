import { readFileSync } from "fs";
import { curry, filter, map, pipe, reduce, split, sum} from "ramda";

function logMeBaby(a: any) {
  console.log(a);
}


type Play = 'A X' | 'A Y' | 'A Z' | 'B X' | 'B Y' | 'B Z' | 'C X' | 'C Y' | 'C Z';
type Hand = 'A' | 'B' | 'C';
type ScoreByHand = Record<Hand, number>;

const scoreSheet: ScoreByHand = {
  A: 1,
  B: 2,
  C: 3,
}

function toWin(x: Hand) {
  switch(x) {
    case 'A':
      return 'B';
    case 'B':
      return 'C';
    case 'C':
      return 'A';
  }
}

function toLose(x: Hand) {
  switch(x) {
    case 'A':
      return 'C';
    case 'B':
      return 'A';
    case 'C':
      return 'B';
  }
}
function scoreMeBaby(plays: Play[]) {
  return reduce((result, play) => {
    const [opponent, goal] = split(' ', play);
    let me: Hand;
    if (goal == 'Z') {
      // I should WIN
      me = toWin(opponent as Hand);
      result.push(6 + scoreSheet[me]);
    } else if (goal == 'Y') {
      // I should draw
      result.push(3 + scoreSheet[opponent as Hand]);
    }
    else {
      // Please lose
      me = toLose(opponent as Hand);
      result.push(scoreSheet[me]);
    }
    return result;
  }, Array<number>(), plays);
}

const readMeBaby = () => readFileSync('./input.txt').toString();
const splitMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');
const sumMeBaby = (arr: number[]) => sum(arr);

const solveMeBaby = pipe(
  readMeBaby,
  splitMeBaby,
  filterMeBaby,
  scoreMeBaby,
  sumMeBaby,
  logMeBaby
);

solveMeBaby();

