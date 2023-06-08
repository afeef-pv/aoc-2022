use std::{fs::read_to_string, io::Error, vec, fmt::Debug};
use itertools::Itertools;

struct PathedIoError {
    path: String,
    inner: Error
}

impl Debug for PathedIoError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "for file {:?}: {}", self.path, self.inner)
    }
}

fn read_file() -> Result<String, PathedIoError> {
    let path = "src/input.txt";
    return match read_to_string(path) {
        Ok(file) => Ok(file),
        Err(e) => Err(PathedIoError {
            path: path.into(),
            inner: e
        })
    };
}

fn max_food_by_elf(input: String) -> usize {
    let mut elf_foods: Vec<usize> = vec![];
    let mut cur_sum = 0;
    input.lines().for_each(|line| {
        if line.len() == 0 {
            // insert a new array
            elf_foods.push(cur_sum);
            cur_sum = 0;
        } else {
            cur_sum += line.parse::<usize>().unwrap();
        }
    });
    return *elf_foods.iter().max().unwrap();
}

struct GroupItem<T> {
    inner: T,
}

impl<T> Iterator for GroupItem<T> where T: Iterator<Item = Option<usize>> {
    type Item = usize;
    fn next(&mut self) -> Option<Self::Item> {
        // will get the first elemnt of the group;
        let mut sum = loop {
            // inner is already an iterator
            match self.inner.next() {
                Some(Some(v)) => {
                    break v
                },
                Some(None) => {}
                None => return None,
            }
        };

        // add the remaining elements of the group to the sum.
        loop {
            match self.inner.next() {
                Some(Some(v)) => {
                    sum += v
                },
                // reached end of a group
                Some(None) | None => {
                    break Some(sum);
                }
            }
        }
    }
}

fn main() {
    // let input = read_file().unwrap();
    // println!("Max food carried: {:?}", max_food_by_elf(input));
    let max = include_str!("input.txt")
        .lines()
        .map(|v| v.parse::<usize>().ok())
        .batching(|it| {
            let mut sum = None;
            while let Some(Some(v)) = it.next() {
                sum = Some(sum.unwrap_or(0) + v);
            }
            return sum;
        })
        .sorted_by_key(|&v| usize::MAX - v)
        .take(3)
        .sum::<usize>();
    // let groups = GroupItem { inner: lines }.max();
    println!("{max:?}");
}
