#!/bin/bash

# node client/bin/start.js \
#   --client-cert /media/jho/Data_500G/jho/projects/ibm/md_resources/linux/cert/crt_key/client.crt \
#   --client-key /media/jho/Data_500G/jho/projects/ibm/md_resources/linux/cert/crt_key/client.key \
#   --ca-cert /media/jho/Data_500G/jho/projects/ibm/md_resources/linux/cert/crt_key/ca.crt

export MCP_CLIENT_CERT_PATH=/media/jho/Data_500G/jho/projects/ibm/md_resources/linux/cert/crt_key/client.crt
export MCP_CLIENT_KEY_PATH=/media/jho/Data_500G/jho/projects/ibm/md_resources/linux/cert/crt_key/client.key
export MCP_CA_CERT_PATH=/media/jho/Data_500G/jho/projects/ibm/md_resources/linux/cert/crt_key/ca.crt
# Optional: export MCP_CLIENT_KEY_PASSPHRASE="your-passphrase"

npm start
