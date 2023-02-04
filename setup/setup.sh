#!/bin/bash
clear
echo -e "$(tput setaf 4)Setting up blobby block \n"

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

# Check if the blobby blockchain nodes are up and running

$parent_path/scripts/health-check-nodes.sh


