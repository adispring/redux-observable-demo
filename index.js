const { createStore, applyMiddleware } = require('redux')
const { ofType, createEpicMiddleware } = require('redux-observable')
const { filter, delay, mapTo } = require('rxjs/operators')

const PING = 'PING'
const PONG = 'PONG'

const ping = () => ({ type: PING })
const pong = () => ({ type: PONG })

const pingEpic = action$ =>
  action$.pipe(
    ofType(PING),
    delay(1000), // Asynchronously wait 1000ms then continue
    mapTo(pong())
  )

const pingReducer = (state = { isPinging: false }, action) => {
  switch (action.type) {
    case 'PING':
      return { isPinging: true }

    case 'PONG':
      return { isPinging: false }

    default:
      return state
  }
}

const epicMiddleware = createEpicMiddleware()

const store = createStore(pingReducer, applyMiddleware(epicMiddleware))

epicMiddleware.run(pingEpic)

/**
 * This is using raw HTML + redux.
 *
 * You will most likely use some sort of UI framework
 * like React, Angular, etc
 */
const renderApp = () => {
  const { isPinging } = store.getState();
  console.log(`isPinging: ${isPinging}`)
}

store.subscribe(renderApp)
store.dispatch(ping())
