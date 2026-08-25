import { createServer, type Server } from "node:http";

export interface FakeOpenAIRequest {
  path: string;
  body: Record<string, unknown>;
}

export interface FakeOpenAIServer {
  baseUrl: string;
  requests: FakeOpenAIRequest[];
  close(): Promise<void>;
}

export async function startFakeOpenAIServer(): Promise<FakeOpenAIServer> {
  const requests: FakeOpenAIRequest[] = [];
  const server: Server = createServer((request, response) => {
    const chunks: Buffer[] = [];
    request.on("data", (chunk: Buffer) => chunks.push(chunk));
    request.on("end", () => {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
      requests.push({ path: request.url ?? "", body });
      response.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
        connection: "keep-alive",
      });
      response.write(
        `data: ${JSON.stringify({
          id: "chatcmpl-test",
          object: "chat.completion.chunk",
          created: 1,
          model: "fake-model",
          choices: [{ index: 0, delta: { role: "assistant", content: "OK" }, finish_reason: null }],
        })}\n\n`,
      );
      response.write(
        `data: ${JSON.stringify({
          id: "chatcmpl-test",
          object: "chat.completion.chunk",
          created: 1,
          model: "fake-model",
          choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
        })}\n\n`,
      );
      response.write(
        `data: ${JSON.stringify({
          id: "chatcmpl-test",
          object: "chat.completion.chunk",
          created: 1,
          model: "fake-model",
          choices: [],
          usage: { prompt_tokens: 10, completion_tokens: 1, total_tokens: 11 },
        })}\n\n`,
      );
      response.end("data: [DONE]\n\n");
    });
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  if (address === null || typeof address === "string") throw new Error("Expected TCP address");
  return {
    baseUrl: `http://127.0.0.1:${address.port}/v1`,
    requests,
    close: () => new Promise<void>((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    }),
  };
}

export function extractSystemText(request: FakeOpenAIRequest): string {
  const messages = request.body.messages;
  if (!Array.isArray(messages)) throw new Error("Expected OpenAI messages array");
  return messages
    .filter((message): message is { role: string; content: unknown } =>
      typeof message === "object" && message !== null && "role" in message && "content" in message)
    .filter((message) => message.role === "system")
    .map((message) => typeof message.content === "string" ? message.content : JSON.stringify(message.content))
    .join("\n");
}
