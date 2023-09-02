import { readFileSync } from "fs";
import { map, sum } from "lodash";
import { curry, split, pipe, filter, reduce } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const lineMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');

function draw(pixel: number, spritePos: number, buffer: number[]) {
  spritePos -= 1;
  if (spritePos <= pixel % 40 && pixel % 40 <= spritePos + 2) {
    buffer.push(pixel);
  }
}

function compute(ins: string[]) {
  let x = 1;
  let cycles = 0;
  const buffer: number[] = [0];
  reduce((acc, curr) => {
    if(curr == 'noop') {
      draw(cycles++, x, buffer);
    } else {
      const [_, val] = curr.split(' ');
      draw(cycles++, x, buffer);
      // check
      draw(cycles++, x, buffer);
      x += +val;
    }
    return acc;
  }, new Array<number | undefined>(), ins);
  return buffer;
}

function drawTheBuffer(buffer: number[]) {
  const display: Array<Array<'#' | '.'>> = [];
  for(let i = 0; i < 6; ++i) {
    let row: Array<'#' | '.'> = []
    for(let j = 0; j < 40; ++j) {
      row.push('.');
    }
    display.push(row);
  }

  for(const pixel of buffer) {
    const i = Math.floor(pixel / 40);
    const j = pixel % 40;
    display[i][j] = '#';
  }
  return map(display, pixel => pixel.join(''))
}

const solveMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  filterMeBaby,
  compute,
  curry(filter)((e: any) => !!e),
  drawTheBuffer,
  console.log
);

solveMeBaby();

