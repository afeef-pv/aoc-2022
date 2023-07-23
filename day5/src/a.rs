use std::fmt::Debug;

use nom::{
    branch::alt,
    bytes::complete::{tag, take, take_while1},
    combinator::{all_consuming, map, opt, map_res},
    sequence::{delimited, preceded, tuple},
    Finish, IResult,
};

struct Crate(char);

impl Debug for Crate {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

struct Instruction {
    quanity: usize,
    src: usize,
    dst: usize,
}

impl Debug for Instruction {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "q: {:?}, src: {:?}, dst: {:?}", self.quanity, self.src, self.dst)
    }
}

struct Piles(Vec<Vec<Crate>>);

impl Debug for Piles {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        for (i, pile) in self.0.iter().enumerate() {
            writeln!(f, "Pile {}: {:?}", i, pile)?;
        }
        Ok(())
    }
}

impl Piles {
    fn apply(&mut self, ins: Instruction) {
        for _ in 0..ins.quanity {
            let el = self.0[ins.src - 1].pop().unwrap();
            self.0[ins.dst - 1].push(el);
        }
    }

    fn print(self) {
        let answer = self.0
            .iter()
            .map(|p| p.last().unwrap().0)
            .collect::<String>();
        println!("{:?}", answer);
    }
}

fn parse_instruction(i: &str) -> IResult<&str, Instruction> {
    return map(
        tuple((
            preceded(tag("move "), parse_number),
            preceded(tag(" from "), parse_number),
            preceded(tag(" to "), parse_number),
        )),
        |(quanity, src, dst)| Instruction {quanity, src, dst}
    )(i);
}

fn parse_crate(i: &str) -> IResult<&str, Crate> {
    let fist_char = |s: &str| Crate(s.chars().next().unwrap());
    let f = delimited(tag("["), take(1_usize), tag("]"));
    return map(f, fist_char)(i);
}

fn parse_hole(i: &str) -> IResult<&str, ()> {
    return map(tag("   "), drop)(i);
}

fn parse_crate_or_hole(i: &str) -> IResult<&str, Option<Crate>> {
    return alt((map(parse_crate, Some), map(parse_hole, |_| None)))(i);
}

fn parse_crate_line(i: &str) -> IResult<&str, Vec<Option<Crate>>> {
    let (mut i, c) = parse_crate_or_hole(i)?;
    let mut v = vec![c];

    loop {
        let (next_i, maybe_c) = opt(preceded(tag(" "), parse_crate_or_hole))(i)?;
        match maybe_c {
            Some(c) => v.push(c),
            None => break,
        }
        i = next_i;
    }
    return Ok((i, v));
}

fn transpose<T>(v: Vec<Vec<Option<T>>>) -> Vec<Vec<T>> {
    assert!(!v.is_empty());
    let len = v[0].len();
    let mut iters: Vec<_> = v.into_iter().map(|n| n.into_iter()).collect();
    (0..len)
        .map(|_| {
            iters
                .iter_mut()
                .rev()
                .filter_map(|n| n.next().unwrap())
                .collect::<Vec<T>>()
        })
        .collect()
}

fn parse_number(i: &str) -> IResult<&str, usize> {
    return map_res(take_while1(|c: char| c.is_ascii_digit()), |s: &str| {
        s.parse::<usize>()
    })(i);
}

pub fn solve() {
    let mut lines = include_str!("test_input.txt").lines();

    let crate_lines: Vec<_> = (&mut lines)
        .map_while(|l| {
            return all_consuming(parse_crate_line)(l).finish().ok().map(|(_, c)| c);
        })
        .collect();

    let crate_columns = transpose(crate_lines);
    let mut piles = Piles(crate_columns);

    for line in lines {
        let ins = all_consuming(parse_instruction)(line).finish().unwrap().1;
        println!("{piles:?}");
        piles.apply(ins);
        println!("{piles:?}");
    }

    piles.print();
}
