<template>
  <div id="canvas" ref="canvas" style="height: 600px; border: 1px solid #ccc;"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'

const canvas = ref(null)
let modeler

onMounted(async () => {
  // Initialize the BPMN Modeler
  modeler = new BpmnModeler({ container: canvas.value })

  // Load the initial BPMN XML from your endpoint
  try {
    const response = await fetch('http://localhost:3000/mcp/resource/bpmn-diagram')
    const data = await response.json()
    const xml = data.contents[0].text
    await modeler.importXML(xml)
  } catch (err) {
    console.error('Error importing BPMN XML:', err)
  }

  // Listen for live updates via SSE
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
