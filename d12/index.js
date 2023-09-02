const ROWS = 41, COLUMNS = 82;
const board = document.getElementById("checkerboard");
let isEnd = false, startId, endId;
const visited = {};
let seletedAlgorithm = 'bfs';

const delay = t => new Promise(r => setTimeout(r, t));

function visit(cords) {
  const id = getIdFromCords(cords);
  visited[id] = true;
  if (id != startId && id != endId) {
    const cell = document.getElementById(id);
    cell.style.backgroundColor = 'purple';
  }
}

class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(item, priority) {
    this.elements.push({ item, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.elements.shift().item;
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  size() {
    return this.elements.length;
  }
}


async function dfs(startCord, endCord) {
  const stack = [];
  stack.push(startCord);
  while (stack.length) {
    const cord = stack.pop();
    visit(cord);
    if (getIdFromCords(cord) === getIdFromCords(endCord)) {
      return;
    }
    if (cord.r > 0) {
      const top = { r: cord.r - 1, c: cord.c };
      !visited[getIdFromCords(top)] && stack.push(top);
    }
    if (cord.r < ROWS - 1) {
      const bottom = { r: cord.r + 1, c: cord.c };
      !visited[getIdFromCords(bottom)] && stack.push(bottom);
    }
    if (cord.c > 0) {
      const left = { r: cord.r, c: cord.c - 1 };
      !visited[getIdFromCords(left)] && stack.push(left);
    }
    if (cord.c < COLUMNS - 1) {
      const right = { r: cord.r, c: cord.c + 1};
      !visited[getIdFromCords(right)] && stack.push(right);
    }

    if (cord.r > 0 && cord.c > 0) {
      const rd = { r: cord.r - 1, c: cord.c - 1 };
      !visited[getIdFromCords(rd)] && stack.push(rd);
    }
    if (cord.r > 0 && cord.c < COLUMNS - 1) {
      const ld = { r: cord.r - 1, c: cord.c + 1 };
      !visited[getIdFromCords(ld)] && stack.push(ld);
    }
    if (cord.r < ROWS - 1 && cord.c < COLUMNS - 1) {
      const td = { r: cord.r + 1, c: cord.c + 1 };
      !visited[getIdFromCords(td)] && stack.push(td);
    }
    if (cord.r < ROWS - 1 && cord.c > 0) {
      const bd = { r: cord.r + 1, c: cord.c - 1 };
      !visited[getIdFromCords(bd)] && stack.push(bd);
    }
    await delay(3.3);
  }
}

async function bfs(startCord, endCord) {
  const queue = [];
  queue.push(startCord);
  while (queue.length) {
    const cord = queue.shift();
    if (getIdFromCords(cord) === getIdFromCords(endCord)) {
      return;
    }
    if (cord.r > 0) {
      const top = { r: cord.r - 1, c: cord.c };
      !visited[getIdFromCords(top)] && queue.push(top) && visit(top);
    }
    if (cord.r < ROWS - 1) {
      const bottom = { r: cord.r + 1, c: cord.c };
      !visited[getIdFromCords(bottom)] && queue.push(bottom) && visit(bottom);
    }
    if (cord.c > 0) {
      const left = { r: cord.r, c: cord.c - 1 };
      !visited[getIdFromCords(left)] && queue.push(left) && visit(left);
    }
    if (cord.c < COLUMNS - 1) {
      const right = { r: cord.r, c: cord.c + 1};
      !visited[getIdFromCords(right)] && queue.push(right) && visit(right);
    }

    if (cord.r > 0 && cord.c > 0) {
      const rd = { r: cord.r - 1, c: cord.c - 1 };
      !visited[getIdFromCords(rd)] && queue.push(rd) && visit(rd);
    }
    if (cord.r > 0 && cord.c < COLUMNS - 1) {
      const ld = { r: cord.r - 1, c: cord.c + 1 };
      !visited[getIdFromCords(ld)] && queue.push(ld) && visit(ld);
    }
    if (cord.r < ROWS - 1 && cord.c < COLUMNS - 1) {
      const td = { r: cord.r + 1, c: cord.c + 1 };
      !visited[getIdFromCords(td)] && queue.push(td) && visit(td);
    }
    if (cord.r < ROWS - 1 && cord.c > 0) {
      const bd = { r: cord.r + 1, c: cord.c - 1 };
      !visited[getIdFromCords(bd)] && queue.push(bd) && visit(bd);
    }
    await delay(3.3);
  }
}


function getCartisianDistance(c1, c2) {
  return Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.r - c2.r, 2));
}

