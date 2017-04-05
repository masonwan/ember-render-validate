import Ember from 'ember'

export default Ember.Route.extend({
  name: "God",
  validatePage: Ember.computed('name', function() {
    return `Mr. ${this.get('name')}`
  })
});
