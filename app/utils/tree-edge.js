import { tracked } from '@glimmer/tracking';

export default class TreeEdge {
  @tracked start;
  @tracked finish;

  constructor(id, start, finish) {
    this.id = id;
    this.start = start;
    this.finish = finish;
  }
}
