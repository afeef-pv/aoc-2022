import { readFileSync } from "fs";
import { curry, split, pipe, filter } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const lineMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');

class Grid {
  Hx = 0;
  Hy = 0;
  Tx = 0;
  Ty = 0;
  canvas: { [key: string]: boolean } = {};

  move(dir: string) {
    const dx: { [key: string]: number } = { "R": 1, "L": -1, "U": 0, "D": 0 };
    const dy: { [key: string]: number } = { "R": 0, "L": 0, "U": 1, "D": -1 };

    this.Hx += dx[dir];
    this.Hy += dy[dir];

    let distX = Math.abs(this.Hx - this.Tx);
    let distY = Math.abs(this.Hy - this.Ty);

    if (this.Hx === this.Tx || this.Hy === this.Ty) {
         if (distX > 1) {
            this.Tx += dx[dir];
         }
         else if (distY > 1) {
            this.Ty += dy[dir];
         }
    } else {
      // diagonal
         if (distX > 1) {
           this.Tx += dx[dir];
           this.Ty = this.Hy;
         }
         else if (distY > 1) {
           this.Tx = this.Hx;
           this.Ty += dy[dir];
         }
    }
    this.canvas[`${this.Tx}, ${this.Ty}`] = true;
  }
}

function walkMeBaby(walks: string[]) {
  let grid = new Grid();
  for(const walk of walks) {
    let dir: string, steps: string | number;
    [dir, steps] = walk.split(" ");
    steps = +steps;
    for (let step = 0; step < steps; ++step) {
      grid.move(dir);
    }
  }

  return Object.keys(grid.canvas).length;
}

const solveMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  filterMeBaby,
  walkMeBaby,
  console.log
);

solveMeBaby();
