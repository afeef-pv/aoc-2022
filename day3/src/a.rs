use std::{str::FromStr, collections::HashMap};

struct Rucksack {
    items: Vec<u8>,
    middle: usize
}

impl Rucksack {
    fn new(input: String) -> Rucksack {
        return Rucksack {
            middle: input.len() / 2,
            items: input.into_bytes(),
        };
    }

    fn get_priority(self) -> u8 {
        let mut left_map = HashMap::<u8, bool>::new();
        let mut right_map = HashMap::<u8, bool>::new();
        for i in 0..self.middle {
            left_map.insert(self.items[i], true);
        }
        for i in self.middle..self.items.len() {
            right_map.insert(self.items[i], true);
        }
        for i in 0..self.items.len() {
            if left_map.contains_key(&self.items[i]) &&
                right_map.contains_key(&self.items[i]) {
                if self.items[i] > 96 {
                    return self.items[i] - 96;
                }
                return self.items[i] - 64  + 26;
            }
        }
        return 0;
    }
}

impl FromStr for Rucksack {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let rucksack = Rucksack::new(s.into()) else {
            return Err("Error".to_string());
        };
        return Ok(rucksack);
    }
}

pub fn solve() {
    let sum: usize = include_str!("../input.txt")
        .lines()
        .map(|l| {
            let rucksack = l.parse::<Rucksack>().unwrap();
            return usize::from(rucksack.get_priority());
        }).sum();
    println!("{:?}", sum);
}
