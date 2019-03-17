const endpoints = {};
endpoints.base = 'https://connectbuddy.herokuapp.com';
endpoints.register = endpoints.base + '/api/v1/user/register';
endpoints.login = endpoints.base + '/api/v1/user/login';
endpoints.getProfile = endpoints.base + '/api/v1/user/profile';
endpoints.updateProfile = endpoints.base + '/api/v1/user/profile';
module.exports = endpoints;