# Filmes IMDB
#### Criado por: Anne Carine
Um aplicativo da web de banco de dados de filmes baseado no IMDB, onde você pode navegar e pesquisar filmes, adicioná-los à sua lista de observação, adicioná-los aos favoritos ou deixar comentários.


## Instalação
### API do banco de dados de filmes
1. Inscreva-se com a API do Movie DB e obtenha aprovação para uma chave de API
2. Navegue até o arquivo "keys.js" da pasta /client/config/ e adicione sua chave de API
### Server
1. Faça login no seu banco de dados MySQL local
2. Criar um banco de dados
3. Navegue até a pasta /server/config/, vai no arquivo "db_config.js" e substitua o nome do banco de dados, nome de usuário e senha por suas próprias credenciais
4.Abra o terminal, navegue até a pasta /server/ e execute o seguinte comando
```bash
cd back-end
```
```bash
yarn add 
```
5. Após a instalação de todos os pacotes, ainda no diretório /server/, execute os seguintes comandos nesta ordem
```bash
knex migrate:rollback
```
 ```bash
knex migrate:latest
```
 ```bash
knex seed:run
```
6. Quando todas as migrações e sementes forem concluídas, você poderá iniciar o servidor executando o seguinte comando. 
 ```bash
yarn run dev 
```
Depois de concluído, você verá a mensagem "Server is running on port 7070" no terminal.

#### Nodemailer
Para fazer o nodemailer funcionar, navegue até a pasta /server/config/ "mailer_config.js" substitua as credenciais por suas próprias credenciais do Gmail. Use um gmail apenas para fins de teste e verifique se a configuração de segurança "permitir aplicativos menos seguros" está ativada nas configurações do gmail.

### Front-end
1. Em seu IDE, navegue até a pasta /front-end/ e execute os seguintes comandos nesta ordem
 ```bash
 cd front-end 
 ```
 ```bash
yarn add
```
 ```bash
yarn start
```

O projeto já está funcionando! 