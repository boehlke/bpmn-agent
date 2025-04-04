import { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp';
import server from './server';
import BPMNModdle from 'bpmn-moddle';
import { z, ZodRawShape } from 'zod';
import { bpmnModdle } from './server';
/**
 * A BPMNModdle instance for creating BPMN elements
 */

/**
 * Simple in-memory registry for demonstration.
 * In a real application, you might store these in a DB or
 * another persistent structure.
 */
const elementRegistry = new Map<string, BPMNModdle.BaseElement>();

/**
 * Helper to auto-generate IDs if none provided.
 */
function getOrGenerateId(proposedId?: string) {
  if (proposedId && proposedId.trim() !== '') {
    return proposedId;
  }
  return 'element_' + Math.random().toString(36).substr(2, 9);
}


/**
 * A small wrapper around server.tool that:
 * 1) Receives a Zod schema for parameters.
 * 2) Validates input at runtime.
 * 3) Passes the typed data to the callback.
 */
function tool<Args extends ZodRawShape>(
  name: string,
  paramsSchema: Args,
  cb: ToolCallback<Args>
) {
  // We create a ZodObject from the shape:
  const schema = z.object(paramsSchema).strict();

  // Then wrap `server.tool`:
  server.tool(
    name,
    `Dynamically generated tool for: ${name}`,
    paramsSchema,
    cb
  );
}

/**
 * Example: createBpmnProcess
 */
tool(
  'createBpmnProcess',
  {
    id: z.string().optional(),
    name: z.string().optional(),
    processType: z.enum(['None', 'Public', 'Private']).default('None'),
    isExecutable: z.boolean().default(false),
    isClosed: z.boolean().default(false)
  },
  async ({ id, name, processType, isExecutable, isClosed }) => {
    const finalId = getOrGenerateId(id);

    const process = bpmnModdle.create('bpmn:Process', {
      id: finalId,
      name,
      processType,
      isExecutable,
      isClosed
    });

    elementRegistry.set(finalId, process);

    return { content: [{ type: "text", text: `Created BPMN Process with id=${finalId}` }] };
  }
);

/**
 * Example: createBpmnTask
 */
tool(
  'createBpmnTask',
  {
    id: z.string().optional(),
    name: z.string().optional(),
    isForCompensation: z.boolean().default(false)
  },
  async ({ id, name, isForCompensation }) => {
    const finalId = getOrGenerateId(id);

    const task = bpmnModdle.create('bpmn:Task', {
      id: finalId,
      name,
      isForCompensation
    });

    elementRegistry.set(finalId, task);

    return { content: [{ type: "text", text: `Created BPMN Task with id=${finalId}` }] };
  }
);

/**
 * Example: createBpmnUserTask
 */
tool(
  'createBpmnUserTask',
  {
    id: z.string().optional(),
    name: z.string().optional(),
    implementation: z.string().default('##unspecified'),
    isForCompensation: z.boolean().default(false)
  },
  async ({ id, name, implementation, isForCompensation }) => {
    const finalId = getOrGenerateId(id);

    const userTask = bpmnModdle.create('bpmn:UserTask', {
      id: finalId,
      name,
      implementation,
      isForCompensation
    });

    elementRegistry.set(finalId, userTask);

    return { content: [{ type: "text", text: `Created BPMN UserTask with id=${finalId}` }] };
  }
);

/**
 * Example: createBpmnSequenceFlow
 */
tool(
  'createBpmnSequenceFlow',
  {
    id: z.string().optional(),
    name: z.string().optional(),
    isImmediate: z.boolean().default(false)
  },
  async ({ id, name, isImmediate }) => {
    const finalId = getOrGenerateId(id);

    const sequenceFlow = bpmnModdle.create('bpmn:SequenceFlow', {
      id: finalId,
      name,
      isImmediate
    });

    elementRegistry.set(finalId, sequenceFlow);

    return { content: [{ type: "text", text: `Created BPMN SequenceFlow with id=${finalId}` }] };
  }
);

/**
 * Example: Connect two elements by setting a reference property
 */
tool(
  'connectBpmnElements',
  {
    sourceElementId: z.string(),
    referenceProperty: z.string(),
    targetElementId: z.string()
  },
  async ({ sourceElementId, referenceProperty, targetElementId }) => {
    const source = elementRegistry.get(sourceElementId);
    const target = elementRegistry.get(targetElementId);

    if (!source) {
      throw new Error(`No element with id='${sourceElementId}' found.`);
    }
    if (!target) {
      throw new Error(`No element with id='${targetElementId}' found.`);
    }

    (source as any)[referenceProperty] = target;
    return { content: [{ type: "text", text: `Set ${referenceProperty} of ${sourceElementId} to ${targetElementId}` }] };
  }
);