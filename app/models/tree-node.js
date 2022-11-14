import Model, { attr, belongsTo } from '@ember-data/model';

export default class TreeNodeModel extends Model {
  @attr('number') x;
  @attr('number') y;
  @attr('string') nodeType;
  @attr('string') ref;
  @attr('string') desc;
  @belongsTo('fault-tree', { async: true, inverse: 'nodes' }) faultTree;
}
