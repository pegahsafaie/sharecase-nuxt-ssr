//TODO: add this to all pages with required authentication
export default(context) => {
  if(process.client && !context.store.getters.isAuthenticated) {
  console.log('auth middleware called from client');
    context.$auth0Lock.show()
  } else {
    console.log('log from sever', context.req.headers.cookie);
    context.redirect('/')
  }
}