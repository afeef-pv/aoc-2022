import { readFileSync } from "fs";
import { min } from "lodash";
import { curry, split, pipe, filter, reduce } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const splitMeBaby = curry(split)('');
const lineMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');

function parseToGameBoard(moves: string[]) {
  const board: number[][] = [];
  for(const move of moves) {
    board.push(move.split('').map(e => {
      if (e == 'S') {
        return 0;
      } else if(e == 'E'){
        return -1;
      }
      const val = e.charCodeAt(0) - 96;
      return val;
    }))
  }
  return board;
}


function play(board: number[][], i: number, j: number, dist: number = 0): number {
  console.log(i, j, dist);
  if (i >= board.length || j >= board[0].length || i < 0 || j < 0 || board[i][j] == -1) {
    return dist;
  }

  const left = j > 0 && (Math.abs(board[i][j] - board[i][j - 1]) < 2
      || board[i][j - 1] == -1 || board[i][j - 1] != 0) ? play(board, i, j - 1, dist + 1) : Infinity;

  const right = j < board[0].length - 1 && (Math.abs(board[i][j] - board[i][j + 1]) < 2 
    || board[i][j + 1] == -1 || board[i][j + 1] != 0) ? play(board, i, j + 1, dist + 1) : Infinity;

  const up = i > 0 && (Math.abs(board[i][i] - board[i - 1][j]) < 2 
    || board[i - 1][j] == -1 || board[i - 1][j] != 0) ? play(board, i - 1, j, dist + 1) : Infinity;

  const down = i < board.length - 1 && (Math.abs(board[i][j] - board[i + 1][j]) < 2 
    || board[i + 1][j] == -1 || board[i + 1][j] != 0) ? play(board, i + 1, j, dist + 1) : Infinity;
  console.log([left, right, up, down]);
  return min([left, right, up, down]) as number;
}

function playMeBaby(board: number[][]) {
  return play(board, 0, 0);
}

const solve = pipe(
  readMeBaby,
  lineMeBaby,
  filterMeBaby,
  parseToGameBoard,
  // playMeBaby,
  JSON.stringify,
  console.log
);

solve();
