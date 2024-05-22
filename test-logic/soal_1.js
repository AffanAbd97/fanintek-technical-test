//soal 1

const counPair = (arr) => {
  let pairs = {};
  let counts = 0;
  for (const sock of arr) {
    if (pairs[sock]) {
      pairs[sock]++;
    } else {
      pairs[sock] = 1;
    }
  }
  for (let item in pairs) {
    counts += Math.floor(pairs[item] / 2);
  }

  return counts;
};
const contoh = [5, 7, 7, 9, 10, 4, 5, 10, 6, 5]
const input1 = [10, 20, 20, 10, 10, 30, 50, 10, 20]
const input2 = [6, 5, 2, 3, 5, 2, 2, 1, 1, 5, 1, 3, 3, 3, 5]
const input3 = [1, 1, 3, 1, 2, 1, 3, 3, 3, 3]
console.log(counPair(contoh)); 
console.log(counPair(input1));
console.log(counPair(input2));
console.log(counPair(input3));

