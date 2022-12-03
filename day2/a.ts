import { readFileSync } from "fs";
import { curry, filter, map, pipe, reduce, split, sum} from "ramda";

function logMeBaby(a: any) {
  console.log(a);
}


type Play = 'A X' | 'A Y' | 'A Z' | 'B X' | 'B Y' | 'B Z' | 'C X' | 'C Y' | 'C Z';
type Hand = 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z';
type PlayToWin = Record<Play, number>;
type ScoreByHand = Record<Hand, number>;

const scoreSheet: ScoreByHand = {
  A: 1,
  B: 2,
  C: 3,
  X: 1,
  Y: 2,
  Z: 3,
}

const rules: PlayToWin = {
  'A X': 3,
  'A Y': 6,
  'A Z': 0,
  'B X': 0,
  'B Y': 3,
  'B Z': 6,
  'C X': 6,
  'C Y': 0,
  'C Z': 3,
}

function scoreMeBaby(plays: Play[]) {
  return reduce((result, play) => {
    const outcome = rules[play] as number;
    const [_opponent, me] = split(' ', play);
    const score = outcome + (scoreSheet[me as keyof ScoreByHand] as number);
    result.push(score);
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
