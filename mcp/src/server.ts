import bodyParser from 'body-parser';
import mcpRoutes from './mcp/routes';
import swaggerUi from 'swagger-ui-express';
import openapiSpecification from './openapi';
import express, { json, Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import BPMNModdle, { Definitions } from "bpmn-moddle";
import { z } from 'zod';
import server, { bpmnModdle } from './mcp/server';
import './mcp/bpmnTools';

const moddle = new BPMNModdle();

const app = express();

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports: { [sessionId: string]: SSEServerTransport } = {};

// Track connected SSE clients
const sseClients = new Set<Response>();

// Helper function to broadcast updates to all connected clients
function broadcastUpdate(update: any) {
  const message = `data: ${JSON.stringify(update)}\n\n`;
  sseClients.forEach(client => {
    client.write(message);
  });
}

// Modify the state update to broadcast changes
class State {
  bpmnModel!: Definitions;
  constructor() {
    const xmlStr =
      '<?xml version="1.0" encoding="UTF-8"?>' +
      '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
      'id="empty-definitions" ' +
      'targetNamespace="http://bpmn.io/schema/bpmn">' +
      '</bpmn2:definitions>';

    moddle.fromXML(xmlStr).then((definitions) => {
      this.bpmnModel = definitions;
      broadcastUpdate({ type: 'initial', model: definitions });
    });
  }

  updateModel(newModel: Definitions) {
    this.bpmnModel = newModel;
    broadcastUpdate({ type: 'update', model: newModel });
  }
}

const state = new State();

// Enable CORS for all origins
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get("/bpmn-model", async (_: Request, res: Response) => {
  const xmlStr = '<?xml version="1.0" encoding="UTF-8"?>' +
    '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
    'id="empty-definitions" ' +
    'targetNamespace="http://bpmn.io/schema/bpmn">' +
    '</bpmn2:definitions>';

  res.json({
    contents: [{
      uri: "bpmn://model",
      text: xmlStr
    }]
  });
});

app.get("/sse", async (_: Request, res: Response) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

// GET /updates -> Server-Sent Events (SSE) for live BPMN updates
app.get('/updates', (req: Request, res: Response) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  // Add client to the set
  sseClients.add(res);

  // Send an initial event to confirm connection
  res.write(`data: ${JSON.stringify({ message: "SSE Connected" })}\n\n`);

  // Clean up on client disconnect
  req.on('close', () => {
    sseClients.delete(res);
    res.end();
  });
});

// const port = process.env.PORT || 3000;

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Mount MCP routes under /mcp
// app.use('/mcp', mcpRoutes);
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


// app.get('/sse', (req, res) => {
//     res.set({
//         'Content-Type': 'text/event-stream',
//         'Cache-Control': 'no-cache',
//         'Connection': 'keep-alive'
//     });
//     res.flushHeaders();
//     // Send an initial event to confirm connection.
//     res.write(`data: ${JSON.stringify({ message: "SSE Connected" })}\n\n`);

//     // Keep the connection open.
//     const interval = setInterval(() => {
//         res.write(`data: ${JSON.stringify({ timestamp: new Date().toISOString() })}\n\n`);
//     }, 10000);

//     // Clean up on client disconnect.
//     req.on('close', () => {
//         clearInterval(interval);
//         res.end();
//     });
// });

// app.get('/offerings', (req, res) => {
//     res.json({
//       serverName: 'My MCP Server',
//       version: '1.0.0',
//       offerings: [
//         {
//           name: 'MCP Command Processor',
//           description: 'Executes create, update, move, and delete commands for BPMN elements.'
//         }
//       ]
//     });
//   });


app.listen(3000, () => {
  console.log(`MCP Server running on port 3000`);
});
