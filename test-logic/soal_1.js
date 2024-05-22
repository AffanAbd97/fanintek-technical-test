//soal 1

const counPair = (arr) => {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] == arr[j]) {
        arr.splice(j, 1);
        count++;
        break;
      }
    }
  }
  console.log(`Jumlah Pasang :${count}`);
};
counPair([5, 7, 7, 9, 10, 4, 5, 10, 6, 5]);
counPair([10, 20, 20, 10, 10, 30, 50, 10, 20]);
counPair([6, 5, 2, 3, 5, 2, 2, 1, 1, 5, 1, 3, 3, 3, 5]);
counPair([1, 1, 3, 1, 2, 1, 3, 3, 3, 3]);
