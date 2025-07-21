const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function longestword() {
  readline.question("Masukkan sebuah kalimat: ", (sentence) => {
    const words = sentence.split(" ");
    let longestWord = "";
    let maxLength = 0;

    for (const word of words) {
      if (word.length > maxLength) {
        maxLength = word.length;
        longestWord = word;
      }
    }

    console.log(`"${longestWord}" : ${maxLength} character`);
    readline.close();
  });
}

longestword();
