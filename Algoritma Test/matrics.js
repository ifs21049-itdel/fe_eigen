const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function matrics() {
  readline.question(
    "Masukkan ukuran matriks NxN (contoh: 3): ",
    (sizeInput) => {
      const size = parseInt(sizeInput);
      const matriks = [];
      let currentRow = 0;

      function inputRow() {
        if (currentRow < size) {
          readline.question(
            `Masukkan baris ke-${
              currentRow + 1
            } dipisahkan spasi (contoh: 1 2 3): `,
            (rowInput) => {
              const row = rowInput.split(" ").map(Number);
              matriks.push(row);
              currentRow++;
              inputRow();
            }
          );
        } else {
          let firstDiagonal = 0;
          let secondDiagonal = 0;

          for (let i = 0; i < size; i++) {
            firstDiagonal += matriks[i][i];
            secondDiagonal += matriks[i][size - 1 - i];
          }

          const difference = firstDiagonal - secondDiagonal;
          console.log(
            `Hasil: ${firstDiagonal} - ${secondDiagonal} = ${difference}`
          );
          readline.close();
        }
      }

      inputRow();
    }
  );
}

matrics();
