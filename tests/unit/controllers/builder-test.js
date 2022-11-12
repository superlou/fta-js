import { module, test } from 'qunit';
import { setupTest } from 'fta-js/tests/helpers';

module('Unit | Controller | builder', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:builder');
    assert.ok(controller);
  });
});
