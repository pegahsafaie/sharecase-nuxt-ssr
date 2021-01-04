import jwt_decode from "jwt-decode";

export default(context) => {
  const token = context.$cookiz.get('token');
  if(process.client) {
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
  } else {
      if(!token) {
        context.$cookiz.remove('token');
        context.$cookiz.remove('user');
      }
      else {
        const decoded = jwt_decode(token);
        if(decoded.exp * 1000 < new Date().getTime()) {
          context.$cookiz.remove('token');
          context.$cookiz.remove('user');
        }
      }
  }
}