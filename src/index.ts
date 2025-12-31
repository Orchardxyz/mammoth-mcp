#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import mammoth from 'mammoth';
import * as fs from 'fs/promises';
import * as path from 'path';
import { z } from 'zod';

const server = new McpServer({
  name: 'mammoth-mcp',
  version: '0.0.1',
});

server.registerTool(
  'convert_docx_to_html',
  {
    description: 'Convert a DOCX file to HTML using mammoth. Supports reading from a file path and returns the HTML content.',
    inputSchema: {
      filePath: z.string().describe('Absolute path to the DOCX file to convert'),
    },
  },
  async ({ filePath }) => {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.access(absolutePath);
      
      const result = await mammoth.convertToHtml({ path: absolutePath });
      
      let output = `# Conversion Result\n\n`;
      output += `**File**: ${absolutePath}\n\n`;
      output += `## HTML Output:\n\n\`\`\`html\n${result.value}\n\`\`\`\n\n`;
      
      if (result.messages.length > 0) {
        output += `## Messages:\n\n`;
        result.messages.forEach((msg: any) => {
          output += `- ${msg.type}: ${msg.message}\n`;
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: output,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error converting DOCX file: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.registerTool(
  'convert_docx_to_html_with_images',
  {
    description: 'Convert a DOCX file to HTML with embedded images as base64 data URIs',
    inputSchema: {
      filePath: z.string().describe('Absolute path to the DOCX file to convert'),
    },
  },
  async ({ filePath }) => {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.access(absolutePath);
      
      const result = await mammoth.convertToHtml(
        { path: absolutePath },
        {
          convertImage: mammoth.images.imgElement(async (image: any) => {
            const buffer = await image.read();
            const base64 = buffer.toString('base64');
            const contentType = image.contentType || 'image/png';
            return {
              src: `data:${contentType};base64,${base64}`,
            };
          }),
        }
      );
      
      let output = `# Conversion Result (with images)\n\n`;
      output += `**File**: ${absolutePath}\n\n`;
      output += `## HTML Output:\n\n\`\`\`html\n${result.value}\n\`\`\`\n\n`;
      
      if (result.messages.length > 0) {
        output += `## Messages:\n\n`;
        result.messages.forEach((msg: any) => {
          output += `- ${msg.type}: ${msg.message}\n`;
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: output,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error converting DOCX file: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  await server.connect(new StdioServerTransport());
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
