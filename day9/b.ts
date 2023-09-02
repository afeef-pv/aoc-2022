import { readFileSync } from "fs";
import { parseInt } from "lodash";
import { curry, split, pipe, filter } from "ramda";

function readMeBaby () {
  return readFileSync('./src/test_input').toString();
}
const delay = (t: number) => new Promise(r => setTimeout(r, t));

const lineMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');
const dx: { [key: string]: number } = { "R": 1, "L": -1, "U": 0, "D": 0 };
const dy: { [key: string]: number } = { "R": 0, "L": 0, "U": 1, "D": -1 };

type Canvas = { [key: string]: boolean };
type Cords = { x: number, y: number };

class Grid {
  knots: Cords[] = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ];
  canvas: Canvas = {};
  
  async walk(steps: number, dir: string) {
    for (let step = 0; step < steps; ++step) {
      this.knots[0].x += dx[dir];
      this.knots[0].y += dy[dir];
      for (let k = 0; k < this.knots.length - 1; ++k) {
        const head = this.knots[k];
        const tail = this.knots[k + 1];
        this.moveTail(head, tail, dir, k + 1 == this.knots.length - 1);
      }
      console.log(dir + ":"+ steps + "\n");
      draw(this.canvas);
      await delay(60);
      console.clear();
    }
  }

  moveTail(
    head: Cords,
    tail: Cords,
    dir: string,
    realTail: boolean
  ) {
    let distX = Math.abs(head.x - tail.x);
    let distY = Math.abs(head.y - tail.y);

    if (head.x === tail.x || head.y === tail.y) {
         if (distX > 1) {
            tail.x += dx[dir];
         }
         if (distY > 1) {
            tail.y += dy[dir];
         }
    } else {
      // diagonal
         if (distX > 1) {
           tail.x += dx[dir];
           tail.y = head.y;
         }
         if (distY > 1) {
           tail.x = head.x;
           tail.y += dy[dir];
         }
    }
    if (realTail) this.canvas[`${tail.x}:${tail.y}`] = true;
  }
}

async function walkMeBaby(walks: string[]) {
  let grid = new Grid();
  for(const walk of walks) {
    let dir: string, steps: string | number;
    [dir, steps] = walk.split(" ");
    steps = +steps;
    await grid.walk(steps, dir);
  }
  draw(grid.canvas);
  console.log(Object.keys(grid.canvas).length);
  return Object.keys(grid.canvas).length;
}

function draw(canvas: Canvas) {
  const keys = Object.keys(canvas);
  const maxX =  25 || Math.max(...keys.map(k => k.split(":")[0]).map(parseInt));
  const maxY =  25 || Math.max(...keys.map(k => k.split(":")[1]).map(parseInt));
  const minX = -25 || Math.min(...keys.map(k => k.split(":")[0]).map(parseInt));
  const minY = -25 || Math.min(...keys.map(k => k.split(":")[1]).map(parseInt));
  let buffer = "";
  for (let y = maxY; y >= minY; --y) {
    for (let x = minX; x <= maxX; ++x) {
      if (canvas[`${x}:${y}`]) {
        buffer += "#";
      } else {
        buffer += ".";
      }
    }
    buffer += "\n";
  }
  console.log(buffer);
}

const solveMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  filterMeBaby,
  walkMeBaby,
  console.log
);

solveMeBaby();

