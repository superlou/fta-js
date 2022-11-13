import Model, { attr, hasMany } from '@ember-data/model';

export default class FaultTreeModel extends Model {
  @hasMany('tree-node', { async: false, inverse: null }) nodes;
  @hasMany('tree-edge', { async: false, inverse: null }) edges;
}
