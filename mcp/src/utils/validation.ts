import { MCPCommand } from "../mcp/bpmn";

export interface ValidationResult {
    isValid: boolean;
    errors?: string[];
}

export function validateCommand(command: MCPCommand): ValidationResult {
    const errors: string[] = [];

    if (!command.action) {
        errors.push('Action is required');
    }

    if (!command.elementType) {
        errors.push('Element type is required');
    }

    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
    };
}

export function validateCommandArgs(args: any, schema: any): ValidationResult {
    // TODO: Implement JSON Schema validation
    return {
        isValid: true
    };
} 