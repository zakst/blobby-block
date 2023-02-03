#!/bin/bash -l
set -euo pipefail

NODE_BASE_URL='http://localhost:'

# Update the port numbers with the ones you chose to run the blobby block on
NODE_URLS=($NODE_BASE_URL'5000', $NODE_BASE_URL'5001', $NODE_BASE_URL'5002', $NODE_BASE_URL'5003')

for node_url in "${NODE_URLS[@]}"
do
	echo "$node_url"
done