function getNeighbors(cord) {
  const neighbors = [];
  if (cord.r > 0) {
    neighbors.push({ r: cord.r - 1, c: cord.c });
  }
  if (cord.r < ROWS - 1) {
    neighbors.push({ r: cord.r + 1, c: cord.c });
  }
  if (cord.c > 0) {
    neighbors.push({ r: cord.r, c: cord.c - 1 });
  }
  if (cord.c < COLUMNS - 1) {
    neighbors.push({ r: cord.r, c: cord.c + 1 });
  }
  // diagonals
  if (cord.r > 0 && cord.c > 0) {
    neighbors.push({ r: cord.r - 1, c: cord.c - 1 });
  }
  if (cord.r > 0 && cord.c < COLUMNS - 1) {
    neighbors.push({ r: cord.r - 1, c: cord.c + 1 });
  }
  if (cord.r < ROWS - 1 && cord.c < COLUMNS - 1) {
    neighbors.push({ r: cord.r + 1, c: cord.c + 1 });
  }
  if (cord.r < ROWS - 1 && cord.c > 0) {
    neighbors.push({ r: cord.r + 1, c: cord.c - 1 });
  }
  return neighbors;
}

async function dijkstra(startCord, endCord) {
  console.log(startCord, endCord);
  const queue = new PriorityQueue();
  queue.enqueue(startCord, 0);
  const distMap = {};
  const map = {};
  distMap[getIdFromCords(startCord)] = 0;
  map[getIdFromCords(startCord)] = null;

  while (!queue.isEmpty()) {
    const u = queue.dequeue();
    for (const v of getNeighbors(u)) {
      const dist = distMap[getIdFromCords(u)]  + 1; 
      // console.log('>>', u, v, getIdFromCords(v), dist, (distMap[getIdFromCords(v)] || Infinity) > dist);
      if ((distMap[getIdFromCords(v)] || Infinity) > dist) {
        distMap[getIdFromCords(v)] = dist;
        map[getIdFromCords(v)] = getIdFromCords(u);
        queue.enqueue(v, dist);
      }
    }
  }

  const path = [];
  let u = getIdFromCords(endCord);
  while (u != getIdFromCords(startCord)) {
    path.push(u);
    u = map[u];
  }

  while (path.length) {
    visit(getCordsFromId(path.pop()));
    await delay(13.3);
  }
}

function parseToGameBoard(moves) {
  const board = [];
  for(const move of moves) {
    board.push(move.split('').map(e => {
      if (e == 'S') {
        return 1;
      } else if(e == 'E'){
        return -1;
      }
      const val = e.charCodeAt(0) - 96;
      return val;
    }))
  }
  return board;
}

async function algo() {
  startId = getIdFromCords({r: 20, c: 0});
  queue.pop();
  queue.push({r: 20, c: 0});
  function getDiff(c1, c2) {
    return Math.abs(graph[c1.r][c1.c] - graph[c2.r][c2.c]) < 2;
  }
  const graph = parseToGameBoard();
  while (queue.length) {
    const cord = queue.pop();
    visit(cord);
    if (graph[cord.r][cord.c] === -1) {
      return;
    }
    if (cord.r > 0) {
      const top = { r: cord.r - 1, c: cord.c };
      !visited[getIdFromCords(top)] && getDiff(cord, top) && queue.push(top);
    }
    if (cord.r < ROWS - 1) {
      const bottom = { r: cord.r + 1, c: cord.c };
      !visited[getIdFromCords(bottom)] && getDiff(cord, bottom) && queue.push(bottom);
    }
    if (cord.c > 0) {
      const left = { r: cord.r, c: cord.c - 1 };
      !visited[getIdFromCords(left)] && getDiff(cord, left)  && queue.push(left);
    }
    if (cord.c < COLUMNS - 1) {
      const right = { r: cord.r, c: cord.c + 1};
      !visited[getIdFromCords(right)] && getDiff(cord, right)  && queue.push(right);
    }
    await delay(33.3);
  }
}

function getCordsFromId(id) {
  const [r, c] = id.split(':').map(i => +i)
  return { r, c };
}

function getIdFromCords(cords) {
  const { r, c } = cords;
  const id = `${r}:${c}`;
  return id;
}

function handleClick(e) {
  const id = e.target.id;
  console.log(id);
  if (isEnd) {
    e.target.style.backgroundColor = 'red';
    endId = id;
  } else {
    if (endId) {
      clearToDefault(document.getElementById(endId));
    }
    if (startId) {
      clearToDefault(document.getElementById(startId));
    }
    e.target.style.backgroundColor = 'green';
    startId = id;
  }
  isEnd = !isEnd;
}

function clearToDefault(element) {
  element.style.backgroundColor = '#f0f0f0';
}

for (let i = 0; i < ROWS; ++i) {
  for (let j = 0; j < COLUMNS; ++j) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.id = `${i}:${j}`;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
}

function selectAlgorithm(event) {
  seletedAlgorithm = event.target.value;
}

function play() {
  if (endId) {
    switch (seletedAlgorithm) {
      case 'bfs':
        bfs(getCordsFromId(startId), getCordsFromId(endId));
        break;
      case 'dfs':
        dfs(getCordsFromId(startId), getCordsFromId(endId));
        break;
      case 'dijkstra':
        dijkstra(getCordsFromId(startId), getCordsFromId(endId));
        break;
    }
  }
}

const select = document.getElementById("algorithm-select");
select.addEventListener("change", selectAlgorithm, false);

const playBtn = document.getElementById("play-btn");
playBtn.addEventListener("click", play, false);
