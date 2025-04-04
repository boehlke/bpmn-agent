///////////////////////////////////////////////////////////
// 1. Base Interfaces and Command Definitions
///////////////////////////////////////////////////////////

export interface BaseCommand {
    action: 'create' | 'update' | 'move' | 'delete';
    elementType: string;
}

///////////////////////////////////////////////////////////
// 2. Create Commands for BPMN Tree Elements
///////////////////////////////////////////////////////////

// --- BPMN Definitions (Root Element) ---
export interface DefinitionsAttributes {
    id: string;
    name?: string;
    // Other definitions-specific attributes can be added here.
}

export interface CreateDefinitionsCommand extends BaseCommand {
    action: 'create';
    elementType: 'bpmn:Definitions';
    attributes: DefinitionsAttributes;
    // Definitions are the root so no position or parentId needed.
}

// --- BPMN Process ---
export interface ProcessAttributes {
    id: string;
    name: string;
    isExecutable?: boolean;
}

export interface CreateProcessCommand extends BaseCommand {
    action: 'create';
    elementType: 'bpmn:Process';
    attributes: ProcessAttributes;
    // Processes must be part of a Definitions element.
    parentId: string;
}

// --- BPMN Collaboration ---
export interface CollaborationAttributes {
    id: string;
    name?: string;
}

export interface CreateCollaborationCommand extends BaseCommand {
    action: 'create';
    elementType: 'bpmn:Collaboration';
    attributes: CollaborationAttributes;
    parentId: string; // Typically under Definitions.
}

// --- BPMN Lane (for organizing processes) ---
export interface LaneAttributes {
    id: string;
    name: string;
}

export interface CreateLaneCommand extends BaseCommand {
    action: 'create';
    elementType: 'bpmn:Lane';
    attributes: LaneAttributes;
    parentId: string; // For example, the ID of the LaneSet element.
}

// --- BPMN Task (Generic Task) ---
export interface TaskAttributes {
    id: string;
    name: string;
    isForCompensation?: boolean;
    documentation?: string;
}

export interface CreateTaskCommand extends BaseCommand {
    action: 'create';
    elementType: 'bpmn:Task';
    attributes: TaskAttributes;
    position: { x: number; y: number };
    parentId: string; // Usually the process or a sub-container.
}

// --- BPMN UserTask ---
export interface UserTaskAttributes {
    id: string;
    name: string;
    assignee?: string;
}

export interface CreateUserTaskCommand extends BaseCommand {
    action: 'create';
    elementType: 'bpmn:UserTask';
    attributes: UserTaskAttributes;
    position: { x: number; y: number };
    parentId: string;
}

// --- Extend with additional element types as needed ... ---

// Union type for all create commands
type CreateCommand =
    | CreateDefinitionsCommand
    | CreateProcessCommand
    | CreateCollaborationCommand
    | CreateLaneCommand
    | CreateTaskCommand
    | CreateUserTaskCommand;

///////////////////////////////////////////////////////////
// 3. Update, Move, and Delete Commands
///////////////////////////////////////////////////////////

// Generic Update Command - can be extended with element-specific details.
export interface UpdateCommand extends BaseCommand {
    action: 'update';
    id: string;
    // A partial record that can include any updatable attributes.
    attributes: Partial<DefinitionsAttributes & ProcessAttributes & CollaborationAttributes & LaneAttributes & TaskAttributes & UserTaskAttributes>;
}

// Move Command - used for repositioning elements that have a visual component.
export interface MoveCommand extends BaseCommand {
    action: 'move';
    id: string;
    position: { x: number; y: number };
}

// Delete Command - remove an element from the BPMN tree.
export interface DeleteCommand extends BaseCommand {
    action: 'delete';
    id: string;
}

// Overall MCP Command union type
export type MCPCommand = CreateCommand | UpdateCommand | MoveCommand | DeleteCommand;

///////////////////////////////////////////////////////////
// 4. Example: Command Processing Function
///////////////////////////////////////////////////////////

export function processCommand(cmd: MCPCommand): void {
    switch (cmd.action) {
        case 'create':
            switch (cmd.elementType) {
                case 'bpmn:Definitions':
                    console.log(`Creating Definitions: ${cmd.attributes.name || cmd.attributes.id}`);
                    break;
                case 'bpmn:Process':
                    console.log(`Creating Process: ${cmd.attributes.name} under Definitions ${cmd.parentId}`);
                    break;
                case 'bpmn:Collaboration':
                    console.log(`Creating Collaboration: ${cmd.attributes.name || cmd.attributes.id} under Definitions ${cmd.parentId}`);
                    break;
                case 'bpmn:Lane':
                    console.log(`Creating Lane: ${cmd.attributes.name} under LaneSet ${cmd.parentId}`);
                    break;
                case 'bpmn:Task':
                    console.log(`Creating Task: ${cmd.attributes.name} at (${cmd.position.x}, ${cmd.position.y}) in parent ${cmd.parentId}`);
                    break;
                case 'bpmn:UserTask':
                    console.log(`Creating UserTask: ${cmd.attributes.name} with assignee ${cmd.attributes.assignee} at (${cmd.position.x}, ${cmd.position.y}) in parent ${cmd.parentId}`);
                    break;
            }
            break;

        case 'update':
            console.log(`Updating element ${cmd.id} with attributes:`, cmd.attributes);
            break;

        case 'move':
            console.log(`Moving element ${cmd.id} to position (${cmd.position.x}, ${cmd.position.y})`);
            break;

        case 'delete':
            console.log(`Deleting element ${cmd.id}`);
            break;
    }
}

///////////////////////////////////////////////////////////
// 5. Example Usage
///////////////////////////////////////////////////////////

// Create Definitions
// const createDefinitionsCommand: CreateDefinitionsCommand = {
//     action: 'create',
//     elementType: 'bpmn:Definitions',
//     attributes: { id: 'defs_1', name: 'Main Definitions' }
// };

// processCommand(createDefinitionsCommand);

// // Create a Process under Definitions
// const createProcessCommand: CreateProcessCommand = {
//     action: 'create',
//     elementType: 'bpmn:Process',
//     attributes: { id: 'proc_1', name: 'Main Process', isExecutable: true },
//     parentId: 'defs_1'
// };

// processCommand(createProcessCommand);

// // Create a BPMN Task in the Process
// const createTaskCommand: CreateTaskCommand = {
//     action: 'create',
//     elementType: 'bpmn:Task',
//     attributes: { id: 'task_1', name: 'Generic Task', isForCompensation: false },
//     position: { x: 120, y: 180 },
//     parentId: 'proc_1'
// };

// processCommand(createTaskCommand);

// // Create a BPMN UserTask in the Process
// const createUserTaskCommand: CreateUserTaskCommand = {
//     action: 'create',
//     elementType: 'bpmn:UserTask',
//     attributes: { id: 'userTask_1', name: 'Review Task', assignee: 'Alice' },
//     position: { x: 200, y: 300 },
//     parentId: 'proc_1'
// };

// processCommand(createUserTaskCommand);
