const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function reverse() {
  readline.question("Masukkan string (contoh: NEGIE1): ", (input) => {
    const letters = input.match(/[A-Za-z]+/)?.[0] || "";
    const number = input.match(/\d+/) ? input.match(/\d+/)[0] : "";
    const reversedLetters = letters.split("").reverse().join("");
    const result = reversedLetters + number;
    console.log(`Hasil: ${result}`);
    readline.close();
  });
}

reverse();
