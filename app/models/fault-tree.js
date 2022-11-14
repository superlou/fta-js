import Model, { attr, hasMany } from '@ember-data/model';

export default class FaultTreeModel extends Model {
  @hasMany('tree-node', { async: true, inverse: 'faultTree' }) nodes;
  @hasMany('tree-edge', { async: true, inverse: 'faultTree' }) edges;
}
