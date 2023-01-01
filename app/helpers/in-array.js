import { helper } from '@ember/component/helper';

export default helper(function inArray(positional /*, named*/) {
  return positional[1].includes(positional[0]);
});
