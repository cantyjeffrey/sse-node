import http from "http";
import data from "./data.json";

const headers = {};

http
  .createServer((req, res) => {
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = true;
    headers["Access-Control-Max-Age"] = "86400"; // 24 hours
    headers["Access-Control-Allow-Headers"] =
      "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";

    if (req.headers.accept && req.headers.accept == "text/event-stream") {
      emitSSE(req, res);
    }
  })
  .listen(8000);

const emitSSE = (req, res) => {
  headers["Content-Type"] = "text/event-stream";
  headers["Cache-Control"] = "no-cache";
  headers["Connection"] = "keep-alive";
  res.writeHead(200, headers);

  const id = new Date().toLocaleTimeString();
  setInterval(() => {
    generateMessage(res, id, JSON.stringify(data));
  }, 30000);

  generateMessage(res, id, JSON.stringify(data));
};

const generateMessage = (res, id, data) => {
  res.write(`id: ${id}\n`);
  res.write(`data: ${data}\n\n`);
};
