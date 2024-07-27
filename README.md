# Cronograma de Estudos

Este projeto é uma aplicação para gerar e visualizar um cronograma de estudos a partir de arquivos HTML salvos de páginas de matérias. O projeto usa Node.js e inclui scripts para gerar um arquivo JSON a partir dos arquivos HTML e para iniciar um servidor para visualizar o cronograma gerado.

## Instalação

1. Clone este repositório para o seu diretório local;
2. Navegue até o diretório do projeto;
3. Instale as dependências do projeto:
    
    ```bash
    npm install
    ```
    

## Como Usar

### Passo 1: Salvar Páginas

Para mapear as atividades de suas matérias, siga os passos abaixo:

1. Abra a página web da matéria que deseja mapear em seu navegador.
   <div><img src="https://github.com/user-attachments/assets/4ba472b8-d988-41ec-86ac-4be3938d61a1"/><div/>
2. Pressione **Ctrl + S** ou **Cmd + S** (no macOS) para salvar a página.
3. Escolha o diretório `gen/indices` dentro do repositório que você clonou.
   <div><img src="https://github.com/user-attachments/assets/536cfb27-52b0-497b-bafc-7a0e51cf41c7"/><div/>
  
4. Salve a página web com o nome correspondente à matéria. **Repita este passo para cada matéria** que deseja incluir no cronograma.

### Passo 2: Gerar JSON

Depois de salvar as páginas desejadas, você precisa gerar o arquivo JSON que a aplicação utilizará:

1. Execute o seguinte comando no terminal para gerar os arquivos JSON:
    
    ```bash
    npm run gen
    ```
    
    Este comando processará todas as páginas salvas e criará um arquivo JSON com as informações organizadas.
    

### Passo 3: Iniciar Aplicação

Por fim, inicie a aplicação para visualizar o cronograma:

1. Execute o comando abaixo no terminal:
    
    ```bash
    npm run start
    ```
    
2. Abra o navegador e acesse http://localhost:5550 para visualizar o cronograma com as informações de suas matérias.