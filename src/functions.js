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
            nearMines: 0,
          };
        }),
    );

const spreadMines = (originalBoard, minesAmount) => {
  const board = cloneBoard(originalBoard);
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

const createMinedBoard = (rows, columns, minesAmount) => {
  const board = createBoard(rows, columns);
  return spreadMines(board, minesAmount);
};

const cloneBoard = board => {
  board.map(rows =>
    rows.map(field => {
      return {...field};
    }),
  );
};

const getNeighbors = (board, row, column) => {
  const neighbors = [];
  const rows = [row - 1, row, row + 1];
  const columns = [column - 1, column, column + 1];

  rows.forEach(r => {
    columns.forEach(c => {
      const different = r !== row || c !== column;
      const validRow = r >= 0 && r < board.length;
      const validColumn = c >= 0 && c < board[0].length;
      if (different && validRow && validColumn) {
        neighbors.push(board[r][c]);
      }
    });
  });
  return neighbors;
};

const safeNeighborhood = (board, row, column) => {
  const safes = (result, neighbor) => result && !neighbor.mined;
  return getNeighbors(board, row, column).reduce(safes, true);
};

const openField = (board, row, column) => {
  const field = board[row][column];
  if (!field.opened) {
    field.opened = true;
    if (field.mined) {
      field.exploded = true;
    } else if (safeNeighborhood(board, row, column)) {
      getNeighbors(board, row, column).forEach(n =>
        openField(board, n.row, n.column),
      );
    } else {
      const neighbors = getNeighbors(board, row, column);
      field.nearMines = neighbors.filter(n => n.mined).length;
    }
  }
};

const fields = board => [].concat(...board);
const hadExplosion = board => fields(board).some(field => field.exploded);
const pending = field =>
  (field.mined && !field.flagged) || (!field.mined && !field.opened);
const wonGame = board => fields(board).every(!pending);
const showMines = board =>
  fields(board)
    .field(field => field.mined)
    .forEach(field => (field.openField = true));

const invertFlag = (board, row, column) => {
  const field = board[row][column];
  field.flagged = !field.flagged;
};

const flagsUsed = board => fields(board).filter(field => field.flagged).length;

export {
  createMinedBoard,
  cloneBoard,
  openField,
  hadExplosion,
  wonGame,
  showMines,
  invertFlag,
  flagsUsed,
};
