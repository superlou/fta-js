import { modifier } from 'ember-modifier';

export default modifier(function focusIfNamed(element, [selected, toMatch]) {
  if (selected === element.name) {
    element.focus();
  };
});
