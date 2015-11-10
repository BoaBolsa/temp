var express = require('express');
var request = require('request');

var app = express();

app.get('/Cotacao.aspx', function(req, res) {

        console.log(req.query);

        request.post('http://bmf.chromestudio.com.br/server/api/acoes.php',
                        { form: { e: 'pontos', codigo: req.query.codigoAcao } },
                        function(error, response, body) {
				
				var data = JSON.parse(body);
				if (data.err != 0) 
					console.log(data);
				
				var funcao = req.query.funcao || "preco";
				var ret = '';
				switch(funcao)
				{
					case "variacao":
					case "oscilacao":
						ret = data.desc.oscilacao;
						break;
					case "maxima":
					case "maximo":
						ret = data.desc.maxima;
						break;
					case "minima":
					case "minimo":
						ret = data.desc.minima;
						break;
					case "abertura":
						ret = data.desc.abertura;
						break;
					case "nome":
						ret = data.desc.nome;
						break;

					default:
						ret = data.desc.ultima;
				}
                                res.end(ret);
                        });

});

app.listen(3000);
