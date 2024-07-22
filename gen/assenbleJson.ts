import fs from "fs";
import { JSDOM } from "jsdom";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const inputDir = path.join(__dirname, "indices");
const outputFile = path.join(__dirname, "../src/agenda.json");

interface Task {
  title: string;
  subTitle: string;
  id: string;
  periodo: string;
}

interface SimplifiedHTML {
  name: string;
  task: Task[];
}

function processarHTML(inputFile: string): Promise<SimplifiedHTML> {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, "utf8", (err, dataHTML) => {
      if (err) {
        console.error("Erro ao ler o arquivo:", err);
        reject(err);
        return;
      }

      const dom = new JSDOM(dataHTML);
      const document = dom.window.document;

      const activitiesContainer = document.querySelector(
        "#js-activities-container"
      );
      if (!activitiesContainer) {
        reject(new Error("Container de atividades não encontrado"));
        return;
      }

      const subElements: NodeListOf<Element> =
        activitiesContainer.querySelectorAll(".timeline-panel");
      const elementsArray = Array.from(subElements);

      const filtrosFinalizado: Task[] = elementsArray.map((element) => {
        const title =
          element
            .querySelector("span")
            ?.textContent?.trim()
            .split("    ")[0]
            .replaceAll(/\n/g, "") || "";

        const arrayPeriodos =
          (Array.from(element.querySelectorAll("small"))[1]?.textContent ?? "")
            .trim()
            .split("    ") || [];

        const subTitle =
          (Array.from(element.querySelectorAll("small"))[0]?.textContent ?? "")
            .trim()
            .split("    ")[0]
            .replace("  ", " ") || "";

        const periodo =
          arrayPeriodos[arrayPeriodos.length - 1]
            ?.trim()
            .replace("Período:", "")
            .trim() || "";

        return { title, subTitle, id: uuidv4(), periodo };
      });

      const simplifiedHTML: SimplifiedHTML = {
        name: path
          .basename(inputFile, path.extname(inputFile))
          .split("-")[1]
          .split("(")[0]
          .trim(),
        task: filtrosFinalizado,
      };

      resolve(simplifiedHTML);
    });
  });
}

fs.readdir(inputDir, async (err, files) => {
  if (err) {
    console.error("Erro ao ler o diretório:", err);
    return;
  }

  const htmlFiles = files.filter((file) => path.extname(file) === ".html");
  const objetosArray: SimplifiedHTML[] = [];

  for (const file of htmlFiles) {
    const inputFile = path.join(inputDir, file);
    try {
      const processedData = await processarHTML(inputFile);
      objetosArray.push(processedData);
    } catch (error) {
      console.error(`Erro ao processar o arquivo ${file}:`, error);
    }
  }

  fs.writeFile(outputFile, JSON.stringify(objetosArray, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar o arquivo:", err);
      return;
    }
    console.log("Arquivo processado e salvo com sucesso!");
  });
});

fs.access(outputFile, fs.constants.F_OK, (err) => {
  if (err) {
    fs.writeFile(outputFile, "[]", (writeErr) => {
      if (writeErr) {
        console.error("Erro ao criar o arquivo agenda.json:", writeErr);
        return;
      }
      console.log("Arquivo agenda.json criado com sucesso!");
    });
  }
});
