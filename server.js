var express = require('express');
var request = require('request');

var app = express();

app.use(function(req, res, next) {
  for (var key in req.query)
  { 
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

        request.post('http://bmf.chromestudio.com.br/server/api/acoes.php',
                        { form: { e: 'pontos', codigo: codigoAcao } },
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
					case "strike":
						ret = data.desc.nome.split(" ").pop();
						break;
					default:
						ret = data.desc.ultima;
				}
                                res.end(ret);
                        });

}

app
	.get('/Cotacao.aspx', getpost)
	.post('/Cotacao.aspx', getpost);

app.listen(process.env.PORT || 3000);
