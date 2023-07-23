fn stack_me_daddy(ship: &str) {
    let ship_vec = ship
        .split('\n')
        .map(|l| l.replace('[', " "))
        .map(|l| l.replace(']', " "))
        .collect::<Vec<_>>();
    let size = ship_vec[ship_vec.len() - 1].split(' ')
        .filter(|e| e.len() > 0)
        .collect::<Vec<_>>()
        .len();
    let mut stack: Vec<Vec<char>> = Vec::new();
    for i in 0..ship_vec.len()-1 {
        let mut temp_stack: [char; 3] = ['\0', '\0', '\0'];
        ship_vec[i].
            chars()
            .enumerate()
            .for_each(|(i, c)| {
            if c != ' ' {
                let stack_index = ship_vec[ship_vec.len() - 1]
                    .chars()
                    .collect::<Vec<_>>()[i].to_digit(10).unwrap();
                temp_stack[stack_index as usize - 1] = c;
            }
        });
        stack.push(temp_stack.to_vec());
    }
    println!("{:?}", stack);
}

pub fn solve() {
    let shipAndMoves = include_str!("test_input.txt")
        .split("\n\n")
        .map(|l| {
            return l;
        })
        .collect::<Vec<_>>();
    let ship = shipAndMoves[0];
    let moves = shipAndMoves[1];
    stack_me_daddy(ship);
    
}
