import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { createScheduleHTML } from "../utils/createScheduleHTML";

const app = express();
const PORT = 5550;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

interface Task {
  id: number;
  title: string;
  done: boolean;
}

interface Course {
  name: string;
  task: Task[];
}

type Agenda = Course[];

app.get("/", (_, res: Response) => {
  const htmlContent = createScheduleHTML();
  res.send(htmlContent);
});

app.get("/data", (_, res: Response) => {
  fs.readFile("./showD/agenda.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo JSON:", err);
      return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
    }
    const agenda: Agenda = JSON.parse(data);
    res.json(agenda);
  });
});

app.post("/checked", (req: Request, res: Response) => {
  const { id, done } = req.body as { id: number; done: boolean };

  fs.readFile("./showD/agenda.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo JSON:", err);
      return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
    }

    const agenda: Agenda = JSON.parse(data);

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
