import Ember from 'ember'

const Status = {
  INITIALIZING: 'initializing',
  VALIDATING: 'validating',
  NO_VALIDATION: 'no-validation',
  DONE: 'done',
}

const Result = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  ERROR: 'error',
}

export function initialize(appInstance) {

  window._renderValidator = {
    status: Status.INITIALIZING,
    result: undefined,
    error: undefined,
  }

  Ember.run(() => {
    window._renderValidator.status = Status.VALIDATING

    const currentPath = appInstance.lookup('router:main').currentPath
    const route = appInstance.lookup(`route:${currentPath}`)

    let validatePage = route.validatePage
    if (!validatePage) {
      window._renderValidator.status = Status.NO_VALIDATION
      return
    }

    if (typeof validatePage !== 'function') {
      setupForError(new Error(`"validatePage" is not a method but "${validatePage.constructor}".`))
      return
    }

    let promise
    try {
      promise = validatePage((err, isSuccessful) => {
        if (err) {
          setupForError(err)
          return
        }
        setupForResult(isSuccessful)
      })
    } catch (err) {
      setupForError(err)
      return
    }

    if (promise == null) {
      // `validatePage` is using callback style.
      return
    }

    if (typeof promise.then === 'function' && typeof promise.catch === 'function') {
      promise
        .then((isSuccessful) => {
          setupForResult(isSuccessful)
        })
        .catch((err) => {
          setupForError(err)
        })
      return
    }

    throw new Error(`Failed to validate the page. The returned object of \`validatePage\` does not look like a Promise, but "${promise}"`)
  })

  function setupForResult(isSuccessful) {
    window._renderValidator.status = Status.DONE
    window._renderValidator.result = isSuccessful ? Result.SUCCESS : Result.FAILURE
  }

  function setupForError(err) {
    window._renderValidator.status = Status.DONE
    window._renderValidator.result = Result.ERROR
    window._renderValidator.error = err
  }
}

export default {
  name: 'render-validator',
  initialize,
}