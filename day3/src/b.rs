use std::{fmt::Debug, collections::HashSet};

#[derive(Clone, Copy, Hash, Eq, PartialEq)]
struct Item(u8);

impl TryFrom<u8> for Item {
    type Error = String;

    fn try_from(value: u8) -> Result<Self, Self::Error> {
        match value {
            b'a'..=b'z' | b'A'..=b'Z' => Ok(Item(value)),
            _ => Err("Not a valid pattern".to_string()),
        }
    }
}

impl Debug for Item {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0 as char)
    }
}

impl Item {
    fn priority(self) -> usize {
        match self {
            Item(b'a'..=b'z') => 1 + (self.0 - b'a') as usize,
            Item(b'A'..=b'Z') => 27 + (self.0 - b'A') as usize,
            _ => unreachable!(),
        }
    }
}

struct Batch {
    size: usize,
    items: Vec<HashSet<Item>>,
    idx: usize,
}

impl Iterator for Batch {
    type Item = usize;

    fn next(&mut self) -> Option<Self::Item> {
        loop {
            if self.idx >= self.items.len() {
                return None;
            }
            let first = &self.items[self.idx];
            let second = &self.items[self.idx + 1];
            let third = &self.items[self.idx + 2];
            self.idx += 3;

            for i in first {
                if second.contains(i) && third.contains(i) {
                    return Some(i.priority());
                }
            }
        }
    }
}

pub fn solve() {
    let lines = include_str!("../input.txt")
        .lines()
        .map(|line| {
            let items = line
                .bytes()
                .map(Item::try_from)
                .collect::<Result<HashSet<_>, _>>();
            return items.unwrap();
        }).collect::<Vec<_>>();
    let batched = Batch {
        items: lines,
        size: 3,
        idx: 0
    };
    println!("{:?}", batched.sum::<usize>());
}
