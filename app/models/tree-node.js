import Model, { attr, belongsTo } from '@ember-data/model';

export default class TreeNodeModel extends Model {
  @attr('number') x;
  @attr('number') y;
  @attr('string') nodeType;
  @attr('string') ref;
  @attr('string') desc;
  @attr('number') failureRate;
  @attr('number') exposureTime;
  @belongsTo('fault-tree', { async: true, inverse: 'nodes' }) faultTree;
  
  get probability() {
    if (this.nodeType == "basic-event") {
      return this.failureRate * this.exposureTime;
    }
    
    return null;
  }
}
