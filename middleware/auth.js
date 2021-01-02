//TODO: add this to all pages with required authentication
import jwt_decode from "jwt-decode";

export default(context) => {
  const token = context.$cookiz.get('token');
  if(!token) {
    console.log('jwt is not available');
    context.$cookiz.remove('token');
    context.$cookiz.remove('user');
    context.redirect('/');
  }
  else {
    const decoded = jwt_decode(token);
    if(decoded.exp * 1000 < new Date().getTime()) {
      context.$cookiz.remove('token');
      context.$cookiz.remove('user');
      context.redirect('/')
    }
  }
}