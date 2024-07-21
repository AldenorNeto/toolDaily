const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 5550;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Agenda UNOPAR</title>
    <link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><text y=%2214%22 font-size=%2214%22>🗓️</text></svg>"
    />
    <link rel="stylesheet" href="/styles.css">
  </head>
  <body>
    <h1>
      Cronograma UNOPAR
      <button class="download-button" onclick="downloadPage()">
        Baixar Página
      </button>
    </h1>

    <div class="task-list">
      <h2>Tarefas Futuras</h2>
      <ol id="futureTasks"></ol>
    </div>
    <div class="task-list">
      <h2>Tarefas Atuais</h2>
      <ol id="currentTasks"></ol>
    </div>
    <div class="task-list">
      <h2>Tarefas Passadas</h2>
      <ol id="pastTasks"></ol>
    </div>

    <div class="schedule-container-wrapper">
      <h2>Cronograma</h2>
      <div class="container" id="scheduleContainer"></div>
    </div>

    <script src="/script.js"></script>
  </body>
</html>
  `;
  res.send(htmlContent);
});

app.get("/data", (_, res) => {
  fs.readFile("./showD/agenda.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo JSON:", err);
      return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/checked", (req, res) => {
  const { id, done } = req.body;

  fs.readFile("./showD/agenda.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo JSON:", err);
      return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
    }

    let agenda = JSON.parse(data);

    for (let course of agenda) {
      for (let task of course.task) {
        if (task.id === id) {
          task.done = done;
        }
      }
    }

    fs.writeFile(
      "./showD/agenda.json",
      JSON.stringify(agenda, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Erro ao escrever no arquivo JSON:", err);
          return res
            .status(500)
            .json({ error: "Erro ao escrever no arquivo JSON" });
        }
        res.json(agenda);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
