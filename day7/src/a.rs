use std::{str::FromStr, mem::replace, ptr::NonNull, fmt::Debug};

#[derive(Clone)]
struct Node {
    parent: Option<Box<Node>>,
    files: Vec<usize>,
    dirs: Vec<Box<Node>>,
    name: String,
    size: usize,
}

impl Debug for Node {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Name: {:?}\nDirs: {:?}\nFiles: {:?}", self.name, self.dirs, self.files)
    }
}

impl Node {
    fn new(name: String, parent: Option<Box<Node>>) -> Node {
        return Node {
            parent,
            name,
            size: 0,
            files: Default::default(),
            dirs: Default::default()
        };
    }
}

#[derive(Debug)]
enum CommandType {
    CD,
    LS,
    DIR,
    FIL
}

#[derive(Debug)]
struct Command {
    cType: CommandType,
    arg: Option<String>
}

impl FromStr for Command {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let splitted = s.split(" ").collect::<Vec<_>>();
        if splitted[0] == "$" {
            // parse it as command
            match splitted[1] {
                "ls" => Ok(Command { cType: CommandType::LS, arg: None }),
                "cd" => Ok(Command { cType: CommandType::CD, arg: Some(splitted[2].to_string()) }),
                _ => Err("Unidentified Command".to_string())
            }
        } else if splitted[0] == "dir" {
            return Ok(Command { cType: CommandType::DIR, arg: Some(splitted[1].to_string()) })
        } else  {
            return Ok(Command { cType: CommandType::FIL, arg: Some(splitted[0].to_string()) })
        }
    }
}

fn operate(mut current_node: Node, command: Command) -> Node {
    match command.cType {
        CommandType::CD => {
            let dir = command.arg.unwrap();
            if dir == ".." {
                current_node = *(current_node.parent.unwrap());
            } else {
                let d = current_node.dirs.iter().find(|&d| d.name == dir);
                if let Some(dir) = d {
                    current_node = *dir.clone();
                }

            }
        },
        CommandType::LS => {
        },
        CommandType::DIR => {
            let dir_name = command.arg.unwrap();
            let new_dir = Box::new(Node::new(dir_name, Some(Box::new(current_node.clone()))));
            println!(">> {:?}", new_dir);
            current_node.dirs.push(new_dir);
        },
        CommandType::FIL => {
            current_node.files.push(command.arg.unwrap().parse::<usize>().unwrap());
        },
    }
    return current_node;
}

pub fn solve() {
    let mut current = Box::new(Node::new("/".to_string(), None));
    include_str!("test_input.txt")
        .lines()
        .map(|l| l.parse::<Command>().unwrap())
        .for_each(|c| {
            let new_current = replace(&mut *current, Node::new("".to_string(), None));
            *current = operate(new_current, c);
        });
}
