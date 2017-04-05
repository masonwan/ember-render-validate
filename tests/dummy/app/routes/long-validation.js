import Ember from 'ember'

export default Ember.Route.extend({
  validatePage() {
    return new Ember.RSVP.Promise((resolve) => {
      setTimeout(() => {
        resolve(true)
      }, 1000)
    })
  }
})
