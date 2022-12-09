import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class TreeNodeModel extends Model {
  @attr('number') x;
  @attr('number') y;
  @attr('string') nodeType;
  @attr('string') ref;
  @attr('string') desc;
  @attr('number') failureRate;
  @attr('number') exposureTime;
  @attr minCutSets;
  @belongsTo('fault-tree', { async: false, inverse: 'nodes' }) faultTree;
  @hasMany('tree-edge', { async: false, inverse: 'child' }) childEdges;
  @hasMany('tree-edge', { async: false, inverse: 'parent' }) parentEdges;

  get edges() {
    return this.childEdges.concat(this.parentEdges);
  }

  get probability() {
    if (['basic-event', 'undeveloped-event'].includes(this.nodeType)) {
      return 1 - Math.exp(-this.failureRate * this.exposureTime);
    } else if (this.minCutSets) {
      return this.faultTree.probFromMCS(this.minCutSets);
    }

    return null;
  }
}
