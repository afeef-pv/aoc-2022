mod b;

#[derive(Debug)]
struct Grid {
    grid: Vec<Vec<usize>>
}

impl Grid {
    fn get_visible(&self) -> usize {
        let mut count = 2 * self.grid.len() + 2 * (self.grid[0].len() - 2);
        for i in 1..self.grid.len() - 1 {
            for j in 1..self.grid[0].len() - 1 {
                if self.is_visible(i, j) {
                    count += 1;
                }
            }
        }
        return count;
    }

    fn is_visible(&self, i: usize, j: usize) -> bool {
        let mut visible = true;
        for left in j + 1..self.grid.len() {
            if self.grid[i][left] >= self.grid[i][j] {
              visible = false;
              break;
            }
        }
        if visible {
            return true;
        }
        let mut visible = true;
        for right in (0..=j-1).rev() {
            if self.grid[i][right] >= self.grid[i][j] {
              visible = false;
              break;
            }
        }
        if visible {
            return true;
        }
        let mut visible = true;
        for top in (0..=i - 1).rev() {
            if self.grid[top][j] >= self.grid[i][j] {
              visible = false;
              break;
            }
        }
        if visible {
            return true;
        }
        let mut visible = true;
        for bottom in i + 1..self.grid.len() {
            if self.grid[bottom][j] >= self.grid[i][j] {
              visible = false;
              break;
            }
        }
        return visible;
    }
}

fn str_to_usize_vec(s: &str) -> Vec<usize> {
    return s.chars().map(|c| c as usize).collect::<Vec<usize>>();
}

fn main() {
    // let a = include_str!("test.txt")
    //     .lines()
    //     .map(|l| str_to_usize_vec(l))
    //     .collect::<Vec<Vec<usize>>>();
    // let grid = Grid { grid: a };
    // println!("{:?}", grid.get_visible());
    println!("{:?}", b::solve());
}
