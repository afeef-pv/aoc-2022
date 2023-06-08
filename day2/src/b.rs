use std::str::FromStr;

#[derive(Debug, Clone, Copy)]
enum Outcome {
    Lose,
    Draw,
    Win
}

impl TryFrom<char> for Outcome {
    type Error = String;

    fn try_from(value: char) -> Result<Self, Self::Error> {
        match value {
            'X' => Ok(Outcome::Lose),
            'Y' => Ok(Outcome::Draw),
            'Z' => Ok(Outcome::Win),
            _ => Err("Unidentified Outcome".to_string())
        }
    }
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

#[derive(Debug, Clone, Copy)]
enum Move {
    Rock,
    Paper,
    Scissors
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

impl Move {
    fn inherent_points(self) -> usize {
        match self {
            Move::Rock => 1,
            Move::Paper => 2,
            Move::Scissors => 3
        }
    }

    fn to_win(self) -> Move {
        match self {
            Move::Rock => Move::Paper,
            Move::Paper => Move::Scissors,
            Move::Scissors => Move::Rock,
        }
    }

    fn to_lose(self) -> Move {
        match self {
            Move::Rock => Move::Scissors,
            Move::Paper => Move::Rock,
            Move::Scissors => Move::Paper,
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct Round {
    theirs: Move,
    goal: Outcome,
}

impl FromStr for Round {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut chars = s.chars();
        let (Some(theirs), Some(' '), Some(goal), None) = (chars.next(), chars.next(), chars.next(), chars.next()) else {
            return Err("expected <theirs>SP<ours>EOF, got {s:?}".to_string());
        };

        return Ok(Self {
            theirs: theirs.try_into()?,
            goal: goal.try_into()?,
        });
    }
}

impl Round {
    fn outcome(self) -> Move {
        match self.goal {
            Outcome::Lose => Move::to_lose(self.theirs),
            Outcome::Draw => self.theirs,
            Outcome::Win => Move::to_win(self.theirs),
        }
    }

    fn score(self) -> usize {
        return self.outcome().inherent_points() + self.goal.inherent_points();
    }
}

pub fn scroe_b() -> usize {
    let mut score = 0;
    for round in include_str!("input.txt")
        .lines()
        .map(|l| l.parse::<Round>())
    {
        score += round.unwrap().score();
    }
    return score;
}
