# My Cursor MCP Extension

A Cursor IDE extension that provides MCP (Model Command Protocol) command support.

## Features

- MCP command processing and execution
- Command validation and error handling
- Integration with Cursor IDE

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run compile
   ```

3. Run the extension in development mode:
   ```bash
   npm run watch
   ```

## Project Structure

```
my-cursor-mcp-extension/
├── package.json          // Project metadata and dependencies
├── tsconfig.json         // TypeScript compiler configuration
├── manifest.json         // Cursor IDE extension manifest/configuration
├── README.md             // Project overview and usage instructions
└── src/
    ├── extension.ts      // Entry point; handles extension activation and command registration
    ├── mcp/
    │   ├── mcp.ts        // Contains the MCP command definitions and processing logic
    │   └── commands.ts   // Registers specific MCP commands with the Cursor IDE API
    └── utils/
        └── validation.ts // Utilities for validating commands using JSON Schema or other methods
```

## Development

- Use `npm run compile` to compile the TypeScript code
- Use `npm run watch` to watch for changes and recompile automatically
- Use `npm run lint` to run the linter

## License

MIT 