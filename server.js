var express = require('express');
var request = require('request');
var xml = require('node-xml-lite');
var ua = require('universal-analytics');

var visitor = ua('UA-21801676-1');

var app = express();

app.use(function(req, res, next) {
    for (var key in req.query) { 
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
});


function getpost(req, res) {

    console.log(req.query);

    var funcao = req.query.funcao || req.query.Funcao || "preco";
    var codigoAcao = req.query.codigoAcao || req.query.CodigoAcao || req.query.codigoacao;

    var regex = new RegExp(/\d{4}-\d{2}-\d{2}/);
    if(regex.test(funcao)) {
        var date = funcao.split('-');

        request.get('http://ichart.finance.yahoo.com/table.csv?s=' + codigoAcao + '.SA&a=' + 
                (parseInt(date[1]) - 1) + '&b=' +date[2] + '&c=' + date[0] + '&d=' + (parseInt(date[1]) - 1) + 
                '&e=' + date[2] + '&f=' +date[0] + '&g=d',
                function(error, response, body) {
                    var r = body.split('\n')[1].split(',');
                    console.log(body);
                    res.end(r[4]);
                });
    }

    request.get('https://www.google.com/finance/getprices?x=BVMF&q=' + codigoAcao,
            {  },
            function(error, response, body) {

            console.log(body);
            var lines = body.split('\n');
            console.log(lines);
            var last = lines[lines.length - 2];
            console.log(last);

            if (last == "DATA=")
            {
                res.end("");
                return;
            }    

            var columns = last.split(',');
            var ret = '';
            var a =  data.childs[1].attrib;
            switch(funcao)
            {
                case "variacao":
                case "oscilacao":
                    ret = "";
                    break;
                case "maxima":
                case "maximo":
                    ret = columns[2];
                    break;
                case "minima":
                case "minimo":
                    ret = columns[3];
                    break;
                case "abertura":
                    ret = columns[4];
                    break;
                case "nome":
                    ret = "";
                    break;
                case "strike":
                    ret = "";
                    break;
                case "json":
                    ret = "";
                    break;
                case "volume":
                    ret = columns[5];
                    break;
                default:
                    ret = columns[1];
            }
            res.end(ret);
        });
}

app
    .get('/Cotacao.aspx', getpost)
    .post('/Cotacao.aspx', getpost);

app.listen(process.env.PORT || 3000);
