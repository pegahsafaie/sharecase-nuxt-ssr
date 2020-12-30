export default ({ graphQLErrors, networkError, operation, forward }, nuxtContext) => {
  if (graphQLErrors) {
    const invalidJWT = graphQLErrors.find(({ message, extensions }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${extensions.code}`
      );
      return (extensions.code === 'invalid-jwt' || extensions.code === "invalid-headers")
    });
    if(invalidJWT) {
      nuxtContext.store.dispatch('user/logout');
    }
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
}