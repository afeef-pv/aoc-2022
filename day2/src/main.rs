use std::{collections::HashMap, str::FromStr};
mod b;

fn my_way() {
    let score_sheet = HashMap::<u8, u8>::from([
        (b'A', 1),
        (b'B', 2),
        (b'C', 3),
        (b'X', 1),
        (b'Y', 2),
        (b'Z', 3),
    ]);
    let rules = HashMap::<String, u8>::from([
        ("A X".into(), 3),
        ("A Y".into(), 6),
        ("A Z".into(), 0),
        ("B X".into(), 0),
        ("B Y".into(), 3),
        ("B Z".into(), 6),
        ("C X".into(), 6),
        ("C Y".into(), 0),
        ("C Z".into(), 3),
    ]);

    let hehe: usize = include_str!("input.txt")
        .lines()
        .map(|line| {
            let mut splitted_iter = line.split_whitespace();
            let score = rules[line];
            let _opp = splitted_iter.next().unwrap().as_bytes()[0];
            let me = splitted_iter.next().unwrap().as_bytes()[0];
            return score + score_sheet[&me];
        })
        .map(|x| x as usize)
        .sum();
    println!("> {:?}", hehe);
}

#[derive(Debug, Clone, Copy)]
enum Move {
    Rock,
    Paper,
    Scissors,
}

#[derive(Debug, Clone, Copy)]
enum Outcome {
    Win,
    Draw,
    Lose,
}

impl Outcome {
    fn inherent_points(self) -> usize {
        match self {
            Outcome::Win => 6,
            Outcome::Draw => 3,
            Outcome::Lose => 0,
        }
    }
}

impl Move {
    fn inherent_points(self) -> usize {
        match self {
            Move::Rock => 1,
            Move::Paper => 2,
            Move::Scissors => 3
        }
    }

    fn outcome(self, theirs: Move) -> Outcome {
        match (self, theirs) {
            (Move::Rock, Move::Rock) => Outcome::Draw,
            (Move::Paper, Move::Rock) => Outcome::Win,
            (Move::Scissors, Move::Rock) => Outcome::Lose,
            (Move::Rock, Move::Paper) => Outcome::Lose,
            (Move::Paper, Move::Paper) => Outcome::Draw,
            (Move::Scissors, Move::Paper) => Outcome::Win,
            (Move::Rock, Move::Scissors) => Outcome::Win,
            (Move::Paper, Move::Scissors) => Outcome::Lose,
            (Move::Scissors, Move::Scissors) => Outcome::Draw,
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct  Round {
    theirs: Move,
    ours: Move
}

impl Round {
    fn outcome(self) -> Outcome {
        return self.ours.outcome(self.theirs);
    }

    fn score(self) -> usize {
        return self.outcome().inherent_points() + self.ours.inherent_points();
    }
}

impl TryFrom<char> for Move {
    type Error = String;

    fn try_from(value: char) -> Result<Self, Self::Error> {
        match value {
            'A' | 'X' => Ok(Move::Rock),
            'B' | 'Y' => Ok(Move::Paper),
            'C' | 'Z' => Ok(Move::Scissors),
            _ => Err("Unidentified move".to_string()),
        }
    }
}

impl FromStr for Round {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut chars = s.chars();
        let (Some(theirs), Some(' '), Some(ours), None) = (chars.next(), chars.next(), chars.next(), chars.next()) else {
            return Err("expected <theirs>SP<ours>EOF, got {s:?}".to_string());
        };

        return Ok(Self {
            theirs: theirs.try_into()?,
            ours: ours.try_into()?,
        });
    }
}

fn main() {
    // let mut score = 0;
    // for round in include_str!("test_input.txt")
    //     .lines()
    //     .map(|l| l.parse::<Round>()) {
    //         let round = round.unwrap();
    //         score += round.score();
    //         println!("{:?}", round.outcome());
    //         println!("{:?}", score);
    //     }
    println!("{:?}", b::scroe_b());

}
