NODE_BASE_URL='http://localhost:'

echo -e "$(tput setaf 6)Starting to health check nodes \n"

# Update the port numbers with the ones you chose to run the blobby block on
NODE_URLS=($NODE_BASE_URL'5000' $NODE_BASE_URL'5001' $NODE_BASE_URL'5005' $NODE_BASE_URL'5003')

CURL_ERROR=0

for node_url in "${NODE_URLS[@]}"
do
  echo "$(tput setaf 5)Checking health for $node_url"
  tput sgr0
  curl -I -H "Content-type:application/json" -X GET $node_url"/blobby/health-check"
  curl_exit_status=$?
  if [ $curl_exit_status != 0 ]
  then
    CURL_ERROR=$curl_exit_status
    echo "$(tput setaf 1)$(tput blink)$(tput bold)"
    echo -e "$node_url is inaccessible \n"
    tput sgr0
    echo "$(tput setaf 1)$(tput bold)"
    echo -e "Possible Issues are \n"
    echo "1. Make sure you ran the command PORT=YOUR_PORT_NUMBER yarn start:dev blockchain"
    echo -e "2. Make sure the NODES_URLS array is updated with the correct PORT Numbers default are 5000-5003 \n"
    echo "Otherwise follow the section Running the app in the README.md again"
    exit 1
  else
    echo -e "$(tput setaf 2)$node_url is alive! \n"
  fi
done

tput sgr0
