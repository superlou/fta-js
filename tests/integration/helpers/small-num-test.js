import { module, test } from 'qunit';
import { setupRenderingTest } from 'fta-js/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | small-num', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.set('inputValue', 0.01);
    await render(hbs`{{small-num this.inputValue}}`);
    assert.dom(this.element).hasText('0.0100');    
    
    this.set('inputValue', 0.012345);
    await render(hbs`{{small-num this.inputValue}}`);
    assert.dom(this.element).hasText('0.0123');        
    
    this.set('inputValue', 0.00123);
    await render(hbs`{{small-num this.inputValue}}`);
    assert.dom(this.element).hasText('1.23e-3');
  });
});
