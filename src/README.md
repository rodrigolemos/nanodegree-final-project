# Neighborhood Map Project

Projeto construido para o [Udacity's Front-End Developer nanodegree](https://www.udacity.com/course/front-end-web-developer-nanodegree--nd001).

O objetivo do projeto é utilizar React, a API do Google Maps e dados de APIs de terceiros para criar uma aplicação web do zero. O app apresenta 15 recomendações de pizzarias, padarias e restaurantes no bairro da Liberdade, em São Paulo - SP.
Uma lista com os itens da consulta da API é exibida à esquerda juntamente com um campo de texto para a inclusão de filtros. Ao filtrar os resultados, os marcadores correspondentes são exibidos no mapa. O app também é responsivo, acessível e progressivo.


## Inicialização

Para executar o app:

1. Baixe ou clone este repositório;
2. Instale todas as dependências do projeto com `npm install`
3. *Development Mode:* Inicie o servidor de desenvolvimento com `npm start`
4. *Production Mode:* Crie o build de produção com `npm run build`, que pode então ser executado apontando um servidor web no diretório `build` (por exemplo, `serve -s build`) e sendo inicializado pelo browser.

Observe que a funcionalidade off-line do aplicativo está disponível apenas no modo de produção. Isso armazena em cache o app boilerplate usando o service worker fornecido com o Create React App. Os dados da API e dados do mapa são mostrados apenas quando há uma conexão de rede, para evitar a violação de quaisquer termos de serviço.

## Recursos adicionais utilizados
- [Foursquare API](https://developer.foursquare.com/)

## Autor

Rodrigo Lemos
