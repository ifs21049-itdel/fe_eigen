const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function countword() {
  readline.question(
    "Masukkan elemen INPUT dipisahkan koma (contoh: xc,dz,bbb,dz): ",
    (inputStr) => {
      const INPUT = inputStr.split(",").map((item) => item.trim());

      readline.question(
        "Masukkan elemen QUERY dipisahkan koma (contoh: bbb,ac,dz): ",
        (queryStr) => {
          const QUERY = queryStr.split(",").map((item) => item.trim());

          const result = QUERY.map((query) => {
            return INPUT.filter((input) => input === query).length;
          });

          console.log(`Hasil: [${result.join(", ")}]`);
          readline.close();
        }
      );
    }
  );
}

countword();
