# mammoth-mcp

[![NPM version](https://img.shields.io/npm/v/mammoth-mcp.svg?style=flat)](https://npmjs.com/package/mammoth-mcp)
[![NPM downloads](http://img.shields.io/npm/dm/mammoth-mcp.svg?style=flat)](https://npmjs.com/package/mammoth-mcp)

A Model Context Protocol (MCP) server for converting DOCX files to HTML using [mammoth.js](https://github.com/mwilliamson/mammoth.js).

## Features

- **convert_docx_to_html**: Convert DOCX files to clean HTML
- **convert_docx_to_html_with_images**: Convert DOCX files to HTML with embedded base64 images

## Installation

```bash
$ pnpm install
```

## Development

```bash
$ npm run dev
$ npm run build
```

## Usage

### Configure MCP Client

Add the server to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "mammoth": {
      "command": "node",
      "args": ["/absolute/path/to/mammoth-mcp/dist/cjs/index.js"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "mammoth": {
      "command": "mammoth-mcp"
    }
  }
}
```

### Available Tools

#### convert_docx_to_html

Convert a DOCX file to HTML.

**Parameters:**
- `filePath` (string, required): Absolute path to the DOCX file

**Example:**
```typescript
{
  "filePath": "/path/to/document.docx"
}
```

#### convert_docx_to_html_with_images

Convert a DOCX file to HTML with images embedded as base64 data URIs.

**Parameters:**
- `filePath` (string, required): Absolute path to the DOCX file

**Example:**
```typescript
{
  "filePath": "/path/to/document-with-images.docx"
}
```

## How It Works

This MCP server uses mammoth.js to convert DOCX documents to clean, semantic HTML. The conversion preserves:

- Headings
- Paragraphs
- Lists
- Tables
- Bold/italic/underline formatting
- Images (when using the `with_images` variant)

## LICENSE

MIT
