use std::fmt::{Debug, Display};
use itertools::Itertools;

#[derive(Clone, Copy)]
enum Term {
    Old,
    Constant(u64)
}

impl Debug for Term {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Term::Old => write!(f, "Old"),
            Term::Constant(value) => write!(f, "Constant({})", value),
        }
    }
}

impl Display for Term {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Term::Old => write!(f, "Old"),
            Term::Constant(value) => write!(f, "{}", value),
        }
    }
}

impl Term {
    pub fn eval(self, old: u64) -> u64 {
        match self {
            Term::Old => old,
            Term::Constant(c) => c
        }
    }
}

#[derive(Clone, Copy)]
enum Operation {
    Add(Term, Term),
    Mul(Term, Term)
}

impl Debug for Operation {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Mul(l, r) => write!(f, "{l:} * {r:}"),
            Self::Add(l, r) => write!(f, "{l:} + {r:}"),
        }
    }
}

impl Operation {
    pub fn eval(self, old: u64) -> u64 {
        match self {
            Operation::Add(l, r) => l.eval(old) + r.eval(old),
            Operation::Mul(l, r) => l.eval(old) * r.eval(old),
        }
    }
}

#[derive(Debug, Clone)]
struct Monkey {
    pub items: Vec<u64>,
    pub item_inspected: u64,
    pub operation: Operation,
    pub divisor: u64,
    pub receiver_true: usize,
    pub receiver_false: usize,
}

fn get_items(s: &str) -> Vec<u64> {
    let items = s
        .split(":")
        .last().unwrap().trim()
        .split(",")
        .map(|e| e.trim().parse::<u64>().unwrap())
        .collect::<Vec<_>>();
    return items;
}

fn parse_operation(s: &str) -> Operation {
    let term = s
        .split("=").last().unwrap().trim()
        .split(|c| c == '*' || c == '+').last().unwrap().trim();
    let is_const = !(term == "old");
    if s.contains("*") {
        if is_const {
            return Operation::Mul(Term::Old, Term::Constant(term.parse::<u64>().unwrap()));
        }
        return Operation::Mul(Term::Old, Term::Old);
    }
    if is_const {
        return Operation::Add(Term::Old, Term::Constant(term.parse::<u64>().unwrap()));
    }
    return Operation::Add(Term::Old, Term::Old);
}

fn parse_divisor(s: &str) -> u64 {
    return s.split(" ").last().unwrap().parse::<u64>().unwrap();
}

fn parse_receiver(s: &str) -> usize {
    return s.split(" ").last().unwrap().parse::<usize>().unwrap();
}

fn do_rounds(monkeys: &mut Vec<Monkey>) {
    let mut cloned_monkeys = monkeys.clone();
    let modular: u64 = cloned_monkeys.iter().map(|m| m.divisor).product();
    cloned_monkeys.iter_mut().enumerate().for_each(|(i, monkey)| {
        monkeys[i].item_inspected += monkeys[i].items.len() as u64;

        for _ in 0..monkeys[i].items.len() {
            let mut item = monkeys[i].items.pop().unwrap();
            item = monkeys[i].operation.eval(item);
            item = item % modular;
            if item % monkeys[i].divisor == 0 {
                monkeys[monkey.receiver_true].items.push(item);
            } else {
                monkeys[monkey.receiver_false].items.push(item);
            }
        }
    });
}

pub fn solve() {
    let mut monkeys = include_str!("input")
        .split("\n\n")
        .map(|b| {
            let lines = b.lines().collect::<Vec<_>>();
            let monkey = Monkey {
                items: get_items(lines[1]),
                item_inspected: 0,
                operation: parse_operation(lines[2]),
                divisor: parse_divisor(lines[3]),
                receiver_true: parse_receiver(lines[4]),
                receiver_false: parse_receiver(lines[5])
            };
            return monkey;
        }).collect::<Vec<_>>();

    for _ in 0..10000 {
        do_rounds(&mut monkeys);
    }
    let result = monkeys
             .iter()
             .map(|m| m.item_inspected)
             .sorted_unstable_by(|a, b| b.cmp(a))
             .take(2)
             .product::<u64>();
    println!("{:?}", result);
}
