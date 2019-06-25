const fs = require('fs')
const client = require('shodan-client');
const apiKey = 'you shodan api key';

const searchOpts = {
  facets: 'port:10001'
};

// a função main é a responsavel por fazer a requisição ao shodan
const main = () => {
    client
        .search('I20100', apiKey, searchOpts)
        //pegando 
        .then(res => {
            result = res.matches.forEach(item => {
            fs.appendFile('hosts.txt', `${item['ip_str']}\n`, (err) => {
                if (err) throw err;
            });
        })
        console.log("[*] Done!")
    })
  
    .catch(err => {
        console.log(err);
    });
}

// Verificando se o arquivo "hosts.txt" existe, se existir 
// será deletado e criado um novo contendo os novos hosts
fs.open('hosts.txt', 'r', (err, fd) => {
    if (err) {
        if (err.code === 'ENOENT') {
            console.error("[*] Arquivo 'hosts.txt' não existe, será criado um agora para guardar os hosts que serão retornados a partir da consulta ao shodan.")
            main()
        }
    } else {
        console.log("O arquivo 'hosts.txt' já existe, será deleta-lo para criar um novo para guardar os hosts que serão retornados agora")
        
        // Deletando o arquivo hosts.txt e chamando a função main(que irá criar outro "hosts.txt")
        fs.unlink('hosts.txt', (err) => {
            if (err) throw err;
            console.log('hosts.txt deletado com sucesso, iremos agora criar outro com os hosts da próxima consulta');
        });
        main()
    }
});
