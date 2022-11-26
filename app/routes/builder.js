import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BuilderRoute extends Route {
  @service store;

  async model(params) {
    // Fetch related models manually so that the relationship doesn't have to be async
    await this.store.query('tree-edge', {
      filter: { 'fault-tree': params.fault_tree_id },
    });
    await this.store.query('tree-node', {
      filter: { 'fault-tree': params.fault_tree_id },
    });
    return this.store.findRecord('fault-tree', params.fault_tree_id);
  }
}
