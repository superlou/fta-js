import Model, { belongsTo } from '@ember-data/model';

export default class TreeEdgeModel extends Model {
  @belongsTo('fault-tree', { async: true, inverse: 'edges' }) faultTree;
  @belongsTo('tree-node', { async: true, inverse: null }) child;
  @belongsTo('tree-node', { async: true, inverse: null }) parent;
}
