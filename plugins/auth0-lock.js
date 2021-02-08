import Auth0Lock from 'auth0-lock';
const lock = new Auth0Lock(
  process.env.AUTH0_CLIENT_ID,
  process.env.AUTH0_DOMAIN,
  {
    languageDictionary: {
      title: "Share Cafe",
    },
    theme: {
      logo: "https://res.cloudinary.com/pegah/image/upload/q_auto, f_jpg/v1612819572/ladybug.png",
    },
    auth: {
      redirectUrl: process.env.AUTH0_REDIRECT, // If not specified, defaults to the current page
      responseType: 'token id_token',
    }
  }
)

export default (ctx, inject) => {
  let silentCheck = null

  lock.on('authenticated', (authResult) => {
    ctx.store.dispatch("user/login", { token: authResult.idToken, user_id: authResult.idTokenPayload.sub })
  })

  if(ctx.$cookiz.get('user') && ctx.$cookiz.get('token')) {
    ctx.store.dispatch("user/login", { token: ctx.$cookiz.get('token'), user: ctx.$cookiz.get('user') })
  }

  inject('auth0Lock', {
    instance: lock,

    show () {
      lock.show()
    },

    hide () {
      lock.hide()
    },

    checkSession (options) {
      return new Promise((resolve, reject) => {
        lock.checkSession(options || {}, (err, authResult) => {
          if (err || !authResult) return reject(err || new Error('No auth result'))

          resolve(authResult)
        })
      })
    },

    silentCheck (next, time) {
      if (silentCheck) clearTimeout(silentCheck)

      silentCheck = setTimeout(() => {
        this.checkSession()
          .then(authResult => {
            if (next) next(authResult)

            this.silentCheck(next, time)
          })
          .catch(err => {
            if (err) console.log(err)
          })
      }, time || (15 * 60 * 1000))
    },

    getProfile (accessToken) {
      return new Promise((resolve, reject) => {
        lock.getUserInfo(accessToken, (err, profile) => {
          if (err) return reject(err)

          resolve(profile)
        })
      })
    },

    logout () {
      if (silentCheck) clearTimeout(silentCheck)

      /*lock.logout({
        returnTo: 'http://YOUR/RETURN_TO'
      })*/
      lock.logout()
    }
  })
}