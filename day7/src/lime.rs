use std::collections::HashMap;

use camino::Utf8PathBuf;
use nom::{
    bytes::complete::{take_while1, tag}, combinator::{map, all_consuming},
    IResult, sequence::{preceded, separated_pair}, branch::alt, Finish
};

#[derive(Debug, Default)]
struct Node<'a> {
    size: usize,
    children: HashMap<Utf8PathBuf, Node<'a>>,
    parent: Option<&'a mut Node<'a>>
}

fn parse_path(i: &str) -> IResult<&str, Utf8PathBuf> {
    return map(
        take_while1(|c: char| "abcdefghijklmnopqrstuvwxyz./".contains(c)),
        Into::into
    )(i);
}

#[derive(Debug)]
struct Ls;

fn parse_ls(i: &str) -> IResult<&str, Ls> {
    map(tag("ls"), |_| Ls)(i)
}

#[derive(Debug)]
struct Cd(Utf8PathBuf);

fn parse_cd(i: &str) -> IResult<&str, Cd> {
    map(preceded(tag("cd "), parse_path), Cd)(i)
}

#[derive(Debug)]
enum Command {
    Ls(Ls),
    Cd(Cd),
}

fn parse_command(i: &str) -> IResult<&str, Command> {
    let (i, _) = tag("$ ")(i)?;
    alt((map(parse_ls, Command::Ls), map(parse_cd, Command::Cd)))(i)
}

#[derive(Debug)]
enum Entry {
    Dir(Utf8PathBuf),
    File(u64, Utf8PathBuf),
}

fn parse_entry(i: &str) -> IResult<&str, Entry> {
    let parse_file = map(
        separated_pair(nom::character::complete::u64, tag(" "), parse_path),
        |(size, path)| Entry::File(size, path),
    );
    let parse_dir = map(preceded(tag("dir "), parse_path), Entry::Dir);

    alt((parse_file, parse_dir))(i)
}

#[derive(Debug)]
enum Line {
    Command(Command),
    Entry(Entry),
}

fn parse_line(i: &str) -> IResult<&str, Line> {
    alt((
        map(parse_command, Line::Command),
        map(parse_entry, Line::Entry),
    ))(i)
}

pub fn solve() {
    let lines = include_str!("test_input.txt")
        .lines()
        .map(|l| all_consuming(parse_line)(l).finish().unwrap().1);

    let mut root = Node::default();
    let mut node = &mut root;

    for line in lines {
        match line {
            Line::Command(cmd) => match cmd {
                Command::Ls(_) => {}
                Command::Cd(path) => match path.0.as_str() {
                    "/" => {}
                    ".." => { }
                    _ => {
                        node = node.children.entry(path.0).or_default();
                    }
                },
            }
            Line::Entry(e) => match e {
                Entry::Dir(d) => {
                    let entry = node.children.entry(d).or_default();
                    entry.parent = Some(node);
                }
                Entry::File(s, f) => {
                    let entry = node.children.entry(f).or_default();
                    entry.size = s as usize;
                    entry.parent = Some(node);
                }
            }
        }
    }
    println!("{root:#?}");
}
