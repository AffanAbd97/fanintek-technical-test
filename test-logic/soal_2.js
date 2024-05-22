// soal 2
const countWord = (str) => {
  const specialChars = ["[", "]", "*", "_", "=", "&", "(", "!"];

  const words = str.split(/\s+/);

  const filteredWords = words.filter((word) => {
    for (const char of specialChars) {
      if (word.includes(char)) {
        return false;
      }
    }
    return true;
  });

  return filteredWords.length;
};
const inputContoh = "kemarin sophia per[gi ke mall";
const input1 = "Saat meng*ecat tembok, agung dib_antu oleh Raihan";
const input2 = "Berapa u(mur minimal[ untuk !mengurus ktp?";
const input3 = "Masing-masing anak mendap(atkan uang jajan ya=ng be&rbeda";

console.log(countWord(inputContoh));
console.log(countWord(input1));
console.log(countWord(input2));
console.log(countWord(input3));
