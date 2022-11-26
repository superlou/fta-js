import Model, { belongsTo } from '@ember-data/model';

export default class TreeEdgeModel extends Model {
  @belongsTo('fault-tree', { async: false, inverse: 'edges' }) faultTree;
  @belongsTo('tree-node', { async: false, inverse: null }) child;
  @belongsTo('tree-node', { async: false, inverse: null }) parent;
}
