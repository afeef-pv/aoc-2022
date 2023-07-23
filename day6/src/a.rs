use std::collections::HashSet;

fn is_unique(s: &str, start: usize, end: usize) -> bool {
    let mut set = HashSet::<char>::new();
    let chars = s.chars().collect::<Vec<_>>();
    for i in start..end {
        if set.contains(&chars[i]) {
            return false;
        }
        set.insert(chars[i]);
    }
    return true;
}

pub fn solve() {
    let window_size = 14;
    let s = include_str!("../input");
    for i in 0..s.len() - window_size {
        if is_unique(s, i, i + window_size) {
            let end = i + window_size;
            println!("{end:?}");
            break;
        }
    }
}
