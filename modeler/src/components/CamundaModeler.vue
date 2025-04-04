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
    await modeler.importXML(xml)
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
