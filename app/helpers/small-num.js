import { helper } from '@ember/component/helper';

export default helper(function smallNum(positional /*, named*/) {
  let num = parseFloat(positional[0]);

  let asFraction = num.toPrecision(3);

  if (asFraction.length < 7) {
    return asFraction;
  } else {
    return num.toExponential(2);
  }
});
