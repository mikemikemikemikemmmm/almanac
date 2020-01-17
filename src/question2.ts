export default function Question2(arr: number[]) {
  const _arr = [...arr];
  interface IMatch {
    value: number;
    repeatIndexs: number[];
  }
  let testArr: number[] = [];
  let matchArr: IMatch[] = [];
  _arr.forEach((value, index) => {
    if (testArr[value] !== undefined) {
      //如果已存在testArr
      const indexInMatch = matchArr.findIndex(item => item.value === value);
      if (indexInMatch !== -1) {
        //看是否已存在match
        matchArr[indexInMatch].repeatIndexs.push(index); //push index
      } else {
        matchArr.push({
          //不存在則push
          value: value,
          repeatIndexs: [testArr[value], index] //第一次出現的index 跟第二次出現的index
        });
      }
    } else {
      //如果不存在testArr
      testArr[value] = index;
    }
  });
  if (matchArr.length === 0) {
    return -1;
  }
  const compareSecondIndex = (itemA:IMatch,itemB:IMatch)=>{
    return itemA.repeatIndexs[1] -itemB.repeatIndexs[1] 
  }
  return matchArr.sort(compareSecondIndex)[0].value
}
