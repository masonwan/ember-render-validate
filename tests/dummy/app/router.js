import Ember from 'ember'
import config from './config/environment'

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function() {
  this.route('failure');
  this.route('success');
  this.route('no-validate-page');
  this.route('wrong-validate-page');
  this.route('long-validation');
});

export default Router;
