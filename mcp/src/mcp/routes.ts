import express from 'express';
import { MCPCommand, processCommand } from './bpmn';

const router = express.Router();

/**
 * @openapi
 * /mcp/command:
 *   post:
 *     summary: Process an MCP command.
 *     description: Receives an MCP command payload and processes it.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MCPCommand'
 *     responses:
 *       200:
 *         description: Command processed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 */
router.post('/command', (req: express.Request, res: express.Response) => {
  const command: MCPCommand = req.body;

  try {
    // (Optional) Validate the command here using your validation utils
    processCommand(command);
    res.status(200).json({ status: 'success', command });
  } catch (error: any) {
    console.error('Error processing command:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
