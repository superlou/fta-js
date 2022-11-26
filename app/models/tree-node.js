import Model, { attr, belongsTo } from '@ember-data/model';

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
  
  get probability() {
    if (this.nodeType == "basic-event") {
      return 1 - Math.exp(-this.failureRate * this.exposureTime);
    } else if (this.minCutSets) {
      return this.faultTree.probFromMCS(this.minCutSets);
    }
    
    return null;
  }
}
