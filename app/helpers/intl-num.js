import { helper } from '@ember/component/helper';

export default helper(function IntlNum([value]) {
  return new Intl.NumberFormat('en-US').format(value);
});
