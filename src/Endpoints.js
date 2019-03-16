const endpoints = {};
endpoints.base = 'https://connectbuddy.herokuapp.com';
endpoints.register = endpoints.base + '/api/v1/user/register';
endpoints.login = endpoints.base + '/api/v1/user/login';
module.exports = endpoints;