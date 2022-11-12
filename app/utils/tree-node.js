import { tracked } from '@glimmer/tracking';
import { v4 as uuidv4 } from 'uuid';

export default class TreeNode {
  @tracked x;
  @tracked y;
  @tracked nodeType;
  @tracked ref;

  constructor(nodeType, ref, x, y) {
    this.id = uuidv4();
    this.nodeType = nodeType;
    this.ref = ref;
    this.x = x;
    this.y = y;
  }
}
