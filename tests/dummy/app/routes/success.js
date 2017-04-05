import Ember from 'ember'

export default Ember.Route.extend({
  validatePage() {
    return new Ember.RSVP.Promise((resolve) => {
      const $container = Ember.$('body')
      resolve($container.length > 0)
    })
  }
});
