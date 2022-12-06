import { module, test } from 'qunit';
import { setupRenderingTest } from 'fta-js/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | upload', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Upload />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Upload>
        template block text
      </Upload>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
