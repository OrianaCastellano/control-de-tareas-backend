const   app = require('./src/app'),
        server = require('http').Server(app),
        port = 3000;

server.listen(port, () => {
  console.log(`Server running in http://localhost:${ port }`);
})
