package io.kryptance.mcp.bpmn

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.http.content.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.cachingheaders.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.modelcontextprotocol.kotlin.sdk.*
import io.modelcontextprotocol.kotlin.sdk.server.Server
import io.modelcontextprotocol.kotlin.sdk.server.ServerOptions
import io.modelcontextprotocol.kotlin.sdk.server.WebSocketMcpServerTransport
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonPrimitive

/**
 * Sample data classes for serializing the BPMN diagram resource:
 */
@Serializable
data class BpmnContent(val text: String, val type: String)

@Serializable
data class BpmnDiagramResponse(val contents: List<BpmnContent>)

/**
 * Data class to define input arguments for the "add" tool.
 */
@Serializable
data class AddArguments(val a: Int, val b: Int)

// In-memory BPMN XML data (replace with your own initial BPMN diagram).
var bpmnXml = """
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    targetNamespace="http://bpmn.io/schema/bpmn">
  <process id="Process_1" isExecutable="true">
    <startEvent id="StartEvent_1"/>
    <sequenceFlow sourceRef="StartEvent_1" targetRef="Task_1" />
    <userTask id="Task_1" name="Some Task"/>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane bpmnElement="Process_1">
      <bpmndi:BPMNShape bpmnElement="StartEvent_1" id="StartEvent_1_di">
        <dc:Bounds x="180" y="100" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape bpmnElement="Task_1" id="Task_1_di">
        <dc:Bounds x="260" y="80" width="100" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge bpmnElement="SequenceFlow_1" id="SequenceFlow_1_di">
        <di:waypoint x="216" y="118"/>
        <di:waypoint x="260" y="118"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>
""".trimIndent()

// A shared flow to broadcast BPMN XML updates to all connected SSE clients.
val bpmnUpdatesFlow = MutableSharedFlow<String>(replay = 1)

/**
 * Main function:
 *   - Runs a Ktor server on port 8080
 *   - Registers a WebSocket endpoint for MCP at /mcp
 *   - Provides JSON endpoints to GET/POST the BPMN diagram
 *   - Sends SSE updates from /updates
 */
suspend fun main() {
    // Create an MCP server instance.
    val server = Server(
        Implementation(
            name = "CalculatorServer",
            version = "1.0.0"
        ),
        ServerOptions(ServerCapabilities(tools = ServerCapabilities.Tools(true)))
    )

    // Register an "add" tool that sums up two numbers.
    server.addTool(
        name = "add",
        inputSchema = Tool.Input(),
        description = "Add two numbers"
    ) { request: CallToolRequest ->
        val a = request.arguments["a"] as? JsonPrimitive
        val b = request.arguments["b"] as? JsonPrimitive
        val result = if (a != null && b != null) {
            a.content.toInt() + b.content.toInt()
        } else null
        CallToolResult(listOf(TextContent("The result is $result")))
    }

    embeddedServer(Netty, port = 8080) {
        // 1) Enable serialization
        install(ContentNegotiation) {
            json()  // Ktor will now serialize Kotlin objects to JSON
        }
        // 2) Optional: allow cross‐origin from anywhere
        install(CORS) {
            anyHost()
        }
        install(CachingHeaders)
        install(WebSockets)

        routing {
            // Serve static files (e.g. index.html) from resources/static
            staticResources("/", "static") {
                default("index.html")
            }

            // MCP WebSocket endpoint at /mcp
            webSocket("/mcp") {
                val transport = WebSocketMcpServerTransport(this)
                server.connect(transport)
            }

            // GET /mcp/resource/bpmn-diagram -> returns JSON with BPMN XML
            get("/mcp/resource/bpmn-diagram") {
                // Build the response as serializable data
                val response = BpmnDiagramResponse(
                    contents = listOf(
                        BpmnContent(
                            text = bpmnXml,
                            type = "application/bpmn+xml"
                        )
                    )
                )
                // Ktor will return 200 OK, content-type: application/json
                call.respond(response)
            }

            // POST /mcp/resource/bpmn-diagram -> update BPMN XML in memory
            post("/mcp/resource/bpmn-diagram") {
                val newBpmn = call.receiveText()
                bpmnXml = newBpmn

                // Broadcast the new BPMN XML to all SSE clients
                bpmnUpdatesFlow.emit(bpmnXml)

                val response = mapOf(
                    "status" to "updated",
                    "length" to bpmnXml.length
                )
                call.respond(response)  // also returns JSON
            }

            // GET /updates -> Server-Sent Events (SSE) for live BPMN updates
            get("/updates") {
                call.response.cacheControl(CacheControl.NoCache(null))
                call.respondTextWriter(contentType = ContentType.Text.EventStream) {
                    // Immediately emit the current BPMN to this new client
                    emitSseEvent(bpmnXml)

                    // Collect changes from the flow and emit them as SSE
                    launch {
                        bpmnUpdatesFlow.collectLatest { updatedXML ->
                            emitSseEvent(updatedXML)
                        }
                    }

                    // Keep the connection open indefinitely
                    while (true) {
                        flush()
                        delay(5000)
                    }
                }
            }
        }
    }.start(wait = true)
}

/**
 * Helper function to emit a data event in SSE format:
 *  data: <payload>\n\n
 */
suspend fun java.io.Writer.emitSseEvent(data: String) {
    write("data: $data\n\n")
    flush()
}
