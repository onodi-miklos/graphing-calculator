function round(number: number, accuracy: number): number {
  if (number == undefined || accuracy == undefined) {
    throw new Error('Fuction takes two numbers as arguments.')
  }
  if (typeof(number) !== 'number') {
    throw new Error('Function only accepts a number as arg. "number".')
  }
  if (typeof(accuracy) !== 'number' || (accuracy % 1 !== 0 && accuracy < 0)) {
    throw new Error('Function only accepts a non-negative integer as arg. "accuracy".')
  }
  const string: string = String(number);
  const index: number = string.indexOf(".");
  let rounded: number = Number(string.slice(0, index + accuracy + string.length));
  if (accuracy === 0) {
    rounded = Number(string.slice(0, accuracy+string.length ))
  }
  return rounded;
}

export {round}