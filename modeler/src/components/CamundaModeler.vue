<template>
  <div id="canvas" ref="canvas" style="height: 600px; border: 1px solid #ccc;"></div>
</template>

<style>
.bjs-powered-by {
  display: none !important;
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
// Import the Camunda Modeler from camunda-bpmn-js
import BpmnModeler from 'camunda-bpmn-js/lib/camunda-platform/Modeler'
import 'camunda-bpmn-js/dist/assets/camunda-platform-modeler.css'

const canvas = ref(null)
let modeler

onMounted(async () => {
  // Initialize the Camunda Modeler using the Camunda distribution
  modeler = new BpmnModeler({ container: canvas.value })

  // Fetch initial BPMN XML from your backend endpoint
  try {
    const response = await fetch('http://localhost:3000/bpmn-model')
    const data = await response.json()
    const xml = data.contents[0].text
    // const parsedData = JSON.parse(xml)
    const bpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js-token-simulation" exporterVersion="0.38.1">
  <bpmn:process id="Process_1" isExecutable="true">
    <bpmn:subProcess id="SubProcess_0gc6evc" name="Cash Withdrawal">
      <bpmn:incoming>SequenceFlow_0t9dyy4</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1ge46mh</bpmn:outgoing>
      <bpmn:task id="Task_1upmjgh" name="Prepare Cash">
        <bpmn:incoming>SequenceFlow_10d6h3a</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_1dzm18n</bpmn:outgoing>
      </bpmn:task>
      <bpmn:parallelGateway id="ParallelGateway_0s75uad">
        <bpmn:incoming>SequenceFlow_1bpznq3</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_10d6h3a</bpmn:outgoing>
        <bpmn:outgoing>SequenceFlow_0rz4mzx</bpmn:outgoing>
      </bpmn:parallelGateway>
      <bpmn:task id="Task_128fg2b" name="Charge Account">
        <bpmn:incoming>SequenceFlow_0rz4mzx</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_1pol4sw</bpmn:outgoing>
      </bpmn:task>
      <bpmn:task id="Task_16oagb5" name="Issue Money">
        <bpmn:incoming>SequenceFlow_0cx35wm</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_05m0kip</bpmn:outgoing>
      </bpmn:task>
      <bpmn:parallelGateway id="ParallelGateway_158jo5x">
        <bpmn:incoming>SequenceFlow_1dzm18n</bpmn:incoming>
        <bpmn:incoming>SequenceFlow_1pol4sw</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_0cx35wm</bpmn:outgoing>
      </bpmn:parallelGateway>
      <bpmn:sequenceFlow id="SequenceFlow_10d6h3a" sourceRef="ParallelGateway_0s75uad" targetRef="Task_1upmjgh" />
      <bpmn:sequenceFlow id="SequenceFlow_1dzm18n" sourceRef="Task_1upmjgh" targetRef="ParallelGateway_158jo5x" />
      <bpmn:sequenceFlow id="SequenceFlow_0rz4mzx" sourceRef="ParallelGateway_0s75uad" targetRef="Task_128fg2b" />
      <bpmn:sequenceFlow id="SequenceFlow_1pol4sw" sourceRef="Task_128fg2b" targetRef="ParallelGateway_158jo5x" />
      <bpmn:sequenceFlow id="SequenceFlow_0cx35wm" sourceRef="ParallelGateway_158jo5x" targetRef="Task_16oagb5" />
      <bpmn:startEvent id="StartEvent_0j9yk1o" name="Cash Amount Selected">
        <bpmn:outgoing>SequenceFlow_1bpznq3</bpmn:outgoing>
      </bpmn:startEvent>
      <bpmn:sequenceFlow id="SequenceFlow_1bpznq3" sourceRef="StartEvent_0j9yk1o" targetRef="ParallelGateway_0s75uad" />
      <bpmn:endEvent id="EndEvent_1e8gne7" name="Cash Issued">
        <bpmn:incoming>SequenceFlow_05m0kip</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:sequenceFlow id="SequenceFlow_05m0kip" sourceRef="Task_16oagb5" targetRef="EndEvent_1e8gne7" />
    </bpmn:subProcess>
    <bpmn:sequenceFlow id="SequenceFlow_0t9dyy4" sourceRef="Task_0p47z7h" targetRef="SubProcess_0gc6evc" />
    <bpmn:startEvent id="StartEvent_0offpno" name="ATM Transaction Needed">
      <bpmn:outgoing>SequenceFlow_1xib75z</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1xib75z" sourceRef="StartEvent_0offpno" targetRef="Task_026c0id" />
    <bpmn:sequenceFlow id="SequenceFlow_1ge46mh" sourceRef="SubProcess_0gc6evc" targetRef="IntermediateThrowEvent_02yoqsl" />
    <bpmn:intermediateCatchEvent id="IntermediateThrowEvent_02yoqsl" name="Cash Withdrawn">
      <bpmn:incoming>SequenceFlow_1ge46mh</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1yu5yeq</bpmn:outgoing>
      <bpmn:conditionalEventDefinition />
    </bpmn:intermediateCatchEvent>
    <bpmn:task id="Task_1xu25p5" name="Check For Further Interactions">
      <bpmn:incoming>SequenceFlow_1yu5yeq</bpmn:incoming>
      <bpmn:incoming>SequenceFlow_0zjbpms</bpmn:incoming>
      <bpmn:incoming>SequenceFlow_0zxk9aa</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1udgk24</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_1yu5yeq" sourceRef="IntermediateThrowEvent_02yoqsl" targetRef="Task_1xu25p5" />
    <bpmn:sequenceFlow id="SequenceFlow_1udgk24" sourceRef="Task_1xu25p5" targetRef="ExclusiveGateway_12ylcgi" />
    <bpmn:eventBasedGateway id="ExclusiveGateway_12ylcgi">
      <bpmn:incoming>SequenceFlow_1udgk24</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0ftjyrx</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_1vsv7r8</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_0jd8d0i</bpmn:outgoing>
    </bpmn:eventBasedGateway>
    <bpmn:intermediateCatchEvent id="IntermediateCatchEvent_09tc0wh" name="New Interaction Requested">
      <bpmn:incoming>SequenceFlow_0ftjyrx</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0rkllvh</bpmn:outgoing>
      <bpmn:messageEventDefinition />
    </bpmn:intermediateCatchEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0ftjyrx" sourceRef="ExclusiveGateway_12ylcgi" targetRef="IntermediateCatchEvent_09tc0wh" />
    <bpmn:intermediateCatchEvent id="IntermediateCatchEvent_087fl8m" name="No Further Interaction Requested">
      <bpmn:incoming>SequenceFlow_1vsv7r8</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0zdc0ci</bpmn:outgoing>
      <bpmn:messageEventDefinition />
    </bpmn:intermediateCatchEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1vsv7r8" sourceRef="ExclusiveGateway_12ylcgi" targetRef="IntermediateCatchEvent_087fl8m" />
    <bpmn:intermediateCatchEvent id="IntermediateCatchEvent_12qf66u" name="30 seconds elapsed">
      <bpmn:incoming>SequenceFlow_0jd8d0i</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_10by6md</bpmn:outgoing>
      <bpmn:timerEventDefinition />
    </bpmn:intermediateCatchEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0jd8d0i" sourceRef="ExclusiveGateway_12ylcgi" targetRef="IntermediateCatchEvent_12qf66u" />
    <bpmn:task id="Task_0e0mu6c" name="Return Card">
      <bpmn:incoming>SequenceFlow_0zdc0ci</bpmn:incoming>
      <bpmn:incoming>SequenceFlow_10by6md</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1p7rbgq</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_0zdc0ci" sourceRef="IntermediateCatchEvent_087fl8m" targetRef="Task_0e0mu6c" />
    <bpmn:sequenceFlow id="SequenceFlow_10by6md" sourceRef="IntermediateCatchEvent_12qf66u" targetRef="Task_0e0mu6c" />
    <bpmn:endEvent id="EndEvent_0swhjpo" name="ATM Transaction Finsihed">
      <bpmn:incoming>SequenceFlow_1p7rbgq</bpmn:incoming>
      <bpmn:incoming>SequenceFlow_0lmdz0d</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_1p7rbgq" sourceRef="Task_0e0mu6c" targetRef="EndEvent_0swhjpo" />
    <bpmn:sequenceFlow id="SequenceFlow_0rkllvh" sourceRef="IntermediateCatchEvent_09tc0wh" targetRef="Task_0po6mda" />
    <bpmn:sequenceFlow id="SequenceFlow_130hgg8" sourceRef="Task_026c0id" targetRef="Task_0po6mda" />
    <bpmn:userTask id="Task_026c0id" name="Insert Card">
      <bpmn:incoming>SequenceFlow_1xib75z</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_130hgg8</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:userTask id="Task_0p47z7h" name="Select Amount">
      <bpmn:incoming>SequenceFlow_1qdqk69</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0t9dyy4</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:exclusiveGateway id="ExclusiveGateway_13kuced" name="Selected Interaction?">
      <bpmn:incoming>SequenceFlow_1364l2a</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1qdqk69</bpmn:outgoing>
      <bpmn:outgoing>SequenceFlow_091wldx</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:sequenceFlow id="SequenceFlow_1qdqk69" name="Cash Withdrawal" sourceRef="ExclusiveGateway_13kuced" targetRef="Task_0p47z7h" />
    <bpmn:sequenceFlow id="SequenceFlow_091wldx" name="Account Balance" sourceRef="ExclusiveGateway_13kuced" targetRef="Task_1ept7kl" />
    <bpmn:subProcess id="Task_1ept7kl" name="Account Balance Information">
      <bpmn:incoming>SequenceFlow_091wldx</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0zjbpms</bpmn:outgoing>
      <bpmn:startEvent id="StartEvent_13lmuqn" name="Account Balance Requested">
        <bpmn:outgoing>SequenceFlow_17nxcr4</bpmn:outgoing>
      </bpmn:startEvent>
      <bpmn:task id="Task_180wh31" name="Display Balance">
        <bpmn:incoming>SequenceFlow_17nxcr4</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_10zdsna</bpmn:outgoing>
      </bpmn:task>
      <bpmn:sequenceFlow id="SequenceFlow_17nxcr4" sourceRef="StartEvent_13lmuqn" targetRef="Task_180wh31" />
      <bpmn:sequenceFlow id="SequenceFlow_10zdsna" sourceRef="Task_180wh31" targetRef="IntermediateThrowEvent_10vhtou" />
      <bpmn:intermediateCatchEvent id="IntermediateThrowEvent_10vhtou" name="Balance checked">
        <bpmn:incoming>SequenceFlow_10zdsna</bpmn:incoming>
        <bpmn:outgoing>SequenceFlow_0z16g3i</bpmn:outgoing>
        <bpmn:conditionalEventDefinition />
      </bpmn:intermediateCatchEvent>
      <bpmn:endEvent id="EndEvent_1qnlj46" name="Account Balance displayed">
        <bpmn:incoming>SequenceFlow_0z16g3i</bpmn:incoming>
      </bpmn:endEvent>
      <bpmn:sequenceFlow id="SequenceFlow_0z16g3i" sourceRef="IntermediateThrowEvent_10vhtou" targetRef="EndEvent_1qnlj46" />
    </bpmn:subProcess>
    <bpmn:sequenceFlow id="SequenceFlow_0zjbpms" sourceRef="Task_1ept7kl" targetRef="Task_1xu25p5" />
    <bpmn:sequenceFlow id="SequenceFlow_1364l2a" sourceRef="Task_0po6mda" targetRef="ExclusiveGateway_13kuced" />
    <bpmn:userTask id="Task_0po6mda" name="Select Interaction">
      <bpmn:incoming>SequenceFlow_130hgg8</bpmn:incoming>
      <bpmn:incoming>SequenceFlow_0rkllvh</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_1364l2a</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:boundaryEvent id="BoundaryEvent_07intkn" name="Message received" attachedToRef="Task_1ept7kl">
      <bpmn:outgoing>SequenceFlow_0lmdz0d</bpmn:outgoing>
      <bpmn:messageEventDefinition messageRef="Message_1dyo6g5" />
    </bpmn:boundaryEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0lmdz0d" sourceRef="BoundaryEvent_07intkn" targetRef="EndEvent_0swhjpo" />
    <bpmn:sequenceFlow id="SequenceFlow_0zxk9aa" sourceRef="BoundaryEvent_Error" targetRef="Task_1xu25p5" />
    <bpmn:boundaryEvent id="BoundaryEvent_Error" name="Error" attachedToRef="SubProcess_0gc6evc">
      <bpmn:outgoing>SequenceFlow_0zxk9aa</bpmn:outgoing>
      <bpmn:errorEventDefinition errorRef="Error_0k93fd1" />
    </bpmn:boundaryEvent>
    <bpmn:boundaryEvent id="BoundaryEvent_Timer_non_interrupting" cancelActivity="false" attachedToRef="SubProcess_0gc6evc">
      <bpmn:outgoing>SequenceFlow_0rgmhwk</bpmn:outgoing>
      <bpmn:timerEventDefinition />
    </bpmn:boundaryEvent>
    <bpmn:endEvent id="EndEvent_1p2txse">
      <bpmn:incoming>SequenceFlow_0j9ajgx</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="SequenceFlow_0rgmhwk" sourceRef="BoundaryEvent_Timer_non_interrupting" targetRef="Task_1u7pqoy" />
    <bpmn:task id="Task_1u7pqoy" name="Timeout">
      <bpmn:incoming>SequenceFlow_0rgmhwk</bpmn:incoming>
      <bpmn:outgoing>SequenceFlow_0j9ajgx</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="SequenceFlow_0j9ajgx" sourceRef="Task_1u7pqoy" targetRef="EndEvent_1p2txse" />
  </bpmn:process>
  <bpmn:message id="Message_1dyo6g5" name="Message_message" />
  <bpmn:error id="Error_0k93fd1" name="Error_1405ero" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="SubProcess_0gc6evc_di" bpmnElement="SubProcess_0gc6evc" isExpanded="true">
        <dc:Bounds x="627" y="0" width="593" height="342" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1upmjgh_di" bpmnElement="Task_1upmjgh">
        <dc:Bounds x="797" y="42" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ParallelGateway_0s75uad_di" bpmnElement="ParallelGateway_0s75uad">
        <dc:Bounds x="732" y="196" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="712" y="249" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_128fg2b_di" bpmnElement="Task_128fg2b">
        <dc:Bounds x="797" y="241" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_16oagb5_di" bpmnElement="Task_16oagb5">
        <dc:Bounds x="1015" y="181" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ParallelGateway_158jo5x_di" bpmnElement="ParallelGateway_158jo5x">
        <dc:Bounds x="913" y="196" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="893" y="249" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_0j9yk1o_di" bpmnElement="StartEvent_0j9yk1o">
        <dc:Bounds x="666.8728717366629" y="203" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="652" y="242" width="67" height="24" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1e8gne7_di" bpmnElement="EndEvent_1e8gne7">
        <dc:Bounds x="1148.872871736663" y="203" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1136" y="242" width="62" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_10d6h3a_di" bpmnElement="SequenceFlow_10d6h3a">
        <di:waypoint x="757" y="196" />
        <di:waypoint x="757" y="82" />
        <di:waypoint x="797" y="82" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="772" y="132.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1dzm18n_di" bpmnElement="SequenceFlow_1dzm18n">
        <di:waypoint x="897" y="82" />
        <di:waypoint x="938" y="82" />
        <di:waypoint x="938" y="196" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="917.5" y="60.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0rz4mzx_di" bpmnElement="SequenceFlow_0rz4mzx">
        <di:waypoint x="757" y="246" />
        <di:waypoint x="757" y="281" />
        <di:waypoint x="797" y="281" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="772" y="257" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1pol4sw_di" bpmnElement="SequenceFlow_1pol4sw">
        <di:waypoint x="897" y="281" />
        <di:waypoint x="938" y="281" />
        <di:waypoint x="938" y="246" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="917.5" y="259.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0cx35wm_di" bpmnElement="SequenceFlow_0cx35wm">
        <di:waypoint x="963" y="221" />
        <di:waypoint x="1015" y="221" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="944" y="200" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1bpznq3_di" bpmnElement="SequenceFlow_1bpznq3">
        <di:waypoint x="703" y="221" />
        <di:waypoint x="732" y="221" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="717.5" y="199.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_05m0kip_di" bpmnElement="SequenceFlow_05m0kip">
        <di:waypoint x="1115" y="221" />
        <di:waypoint x="1149" y="221" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1132" y="199.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="StartEvent_0offpno_di" bpmnElement="StartEvent_0offpno">
        <dc:Bounds x="-7" y="153" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="-30" y="192" width="83" height="24" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="IntermediateCatchEvent_04d3x2w_di" bpmnElement="IntermediateThrowEvent_02yoqsl">
        <dc:Bounds x="1259" y="153" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1236" y="192" width="81" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1xu25p5_di" bpmnElement="Task_1xu25p5">
        <dc:Bounds x="1327.1135265700484" y="131" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EventBasedGateway_1ho472d_di" bpmnElement="ExclusiveGateway_12ylcgi">
        <dc:Bounds x="1471" y="146" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1495.1135265700484" y="199" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="IntermediateCatchEvent_09tc0wh_di" bpmnElement="IntermediateCatchEvent_09tc0wh">
        <dc:Bounds x="1554.1135265700484" y="250.14492753623188" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1534" y="289" width="77" height="25" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="IntermediateCatchEvent_087fl8m_di" bpmnElement="IntermediateCatchEvent_087fl8m">
        <dc:Bounds x="1554" y="153" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1545" y="192" width="54" height="37" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="IntermediateCatchEvent_12qf66u_di" bpmnElement="IntermediateCatchEvent_12qf66u">
        <dc:Bounds x="1554" y="82.38043478260875" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1544" y="121" width="57" height="25" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_0e0mu6c_di" bpmnElement="Task_0e0mu6c">
        <dc:Bounds x="1630.579575596817" y="131" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_0swhjpo_di" bpmnElement="EndEvent_0swhjpo">
        <dc:Bounds x="1768.579575596817" y="153" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1746" y="192" width="83" height="24" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UserTask_1rlipu4_di" bpmnElement="Task_026c0id">
        <dc:Bounds x="63" y="131" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="UserTask_0kibayb_di" bpmnElement="Task_0p47z7h">
        <dc:Bounds x="490" y="131" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ExclusiveGateway_13kuced_di" bpmnElement="ExclusiveGateway_13kuced" isMarkerVisible="true">
        <dc:Bounds x="332.07244501940494" y="146" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="328" y="199" width="58" height="24" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="SubProcess_1utqdnk_di" bpmnElement="Task_1ept7kl" isExpanded="true">
        <dc:Bounds x="719" y="-222" width="410" height="197" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="StartEvent_13lmuqn_di" bpmnElement="StartEvent_13lmuqn">
        <dc:Bounds x="750.4489795918366" y="-137.17551020408166" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="728" y="-98" width="83" height="25" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_180wh31_di" bpmnElement="Task_180wh31">
        <dc:Bounds x="829.4489795918366" y="-159" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="IntermediateCatchEvent_0wcdcvo_di" bpmnElement="IntermediateThrowEvent_10vhtou">
        <dc:Bounds x="964.4489795918366" y="-137" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="940.4489795918366" y="-98" width="84" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1qnlj46_di" bpmnElement="EndEvent_1qnlj46">
        <dc:Bounds x="1057.2726543704891" y="-137" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1035" y="-98" width="83" height="25" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_17nxcr4_di" bpmnElement="SequenceFlow_17nxcr4">
        <di:waypoint x="786" y="-119" />
        <di:waypoint x="829" y="-119" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="807.5" y="-140.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_10zdsna_di" bpmnElement="SequenceFlow_10zdsna">
        <di:waypoint x="929" y="-119" />
        <di:waypoint x="964" y="-119" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="946.5" y="-140.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0z16g3i_di" bpmnElement="SequenceFlow_0z16g3i">
        <di:waypoint x="1000" y="-119" />
        <di:waypoint x="1057" y="-119" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1028.5" y="-140.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="UserTask_0m3dsxi_di" bpmnElement="Task_0po6mda">
        <dc:Bounds x="196" y="131" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1p2txse_di" bpmnElement="EndEvent_1p2txse">
        <dc:Bounds x="1359" y="397.779" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1377" y="437.779" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1u7pqoy_di" bpmnElement="Task_1u7pqoy">
        <dc:Bounds x="1170" y="376" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BoundaryEvent_14q1ix1_di" bpmnElement="BoundaryEvent_Timer_non_interrupting">
        <dc:Bounds x="1047" y="324" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1065" y="364" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BoundaryEvent_1di82p3_di" bpmnElement="BoundaryEvent_Error">
        <dc:Bounds x="1202" y="250" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1243" y="276" width="27" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BoundaryEvent_1ufpi4t_di" bpmnElement="BoundaryEvent_07intkn">
        <dc:Bounds x="1111" y="-202" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1152" y="-216" width="47" height="24" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="SequenceFlow_0t9dyy4_di" bpmnElement="SequenceFlow_0t9dyy4">
        <di:waypoint x="590" y="171" />
        <di:waypoint x="627" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="608.5" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1xib75z_di" bpmnElement="SequenceFlow_1xib75z">
        <di:waypoint x="29" y="171" />
        <di:waypoint x="63" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="46" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1ge46mh_di" bpmnElement="SequenceFlow_1ge46mh">
        <di:waypoint x="1220" y="171" />
        <di:waypoint x="1259" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1239.5" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1yu5yeq_di" bpmnElement="SequenceFlow_1yu5yeq">
        <di:waypoint x="1295" y="171" />
        <di:waypoint x="1327" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1311" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1udgk24_di" bpmnElement="SequenceFlow_1udgk24">
        <di:waypoint x="1427" y="171" />
        <di:waypoint x="1471" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1449" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0ftjyrx_di" bpmnElement="SequenceFlow_0ftjyrx">
        <di:waypoint x="1496" y="196" />
        <di:waypoint x="1496" y="268" />
        <di:waypoint x="1554" y="268" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1511" y="225" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1vsv7r8_di" bpmnElement="SequenceFlow_1vsv7r8">
        <di:waypoint x="1521" y="171" />
        <di:waypoint x="1554" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1537.5" y="149" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0jd8d0i_di" bpmnElement="SequenceFlow_0jd8d0i">
        <di:waypoint x="1496" y="146" />
        <di:waypoint x="1496" y="100" />
        <di:waypoint x="1554" y="100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1511" y="116.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0zdc0ci_di" bpmnElement="SequenceFlow_0zdc0ci">
        <di:waypoint x="1590" y="171" />
        <di:waypoint x="1631" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1610.5" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_10by6md_di" bpmnElement="SequenceFlow_10by6md">
        <di:waypoint x="1590" y="100" />
        <di:waypoint x="1681" y="100" />
        <di:waypoint x="1681" y="131" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1635.5" y="78.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1p7rbgq_di" bpmnElement="SequenceFlow_1p7rbgq">
        <di:waypoint x="1731" y="171" />
        <di:waypoint x="1769" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1750" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0rkllvh_di" bpmnElement="SequenceFlow_0rkllvh">
        <di:waypoint x="1590" y="268" />
        <di:waypoint x="1635" y="268" />
        <di:waypoint x="1635" y="490" />
        <di:waypoint x="246" y="490" />
        <di:waypoint x="246" y="211" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1605" y="372.5" width="90" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_130hgg8_di" bpmnElement="SequenceFlow_130hgg8">
        <di:waypoint x="163" y="171" />
        <di:waypoint x="196" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="179.5" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1qdqk69_di" bpmnElement="SequenceFlow_1qdqk69">
        <di:waypoint x="382" y="171" />
        <di:waypoint x="490" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="384.49367088607596" y="151" width="84" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_091wldx_di" bpmnElement="SequenceFlow_091wldx">
        <di:waypoint x="357" y="146" />
        <di:waypoint x="357" y="-123" />
        <di:waypoint x="719" y="-123" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="362" y="78.75518815120985" width="83" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0zjbpms_di" bpmnElement="SequenceFlow_0zjbpms">
        <di:waypoint x="1129" y="-123" />
        <di:waypoint x="1377" y="-123" />
        <di:waypoint x="1377" y="131" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1253" y="-144.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_1364l2a_di" bpmnElement="SequenceFlow_1364l2a">
        <di:waypoint x="296" y="171" />
        <di:waypoint x="332" y="171" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="314" y="149.5" width="0" height="13" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0lmdz0d_di" bpmnElement="SequenceFlow_0lmdz0d">
        <di:waypoint x="1147" y="-184" />
        <di:waypoint x="1787" y="-184" />
        <di:waypoint x="1787" y="153" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1467" y="-205" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0zxk9aa_di" bpmnElement="SequenceFlow_0zxk9aa">
        <di:waypoint x="1238" y="268" />
        <di:waypoint x="1377" y="268" />
        <di:waypoint x="1377" y="211" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1307.5" y="247" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0rgmhwk_di" bpmnElement="SequenceFlow_0rgmhwk">
        <di:waypoint x="1065" y="360" />
        <di:waypoint x="1065" y="416" />
        <di:waypoint x="1170" y="416" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1080" y="382" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="SequenceFlow_0j9ajgx_di" bpmnElement="SequenceFlow_0j9ajgx">
        <di:waypoint x="1270" y="416" />
        <di:waypoint x="1359" y="416" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="1314.5" y="395" width="0" height="12" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`
    await modeler.importXML(bpmnXml)
  } catch (err) {
    console.error('Error importing BPMN XML:', err)
  }

  // Listen for live updates via Server-Sent Events (SSE)
  const eventSource = new EventSource('http://localhost:3000/updates')
  eventSource.onmessage = async (event) => {
    const updatedXML = event.data
    try {
      await modeler.importXML(updatedXML)
    } catch (err) {
      console.error('Error updating BPMN XML:', err)
    }
  }
})
</script>
