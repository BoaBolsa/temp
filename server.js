var express = require('express');
var request = require('request');

var app = express();

app.get('/Cotacao.aspx', function(req, res) {

        console.log(req.query);

        request.post('http://bmf.chromestudio.com.br/server/api/acoes.php',
                        { form: { e: 'pontos', codigo: req.query.codigoAcao } },
                        function(error, response, body) {
                                console.log(response);
                                console.log(body);
                                res.end(body);
                        });

});

app.listen(3000);
