# Build, Install, and Run Guide for MCP Inspector

This guide provides instructions on how to build, install, and run the MCP Inspector project from the source code.

## Prerequisites

- **Node.js**: Version 22.7.5 or higher.
- **npm**: Comes with Node.js.

## Installation

1.  **Clone the repository** (if you haven't already):

    ```bash
    git clone https://github.com/jacklotusho/inspector.git
    cd inspector
    ```

2.  **Install dependencies**:
    This project uses npm workspaces. Run the following command in the root directory to install dependencies for all packages (`client`, `server`, `cli`):
    ```bash
    npm install
    ```

## Build

To build the entire project (Client, Server, and CLI):

```bash
npm run build
```

This command runs:

- `npm run build-server`
- `npm run build-client`
- `npm run build-cli`

## Run

### Development Mode

To run the inspector in development mode with hot-reloading:

```bash
npm run dev
```

**Note for Windows users:**

```bash
npm run dev:windows
```

### Production Mode

To run the inspector in production mode (requires building first):

1.  **Build the project**:

    ```bash
    npm run build
    ```

2.  **Start the application**:
    ```bash
    npm start
    ```

This will start the inspector client UI (default port 6274) and the proxy server (default port 6277).

### Docker

To run the inspector using Docker:

```bash
docker run --rm --network host -p 6274:6274 -p 6277:6277 ghcr.io/modelcontextprotocol/inspector:latest
```

### CLI Mode

To run the CLI version of the inspector from the source:

```bash
npm run build # Ensure it is built first
node cli/build/cli.js <command> [args]
```

Or using `npx` within the project:

```bash
npx . --cli <command> [args]
```

## Client (mTLS) Certificate Configuration

This project supports Mutual TLS (mTLS) authentication. You can configure client certificates using Environment Variables, CLI Flags, or the UI.

### 1. Using CLI Flags

You can pass certificate paths directly when starting the inspector:

```bash
npx @modelcontextprotocol/inspector \
  --client-cert /path/to/client.crt \
  --client-key /path/to/client.key \
  --ca-cert /path/to/ca.crt \
  node build/index.js
```

**Available Flags:**

- `--client-cert <path>`: Path to client certificate (PEM format)
- `--client-key <path>`: Path to client private key (PEM format)
- `--client-key-passphrase <passphrase>`: Passphrase for encrypted private key
- `--ca-cert <path>`: Path to CA certificate for server verification

### 2. Using Environment Variables

You can set the following environment variables before starting the inspector:

```bash
export MCP_CLIENT_CERT_PATH="/path/to/client.crt"
export MCP_CLIENT_KEY_PATH="/path/to/client.key"
export MCP_CA_CERT_PATH="/path/to/ca.crt"
# Optional: export MCP_CLIENT_KEY_PASSPHRASE="your-passphrase"

npm start
```

**Available Variables:**

- `MCP_CLIENT_CERT_PATH`
- `MCP_CLIENT_KEY_PATH`
- `MCP_CLIENT_KEY_PASSPHRASE`
- `MCP_CA_CERT_PATH`

### 3. Using the UI

1. Open the Inspector in your browser (default: `http://localhost:6274`).
2. Click on the **Configuration** button in the sidebar.
3. Locate the Certificate Configuration section.
4. You can enter file paths or paste the PEM content directly.
5. Click **Save** to apply the settings.

## Common Scripts

- `npm run clean`: Clean all `node_modules` and build directories, then reinstall dependencies.
- `npm run test`: Run tests.
- `npm run lint`: Run linting checks.
- `npm run prettier-fix`: specific format code.
