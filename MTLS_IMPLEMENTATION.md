# Client Certificate (mTLS) Authentication Implementation

## Overview

This document describes the implementation of client certificate authentication (mutual TLS/mTLS) support in the MCP Inspector.

## Features

1. **Server-side (Proxy) Support**
   - Load client certificates from file system
   - Support for PEM format certificates and keys
   - Support for passphrase-protected private keys
   - Support for CA certificates for server verification

2. **Client-side (UI) Support**
   - Configuration UI for certificate paths
   - Support for uploading certificate files (stored in browser localStorage as base64)
   - Visual indicators for certificate status

3. **CLI Support**
   - Command-line flags for certificate paths
   - Environment variable support

## Configuration Options

### Environment Variables

- `MCP_CLIENT_CERT_PATH`: Path to client certificate file (PEM format)
- `MCP_CLIENT_KEY_PATH`: Path to client private key file (PEM format)
- `MCP_CLIENT_KEY_PASSPHRASE`: Passphrase for encrypted private key (optional)
- `MCP_CA_CERT_PATH`: Path to CA certificate for server verification (optional)

### CLI Flags

- `--client-cert <path>`: Path to client certificate
- `--client-key <path>`: Path to client private key
- `--client-key-passphrase <passphrase>`: Passphrase for private key
- `--ca-cert <path>`: Path to CA certificate

### UI Configuration

- Certificate configuration in the Configuration dialog
- Support for file upload or path specification
- Certificate validation and status display

## Implementation Details

### Server-side Changes

1. **Modified Files**
   - `server/src/index.ts`: Added certificate loading and HTTPS agent configuration
   - `cli/src/transport.ts`: Added certificate support for CLI transport creation

2. **New Dependencies**
   - Uses Node.js built-in `https` and `tls` modules
   - Uses `fs` for reading certificate files

### Client-side Changes

1. **Modified Files**
   - `client/src/lib/constants.ts`: Added certificate configuration items
   - `client/src/components/Sidebar.tsx`: Added certificate configuration UI
   - `client/src/lib/configurationTypes.ts`: Added certificate types

2. **Storage**
   - Certificates can be stored as base64 in localStorage for browser-based usage
   - File paths stored for proxy-based connections

# mTLS Implementation Plan for MCP Inspector

## Objective

Implement Mutual TLS (mTLS) authentication to secure communication between the MCP Inspector components (client/proxy) and MCP servers.

## Status: COMPLETE

## Architecture

- **Server (Proxy)**: Modified to accept client certificates and private keys. Uses these credentials when establishing connections to MCP servers (SSE/HTTP).
- **CLI**: Updated to accept certificate paths via command-line arguments and pass them to the server/transport.
- **Client (UI)**: Updated to allow users to configure client certificates, keys, and CA certificates directly in the settings. These are passed to the proxy.

## Components Modified

### 1. Server (`server/src/index.ts`)

- **Action**: Updated `createTransport` and added `createHttpsAgentWithClientCert`.
- **Details**:
  - Accepts `clientCert`, `clientKey`, `clientKeyPassphrase`, `caCert` from query parameters, CLI args, or Env vars.
  - Creates an `https.Agent` with these credentials.
  - Uses this agent for `fetch` requests in SSE and HTTP transports.

### 2. CLI (`cli/src/`)

- **Action**: updated `cli.ts`, `transport.ts`, `index.ts`.
- **Details**:
  - `cli.ts`: Parses flags: `--client-cert`, `--client-key`, `--client-key-passphrase`, `--ca-cert`.
  - `transport.ts`: Supports creating agents with local files for direct CLI usage.
  - `index.ts`: Passes these options to the transport factory.

### 3. Client (`client/`)

- **Action**: Updated `bin/start.js`, `lib/constants.ts`, `lib/configurationTypes.ts`, `components/Sidebar.tsx`, `hooks/useConnection.ts`.
- **Details**:
  - `bin/start.js`: Forwards CLI flags to the server process.
  - `Sidebar.tsx`: Renders configuration inputs for certificates. Passphrases are masked.
  - `constants.ts`: Adds default config keys.
  - `useConnection.ts`: Appends configured certificate parameters to the Proxy URL.

## Usage Guide

### CLI Usage

You can start the inspector with mTLS credentials using command-line flags:

```bash
npx @modelcontextprotocol/inspector \
  --client-cert ./certs/client.crt \
  --client-key ./certs/client.key \
  --ca-cert ./certs/ca.crt \
  node ./my-server.js
```

### UI Configuration

1. Open the Inspector in your browser.
2. Click on **Configuration** in the sidebar.
3. You will see fields for:
   - **Client Certificate**: Path to file or PEM content.
   - **Client Key**: Path to file or PEM content.
   - **Client Key Passphrase**: (Secret) Passphrase if key is encrypted.
   - **CA Certificate**: Path to file or PEM content.
4. Fill in these details and connect. The Proxy will use these credentials to authenticate with the target MCP server.

## Security Notes

- **Passphrases** are masked in the UI but stored in browser localStorage (part of `InspectorConfig`).
- **Private Keys** are sent to the local proxy server over the loopback interface. Ensure your local machine is secure.
- For maximum security, use file paths instead of pasting content to avoid persisting keys in browser storage.
  com
