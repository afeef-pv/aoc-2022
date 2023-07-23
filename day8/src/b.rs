#[derive(Debug)]
struct Grid {
    grid: Vec<Vec<usize>>
}

impl Grid {
    fn get_max_scenic(&self) -> usize {
        let mut max_scenic = 0;
        for i in 1..self.grid.len() - 1 {
            for j in 1..self.grid[0].len() - 1 {
                if self.get_scenic_score(i, j) > max_scenic {
                    max_scenic = self.get_scenic_score(i, j);
                }
            }
        }
        return max_scenic;
    }

    fn get_scenic_score(&self, i: usize, j: usize) -> usize {
        let mut left_count: Option<usize> = None;
        for left in j + 1..self.grid.len() {
            left_count = Some(left_count.unwrap_or(0) + 1);
            if self.grid[i][left] >= self.grid[i][j] {
              break;
            }
        }
        let mut right_count: Option<usize> = None;
        for right in (0..=j-1).rev() {
            right_count = Some(right_count.unwrap_or(0) + 1);
            if self.grid[i][right] >= self.grid[i][j] {
              break;
            }
        }
        let mut top_count: Option<usize> = None;
        for top in (0..=i - 1).rev() {
            top_count = Some(top_count.unwrap_or(0) + 1);
            if self.grid[top][j] >= self.grid[i][j] {
              break;
            }
        }
        let mut bottom_count: Option<usize> = None;
        for bottom in i + 1..self.grid.len() {
            bottom_count = Some(bottom_count.unwrap_or(0) + 1);
            if self.grid[bottom][j] >= self.grid[i][j] {
              break;
            }
        }
        return right_count.unwrap_or(1)
        * left_count.unwrap_or(1)
        * top_count.unwrap_or(1)
        * bottom_count.unwrap_or(1)
    }
}

fn str_to_usize_vec(s: &str) -> Vec<usize> {
    return s.chars().map(|c| c as usize).collect::<Vec<usize>>();
}

pub fn solve() -> usize {
    let a = include_str!("../input")
        .lines()
        .map(|l| str_to_usize_vec(l))
        .collect::<Vec<Vec<usize>>>();
    let grid = Grid { grid: a };
    return grid.get_max_scenic();
}
