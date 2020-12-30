export default (context) => {
  return {
    httpEndpoint: 'https://supreme-chipmunk-45.hasura.app/v1/graphql',
    httpLinkOptions: {
      headers:{
        // we need this password for the firs static build on server before login
        // the password will not be delivered to the client
        'X-Hasura-Admin-Secret': context.$cookiz.get('token') ? '' : context.$config.ADMIN_SECRET
      }
    },
    /*
     * For permanent authentication provide `getAuth` function.
     * The string returned will be used in all requests as authorization header
     */
    getAuth: () => {
        // the commented code below is the exact way that nuxt module cookiz! use to extract the universal cookie 'token'
        // just added here to see there is no magic in universal storage!
        /*const getHeaders = () => {
          if(!process.client) {
            const allHeaders = context.req.headers;
            return allHeaders.cookie;
          } else {
            return document.cookie;
          }
        }
        const get = (key, headers) => {
          const cookieList = headers.split(';')
          return cookieList.find(cookie => {
            console.log('cookie header ' + key, cookie)
            if(cookie.split('=')[0].trim() === key) {
              const token = cookie.split('=')[1]
              console.log('token', token);
              return token;
            }
          });
        }
        const cookies = getHeaders()
        const token = get('token', cookies)
        console.log('universal token, egal client or server!', token);
        */
        return context.$cookiz.get('token') ? `Bearer ${context.$cookiz.get('token')}` : ''
    }
  }
}