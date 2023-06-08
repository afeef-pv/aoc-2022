import { readFileSync } from "fs";
import { max } from "lodash";
import { curry, split, pipe, filter } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const splitMeBaby = curry(split)('');
const lineMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');

function gridMeBaby(len: number) {
  let r: boolean[][] = [];
  for(let i = 0; i < len; ++i) {
    let k: boolean[] = []
    for(let j = 0; j < len; ++j) {
      k.push(false);
    }
    r.push(k);
  }
  return r;
}

function walkMeBaby(walks: string[]) {
  const board: any = {};
  let Xx = 0, Xy = 0;
  let Yx = 0, Yy = 0;
  for(const walk of walks) {
    let count = 0;
    let dist;
    const [dir, steps] = walk.split(' ');
    switch (dir) {
      case 'R':
        Xy += +steps;
        dist = Math.abs(Xy - Yy);
        if (Xx == Yx) {
          for(let i = Yy + 1; i < Xy; ++i) {
            if(!board[`${Yx}_${i}`]) {
              board[`${Yx}_${i}`] = true;
            }
          }
          Yy = Xy - 1;;
        } else {
          dist = dist - 1;
          if (dist > 1) {
            for(let i = Yy + 2; i < Xy; ++i) {
              Yx = Xx;
              if(!board[`${Yx}_${i}`]) {
                board[`${Yx}_${i}`] = true;
              }
            }
          }
        }
        break;
      case 'L':
        Xy -= +steps;
        dist = Math.abs(Xy - Yy);
        if (Xx == Yx) {
          for(let i = Yy; i > Xy; --i) {
            if(!board[`${Yx}_${i}`]) {
              board[`${Yx}_${i}`] = true;
            }
          }
          Yy = Xy + 1;
        } else {
          // move diagonal then follow
          if (dist > 1) {
            for(let i = Yy - 1; i > Yy - dist; --i) {
              Yx = Xx;
              if(!board[`${Yx}_${i}`]) {
                board[`${Yx}_${i}`] = true;
              }
            }
          }
        }
        break;
      case 'U':
        Xx += +steps;
      if(Xx == Yx) {
        for(let i = Yx; i < Xx; ++i) {
          if(!board[`${i}_${Yy}`]) {
            board[`${i}_${Yy}`] = true;
          }
        }
        Yy = Xy - 1;
      }
      else {
        dist = Math.abs(Xx - Yx);
        if(dist > 1) {
          for(let i = Yx; i < Xx; ++i) {
            Yy = Xy;
            if(!board[`${i}_${Yy}`]) {
              board[`${i}_${Yy}`] = true;
            }
          }
          Yy = Xy - 1;
        }
      }
        break;
        case 'D':
          Xx -= +steps;
        if(Xx == Yx) {
          for(let i = Yx; i > Xx; --i) {
            if(!board[`${i}_${Yy}`]) {
              board[`${i}_${Yy}`] = true;
            }
          }
          Yy = Xy + 1;
        }
        else {
          dist = Math.abs(Xx - Yy);
          if(dist > 1) {
            for(let i = Yx; i > Xx; --i) {
              Yy = Xx;
              if(!board[`${i}_${Yy}`]) {
                board[`${i}_${Yy}`] = true;
              }
            }
            Yy = Xy + 1;
          }
        }
        break;

    }
  }
  return board;
}

const solveMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  filterMeBaby,
  walkMeBaby,
  console.log
);

solveMeBaby();
