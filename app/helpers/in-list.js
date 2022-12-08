import { helper } from '@ember/component/helper';

export default helper(function inList(positional /*, named*/) {
  return positional.slice(1).includes(positional[0]);
});
