// soal 2
const countWord = (str) => {
  let arr = str.split(" ");
  let specialChar = ["[", "]", "*", "_", "=", "&", "(", "!"];
  let charaterWords = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < specialChar.length; j++) {
      let result = arr[i].includes(specialChar[j]);

      if (result == true) {
        charaterWords.push(arr[i]);
      }
    }
  }

  let output = arr.length - charaterWords.length;

  return output;
};
const inputContoh = "kemarin sophia per[gi ke mall";
const input1 = "Saat meng*ecat tembok, agung dib_antu oleh Raihan";
const input2 = "Berapa u(mur minimal[ untuk !mengurus ktp?";
const input3 = "Masing-masing anak mendap(atkan uang jajan ya=ng be&rbeda";

console.log(countWord(inputContoh));
console.log(countWord(input1));
console.log(countWord(input2));
console.log(countWord(input3));
