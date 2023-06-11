use std::str::FromStr;

struct ElfPair {
    left_range: Vec<usize>,
    right_range: Vec<usize>,
}

impl FromStr for ElfPair {
    type Err = String;

    fn from_str(value: &str) -> Result<Self, Self::Err> {
        let mut split_by_comma = value.split(',');
        let left_elf_range = split_by_comma.next().unwrap();
        let right_elf_range = split_by_comma.next().unwrap();
        let mut left_values = left_elf_range.split('-');
        let mut right_values = right_elf_range.split('-');

        let elf_pair = ElfPair {
            left_range: vec![
                left_values.next().unwrap().parse::<usize>().unwrap(),
                left_values.next().unwrap().parse::<usize>().unwrap()
            ],
            right_range: vec![
                right_values.next().unwrap().parse::<usize>().unwrap(),
                right_values.next().unwrap().parse::<usize>().unwrap()
            ],
        };
        return Ok(elf_pair);
    }
}

impl ElfPair {
    fn overlaps(&self) -> bool {
        return (self.left_range[0] <= self.right_range[0] &&
                self.left_range[1] >= self.right_range[1]) 
            || (self.right_range[0] <= self.left_range[0] &&
                self.right_range[1] >= self.left_range[1]);
    }
}

pub fn sove() {
    let overlapped_elfs = include_str!("../input.txt")
        .lines()
        .map(|l| {
            let elf_pair = l.parse::<ElfPair>().unwrap();
            return elf_pair.overlaps();
        })
        .filter(|e| *e)
        .collect::<Vec<_>>();
    println!("Result {:?}", overlapped_elfs.len());
}
