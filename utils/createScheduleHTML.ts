import { JSDOM } from "jsdom";

export function createScheduleHTML(): string {
  const dom = new JSDOM(
    `<!DOCTYPE html><html lang="pt-br"><head></head><body></body></html>`
  );
  const document = dom.window.document;

  const head = document.head;
  const metaCharset = document.createElement("meta");
  metaCharset.setAttribute("charset", "UTF-8");
  head.appendChild(metaCharset);

  const metaViewport = document.createElement("meta");
  metaViewport.setAttribute("name", "viewport");
  metaViewport.setAttribute("content", "width=device-width, initial-scale=1.0");
  head.appendChild(metaViewport);

  const title = document.createElement("title");
  title.textContent = "Agenda UNOPAR";
  head.appendChild(title);

  const linkIcon = document.createElement("link");
  linkIcon.setAttribute("rel", "icon");
  linkIcon.setAttribute(
    "href",
    "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><text y=%2214%22 font-size=%2214%22>🗓️</text></svg>"
  );
  head.appendChild(linkIcon);

  const linkStylesheet = document.createElement("link");
  linkStylesheet.setAttribute("rel", "stylesheet");
  linkStylesheet.setAttribute("href", "/styles.css");
  head.appendChild(linkStylesheet);

  const body = document.body;

  const h1 = document.createElement("h1");
  h1.innerHTML = `Cronograma UNOPAR <button class="download-button" onclick="downloadPage()">Baixar Página</button>`;
  body.appendChild(h1);

  const futureTasksDiv = document.createElement("div");
  futureTasksDiv.className = "task-list";
  futureTasksDiv.innerHTML =
    '<h2>Tarefas Futuras</h2><ol id="futureTasks"></ol>';
  body.appendChild(futureTasksDiv);

  const currentTasksDiv = document.createElement("div");
  currentTasksDiv.className = "task-list";
  currentTasksDiv.innerHTML =
    '<h2>Tarefas Atuais</h2><ol id="currentTasks"></ol>';
  body.appendChild(currentTasksDiv);

  const pastTasksDiv = document.createElement("div");
  pastTasksDiv.className = "task-list";
  pastTasksDiv.innerHTML = '<h2>Tarefas Passadas</h2><ol id="pastTasks"></ol>';
  body.appendChild(pastTasksDiv);

  const scheduleWrapperDiv = document.createElement("div");
  scheduleWrapperDiv.className = "schedule-container-wrapper";
  scheduleWrapperDiv.innerHTML =
    '<h2>Cronograma</h2><div class="container" id="scheduleContainer"></div>';
  body.appendChild(scheduleWrapperDiv);

  const script = document.createElement("script");
  script.setAttribute("src", "/script.js");
  body.appendChild(script);

  return dom.serialize();
}
