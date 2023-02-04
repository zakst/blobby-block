echo -e "$(tput setaf 6)Starting to health check nodes \n"

NODE_URLS="$@"

for node_url in $NODE_URLS
do
  echo "$(tput setaf 6)Health Check for $node_url"
  tput sgr0
  curl -I -H "Content-type:application/json" -X GET $node_url"/blobby/health-check"
  curl_exit_status=$?
  if [ $curl_exit_status != 0 ]
  then
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
