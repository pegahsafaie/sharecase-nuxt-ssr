//TODO: add this to all pages with required authentication
export default({ store, redirect }) => {
  if(!store.getters.isAuthenticated) {
    redirect('/')// TODO: redirect to login page;
  }
}