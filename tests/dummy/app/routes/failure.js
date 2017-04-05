import Ember from 'ember'

export default Ember.Route.extend({
  model(params) {
    return {
      name: params.name,
      params,
    }
  },

  validatePage() {
    return new Ember.RSVP.Promise((resolve) => {
      // .container does not exist, should return false.
      const $container = Ember.$('.container')
      resolve($container.length > 0)
    })
  }
});
