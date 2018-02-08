var config = {
    'jwt': {
        'secret': 'thisisasecret', // your jwt secret
        'expireTime': 60 * 60 // 1 hour
    },
    'mongodb': {
        'path': 'mongodb://localhost/example'   // your db path
    }
};

module.exports = config;