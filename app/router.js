import EmberRouter from '@ember/routing/router';
import config from 'fta-js/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('builder', { path: '/builder/:fault_tree_id' });
  this.route('builders');
});
