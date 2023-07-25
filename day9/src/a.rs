use num::abs;
use std::{collections::HashMap, str::FromStr};

#[derive(Debug, PartialEq, Eq, Hash)]
enum Direction {
    Up,
    Down,
    Left,
    Right
}

impl Direction {
    fn delta(&self) -> Cords {
        match self {
            Direction::Up => Cords { x: 0, y: 1 },
            Direction::Down => Cords { x: 0, y: -1 },
            Direction::Left => Cords { x: -1, y: 0 },
            Direction::Right => Cords { x: 1, y: 0 },
        }
    }
}

struct Instruction {
    direction: Direction,
    steps: usize
}

impl FromStr for Instruction {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut parts = s.split_whitespace();
        return Ok(Instruction {
            direction: match parts.next().unwrap() {
                "U" => Direction::Up,
                "D" => Direction::Down,
                "R" => Direction::Right,
                "L" => Direction::Left,
                 _ => todo!()
            },
            steps: parts.next().unwrap().parse().unwrap()
        });
    }
}

struct Cords {
    x: i32,
    y: i32
}

impl Default for Cords {
    fn default() -> Self {
        return Cords { x: 0, y: 0 };
    }
}

impl Cords {
    fn add(&mut self, cords: Cords) {
        self.x += cords.x;
        self.y += cords.y;
    }

    fn dist_x(&self, other: &Cords) -> i32 {
        abs(self.x - other.x)
    }

    fn dist_y(&self, other: &Cords) -> i32 {
        abs(self.y - other.y)
    }

    fn diagonal_to(&self, other: &Cords) -> bool {
        if self.x == other.x || self.y == other.y {
            return false;
        }
        return true;
    }
}

struct Grid {
    head: Cords,
    tail: Cords,
    canvas: HashMap<String, bool>
}

impl Default for Grid {
    fn default() -> Self {
        let head = Cords::default();
        let tail = Cords::default();
        return Grid { head, tail, canvas: HashMap::new() }
    }
}

impl Grid {
    fn apply(&mut self, instruction: Instruction) {
        for _ in 0..instruction.steps {
            self.walk(&instruction.direction);
        }
    }
    
    fn walk(&mut self, dir: &Direction) {
        let mut dx: HashMap<Direction, i32> = HashMap::new();
        dx.insert(Direction::Up, 0);
        dx.insert(Direction::Down, 0);
        dx.insert(Direction::Right, 1);
        dx.insert(Direction::Left, -1);

        let mut dy: HashMap<Direction, i32> = HashMap::new();
        dy.insert(Direction::Up, 1);
        dy.insert(Direction::Down, -1);
        dy.insert(Direction::Right, 0);
        dy.insert(Direction::Left, 0);


        self.head.add(dir.delta());

        let dist_x = self.head.dist_x(&self.tail);
        let dist_y = self.head.dist_y(&self.tail);

        if self.head.diagonal_to(&self.tail) {
            if dist_x > 1 {
                self.tail.add(dir.delta());
                self.tail.y = self.head.y;
            }
            if dist_y > 1 {
                self.tail.add(dir.delta());
                self.tail.x = self.head.x;
            }
        } else {
            if dist_x > 1 || dist_y > 1 {
                self.tail.add(dir.delta());
            }
        }

        let key = format!("{}_{}", self.tail.x, self.tail.y);
        if !self.canvas.contains_key(&key) {
            self.canvas.insert(key, true);
        }
    }
}

pub fn solve() {
    let mut grid = Grid::default();
    let instructions = include_str!("../input")
        .lines()
        .map(|l| {
            l.parse::<Instruction>().unwrap()
        })
        .collect::<Vec<_>>();
    for instruction in instructions {
        grid.apply(instruction);
    }
    println!("{:?}", grid.canvas.len());
}
