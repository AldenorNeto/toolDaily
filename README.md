# Cronograma de Estudos

Este projeto é uma aplicação para gerar e visualizar um cronograma de estudos a partir de arquivos HTML salvos de páginas de matérias. O projeto usa Node.js e inclui scripts para gerar um arquivo JSON a partir dos arquivos HTML e para iniciar um servidor para visualizar o cronograma gerado.

## Estrutura do Projeto

```lua
|-- generateD/
  |-- indices
  |-- assenbleJson.js
|-- showD/
  |-- agenda.json
  |-- index.html
  |-- server.js
|-- .gitignore
|-- package-lock.json
|-- package.json
```

### Descrição das Pastas e Arquivos

- `generateD/`: Contém scripts para gerar o arquivo JSON a partir dos arquivos HTML salvos.
    - `indices/`: Pasta onde os arquivos HTML das matérias devem ser salvos.
    - `assenbleJson.js`: Script que gera o arquivo `agenda.json` a partir dos arquivos HTML.
- `showD/`: Contém a aplicação que serve o cronograma gerado.
    - `agenda.json`: Arquivo JSON gerado que contém os dados das matérias.
    - `index.html`: Página principal da aplicação.
    - `server.js`: Servidor Express que serve a página `index.html` na porta 5550.
- `.gitignore`: Arquivo que especifica quais arquivos e pastas devem ser ignorados pelo Git.
- `package-lock.json`: Arquivo gerado automaticamente para gerenciar as dependências do projeto.
- `package.json`: Arquivo de configuração do projeto, que inclui scripts e dependências.

## Configuração do Ambiente

1. **Clone o repositório:**
    
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd cronograma-de-estudos
    ```
    
2. **Instale as dependências:**
    
    ```bash
    npm install
    ```
    

## Instruções de Uso

### Salvando Páginas HTML

1. Acesse os sites das matérias que deseja incluir no cronograma.
2. Para cada matéria, salve a página HTML pressionando `Ctrl + S` e salve o arquivo na pasta `generateD/indices`.

### Gerando o Arquivo JSON

Após ter salvo todos os arquivos HTML:

1. Execute o seguinte comando para gerar o arquivo `agenda.json`:
    
    ```bash
    npm run generate
    ```
    
    Este comando executa o script `assenbleJson.js` que processa os arquivos HTML e gera o arquivo JSON necessário.
    

### Iniciando o Servidor

Para iniciar a aplicação e visualizar o cronograma gerado:

1. Execute o seguinte comando para iniciar o servidor na porta 5550:
    
    ```bash
    npm run start
    ```
    
    O servidor estará disponível em http://localhost:5550.
    

### Scripts Disponíveis

- `npm run generate`: Gera o arquivo `agenda.json` a partir dos arquivos HTML na pasta `indices`.
- `npm run dev`: Inicia o servidor em modo de desenvolvimento.
- `npm run start`: Inicia o servidor usando PM2 para gerenciamento de processos.
- `npm run stop`: Para o servidor PM2.
- `npm run delete`: Remove o servidor PM2.

## Dependências

O projeto utiliza as seguintes dependências:

- `express`: Framework para criar o servidor web.
- `jsdom`: Biblioteca para manipulação de arquivos HTML.
- `pm2`: Gerenciador de processos para aplicações Node.js.
- `uuid`: Biblioteca para geração de identificadores únicos.