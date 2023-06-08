import { readFileSync } from "fs";
import { min, sum } from "lodash";
import { curry, split, pipe, filter } from "ramda";

function readMeBaby () {
  return readFileSync('./input').toString();
}

const splitMeBaby = curry(split)('');
const lineMeBaby = curry(split)('\n');
const filterMeBaby = curry(filter)((e: any) => e != '');

class Node {
  parent?: Node;
  files: number[] = new Array<number>();
  dirs: Node[] = new Array<Node>();
  name: string;
  size: number = 0;

  constructor(name: string, parent?: Node) {
    this.name = name;
    this.parent = parent;
  }
}

function computeSize(node: Node) {
  if (!node) {
    return 0;
  }
  node.size = sum(node.files) + sum(node.dirs.map(d => computeSize(d)))
  return node.size;
}

function parseMeBaby(cmds: string[]) {
  let root = new Node('/');
  let current = root;

  for(let c of cmds) {
    const cmd = c.split(' ');
    if(cmd[0] == '$') {
      if(cmd[1] == 'cd') {
        if (cmd[2] == '..') {
          current = current.parent!;
        } else {
          for(let d of current.dirs!) {
            if (d.name == cmd[2]) {
              current = d;
              break;
            }
          }
        }
      }
    } else {
      // file or dir
      if(cmd[0] == 'dir') {
        current.dirs!.push(new Node(cmd[1], current));
      } else {
        current.files!.push(+cmd[0]);
      }
    }
  }

  return root;
}

function findDirUnderSize(maxSize: number, result: number[]) {
  return function find(d: Node) {
    if (d.size >= maxSize) {
      result.push(d.size);
    }
    d.dirs.forEach(i => find(i));
  }
}

const sovleMeBaby = pipe(
  readMeBaby,
  lineMeBaby,
  filterMeBaby,
  parseMeBaby,
);

const parsedRootDir = sovleMeBaby();
computeSize(parsedRootDir);
const result: number[] = [];
const limit = 70000000 - parsedRootDir.size;
const getResult = findDirUnderSize(30000000 - limit, result);
getResult(parsedRootDir);
console.log(min(result));
