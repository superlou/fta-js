import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BuilderRoute extends Route {
  @service store;

  async model() {
    await this.store.findAll('tree-node');
    await this.store.findAll('tree-edge');
    return this.store.findAll('fault-tree');
  }
}
