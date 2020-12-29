export default (context) => {
  return {
    httpEndpoint: 'https://supreme-chipmunk-45.hasura.app/v1/graphql',

    /*
     * For permanent authentication provide `getAuth` function.
     * The string returned will be used in all requests as authorization header
     */
    getAuth: () => {
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem('token')
      // TODO: " should not exist in token at all
      // return the headers to the context so httpLink can read them
      return `Bearer ${token.replace(/"/g, '')}` || ''
    },
  }
}