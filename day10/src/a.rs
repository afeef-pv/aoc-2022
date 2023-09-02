use std::str::FromStr;

#[derive(Debug)]
enum Operation {
    Noop,
    Add
}

#[derive(Debug)]
struct Instruction {
    cycles: u8,
    operation: Operation,
    operand: Option<i32>
}

struct Device {
    acc: isize,
    cycles: usize,
    signal_strength: isize
}

impl Default for Device {
    fn default() -> Self {
        Device {
            acc: 1,
            cycles: 0,
            signal_strength: 0
        }
    }
}

impl Device {
    fn execute(&mut self, instruction: Instruction) {
        match instruction.operation {
            Operation::Noop => {
                self.cycles += 1;
                self.check_cycle();
            }
            Operation::Add => {
                for _ in 0..instruction.cycles {
                    self.cycles += 1;
                    self.check_cycle();
                }
                self.acc += instruction.operand.unwrap() as isize;
            },
        }
    }

    fn check_cycle(&mut self) {
        if [20, 60, 100, 140, 180, 220].contains(&self.cycles) {
            self.signal_strength += self.acc * self.cycles as isize;
        }
    }
}

impl FromStr for Instruction {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut splitted = s.split_whitespace();
        match splitted.next().unwrap() {
            "noop" => {
                return Ok(Instruction {
                    cycles: 1,
                    operation: Operation::Noop,
                    operand: None
                });
            }
            "addx" => {
                let opp = splitted.next().unwrap();
                return Ok(Instruction {
                    cycles: 2,
                    operation: Operation::Add,
                    operand: Some(opp.parse().unwrap())
                });
            }
            _ => todo!()
        }
    }
}

pub fn sovle() {
    let mut device = Device::default();
    include_str!("test")
        .lines()
        .for_each(|l| {
            let i = l.parse::<Instruction>().unwrap();
            device.execute(i);
        });
    println!("{:?}", device.signal_strength);
}
