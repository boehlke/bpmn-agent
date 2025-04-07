import { McpServer, ReadResourceCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import BPMNModdle, { Definitions } from "bpmn-moddle";
import flatted from "flatted";
export const bpmnModdle = new BPMNModdle();

const server = new McpServer({
  name: "bpmn-model",
  version: "1.0.0"
});

const meta = {
  schema: {
    type: "object",
    properties: {
      bpmnModel: { type: "string" }
    }
  }};


const callback: ReadResourceCallback = (uri) => ({
  contents: [{
    uri: uri.href,
    text: flatted.stringify({ bpmnModel: bpmnModdle })
  }]
});

server.resource("bpmn-model", "bpmn://bpmn-model", meta, callback);
export default server;