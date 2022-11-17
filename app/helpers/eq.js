import { helper } from '@ember/component/helper';

export default helper(function eq(positional) {
  return positional[0] === positional[1];
});
