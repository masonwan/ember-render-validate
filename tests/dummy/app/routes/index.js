import Ember from 'ember'

export default Ember.Route.extend({
  validatePage(callback) {
    Ember.$.ajax({
      url: location.href,
      success: () => {
        callback(null, true)
      },
    })
  },
})
