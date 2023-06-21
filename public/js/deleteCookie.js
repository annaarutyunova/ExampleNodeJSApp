// Resources https://blog.devgenius.io/how-to-delete-a-client-side-cookie-with-javascript-66c8999096f1
const getCookie = (name) => {
    return document.cookie.split(';').some(c => {
      return c.trim().startsWith(name + '=');
    });
  }
const deleteCookie = (name, path, domain) => {
if (getCookie(name)) {
    document.cookie = name + "=" +
    ((path) ? ";path=" + path : "") +
    ((domain) ? ";domain=" + domain : "") +
    ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}
  
deleteCookie('jwt')