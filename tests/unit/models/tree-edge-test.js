import { module, test } from 'qunit';
import { setupTest } from 'fta-js/tests/helpers';

module('Unit | Model | tree edge', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('tree-edge', {});
    assert.ok(model);
  });
});
