const isAuthenticated = () =>
  window.localStorage.getItem('isAuthenticated') === 'true'

const setIsAuthenticated = () =>
  window.localStorage.setItem('isAuthenticated', 'true')

const getAccessToken = () => window.localStorage.getItem('accessToken')

const setAccessToken = (value: string) =>
  window.localStorage.setItem('accessToken', value)

const deleteAll = () => {
  window.localStorage.removeItem('isAuthenticated')
  window.localStorage.removeItem('accessToken')
}

export const localStorage = {
  isAuthenticated,
  setIsAuthenticated,
  getAccessToken,
  deleteAll,
  setAccessToken,
}
