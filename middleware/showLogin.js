import jwt_decode from "jwt-decode";

export default(context) => {
  if(process.client) {
    const token = context.$cookiz.get('token');
    if(!token) {
      context.$cookiz.remove('token');
      context.$cookiz.remove('user');
      context.$auth0Lock.show()
    }
    else {
      const decoded = jwt_decode(token);
      if(decoded.exp * 1000 < new Date().getTime()) {
        context.$cookiz.remove('token');
        context.$cookiz.remove('user');
        context.$auth0Lock.show()
      }
    }
  }
}