import { createServer } from "node:http";
import { writeFileSync } from "node:fs";

const [portFile, requestFile] = process.argv.slice(2);
if (!portFile || !requestFile) throw new Error("Expected port and request file paths");

const server = createServer((request, response) => {
  const chunks = [];
  request.on("data", (chunk) => chunks.push(chunk));
  request.on("end", () => {
    writeFileSync(requestFile, Buffer.concat(chunks));
    response.writeHead(200, {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      connection: "close",
    });
    response.write('data: {"id":"chatcmpl-test","object":"chat.completion.chunk","created":1,"model":"fake-model","choices":[{"index":0,"delta":{"role":"assistant","content":"OK"},"finish_reason":null}]}\n\n');
    response.write('data: {"id":"chatcmpl-test","object":"chat.completion.chunk","created":1,"model":"fake-model","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}\n\n');
    response.end("data: [DONE]\n\n");
  });
});

server.listen(0, "127.0.0.1", () => {
  const address = server.address();
  if (address === null || typeof address === "string") throw new Error("Expected TCP address");
  writeFileSync(portFile, String(address.port));
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
