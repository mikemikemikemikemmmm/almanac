import question2 from "../question2";
describe("test question2", () => {
  //@ts-ignore
  global.alert = jest.fn();
  //@ts-ignore
  const mockAlert = global.alert;
  beforeEach(() => {
    mockAlert.mockReset();
  });
  test("return value should be 6", () => {
    const testArr = [2, 4, 6, 6, 7, 8, 5, 6, 2];
    expect(question2(testArr)).toBe(6);
  });
  test("return value should be 4", () => {
    const testArr = [2, 4, 6, 9, 7, 8, 5, 4, 2];
    expect(question2(testArr)).toBe(4);
  });
  test("return value should be -1", () => {
    const testArr = [2, 4, 6, 9, 7, 8, 5];
    expect(question2(testArr)).toBe(-1);
  });
  test("0 value in input should alert", () => {
    const testArr = [2, 0, 6];
    question2(testArr);
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });
  test("<0 value in input should alert", () => {
    const testArr = [2, -2, 6];
    question2(testArr);
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });
  test("string value in input should alert", () => {
    const testArr = [2, "popo", 6];
    //@ts-ignore
    question2(testArr);
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });
});
