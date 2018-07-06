const express = require('express');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send('OK!');
});

require('./controllers/authController')(app);
require('./controllers/projectController')(app);

var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;
    
    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) return;        
        if (alias >= 1)
            console.log(ifname + ':' + alias, iface.address);
        else
            console.log(ifname, iface.address);
        ++alias;
    });
});
console.log("Listen on port 3001")

app.listen(3001);