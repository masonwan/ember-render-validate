import Ember from 'ember'
import { initialize } from 'dummy/instance-initializers/render-validator'
import { module, test } from 'qunit'
import destroyApp from '../../helpers/destroy-app'
import sinon from 'sinon'

const Promise = Ember.RSVP
let lookupStub

module('Unit | Instance Initializer | render validator', {
  beforeEach() {
    lookupStub = sinon.stub()

    let router = {
      currentPath: 'currentPath',
      on: (eventName, callback) => {
        if (eventName === 'didTransition') {
          Ember.run(() => {
            callback()
          })
        }
      },
    }

    lookupStub
      .withArgs('router:main')
      .returns(router)

    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

test('set correct state when validatePage is not valid', function(assert) {
  lookupStub
    .withArgs('route:currentPath')
    .returns({
      validatePage: 'not a function',
    })

  initialize({
    lookup: lookupStub,
  });

  assert.strictEqual(window._renderValidator.status, 'done')
  assert.strictEqual(window._renderValidator.result, 'error')
  assert.ok(window._renderValidator.error)
});

test('set correct state when validatePage is empty', function(assert) {
  lookupStub
    .withArgs('route:currentPath')
    .returns({
      validatePage: undefined,
    })

  initialize({
    lookup: lookupStub,
  });

  assert.strictEqual(window._renderValidator.status, 'no-validation')
});

test('set correct state when validatePage fulfills true', function(assert) {
  lookupStub
    .withArgs('route:currentPath')
    .returns({
      validatePage: () => Promise.resolve(true),
    })

  initialize({
    lookup: lookupStub,
  });

  assert.strictEqual(window._renderValidator.status, 'done')
  assert.strictEqual(window._renderValidator.result, 'success')
});

test('set correct state when validatePage fulfills false', function(assert) {
  lookupStub
    .withArgs('route:currentPath')
    .returns({
      validatePage: () => Promise.resolve(false),
    })

  initialize({
    lookup: lookupStub,
  });

  assert.strictEqual(window._renderValidator.status, 'done')
  assert.strictEqual(window._renderValidator.result, 'failure')
});

test('set correct state when validatePage rejects', function(assert) {
  const error = new Error()
  lookupStub
    .withArgs('route:currentPath')
    .returns({
      validatePage: () => Promise.reject(error),
    })

  initialize({
    lookup: lookupStub,
  });

  assert.strictEqual(window._renderValidator.status, 'done')
  assert.strictEqual(window._renderValidator.result, 'error')
  assert.strictEqual(window._renderValidator.error, error)
});

test('set correct state when validatePage callbacks true', function(assert) {
  lookupStub
    .withArgs('route:currentPath')
    .returns({
      validatePage: (callback) => callback(null, true),
    })

  initialize({
    lookup: lookupStub,
  });

  assert.strictEqual(window._renderValidator.status, 'done')
  assert.strictEqual(window._renderValidator.result, 'success')
});

test('set correct state when validatePage callbacks false', function(assert) {
  lookupStub
    .withArgs('route:currentPath')
    .returns({
      validatePage: (callback) => callback(null, false),
    })

  initialize({
    lookup: lookupStub,
  });

  assert.strictEqual(window._renderValidator.status, 'done')
  assert.strictEqual(window._renderValidator.result, 'failure')
});
