import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BuilderRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('fault-tree', params.fault_tree_id);
  }
}
