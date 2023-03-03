#!/bin/bash
clear

NODE_BASE_URL='http://localhost:'

# Update the port numbers with the ones you chose to run the blobby block on
NODE_URLS=($NODE_BASE_URL'5000' $NODE_BASE_URL'5001' $NODE_BASE_URL'5002' $NODE_BASE_URL'5003')

echo -e "$(tput setaf 4)Setting up blobby block \n"

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# Check if the blobby blockchain nodes are up and running
$parent_path/scripts/health-check-nodes.sh "${NODE_URLS[@]}"

# Register all nodes
$parent_path/scripts/register-nodes.sh "${NODE_URLS[@]}"

# Create some transactions and mine them
$parent_path/scripts/create-mine-transactions.sh "${NODE_URLS[0]}"
