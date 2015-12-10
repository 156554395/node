var http = require('http');
var https=require('https');
var url = require('url');
http.createServer(function(req, res) {

    var params = url.parse(req.url, true),xy=http,currentUrl=params.query.url;
    if(/^https/.test(currentUrl)){
        xy=https;
    }
    var IMGS = new imageServer(xy);
    IMGS.http(currentUrl, function(data) {
        res.writeHead(200, {"Content-Type": data.type});
        res.write(data.body, "binary");
        res.end();
    });

}).listen(8124);

var imageServer = function(http) {
    this.http = function(url, callback) {
        callback = callback || function() {};
        var request = http.request(url);
        request.end();
        request.on('response', function(response) {
            var type = response.headers["content-type"],
                body = "";
            response.setEncoding('binary');
            response.on('end', function() {
                var data = {
                    type: type,
                    body: body
                };
                callback(data);

            });
            response.on('data', function(chunk) {
                if (response.statusCode == 200) body += chunk;
            });
        });

    };
};