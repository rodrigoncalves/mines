const createBoard = (rows, columns) =>
  Array(rows)
    .fill(0)
    .map((_, row) =>
      Array(columns)
        .fill(0)
        .map((__, column) => {
          return {
            row,
            column,
            opened: false,
            flagged: false,
            mined: false,
          };
        }),
    );

const spreadMines = (board, minesAmount) => {
  const rows = board.length;
  const columns = board[0].length;
  let minesPlanted = 0;
  while (minesPlanted < minesAmount) {
    const rowSel = parseInt(Math.random() * rows, 10);
    const columnSel = parseInt(Math.random() * columns, 10);

    const field = board[rowSel][columnSel];
    if (!field.mined) {
      field.mined = true;
      minesPlanted++;
    }
  }
};

export const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  spreadMines(board, minesAmount);
  return board;
};
