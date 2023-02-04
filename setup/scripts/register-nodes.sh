NODE_URLS="$@"

FIRST_NODE=${NODE_URLS:0:21}

echo -e "$(tput setaf 6)Broadcasting nodes \n"

tput sgr0

for node_url in $NODE_URLS
do
  echo "$(tput setaf 6)Broadcasting $node_url"

  tput sgr0

  HTTP_CODE=$(curl -o /dev/null -w "%{http_code}" -H "Content-Type:application/json" \
  -X POST $FIRST_NODE"/blobby/broadcast" \
     -d '{ "nodeUrl":  '\""${node_url}"\"' }')

  register_exit_status=$?

  if [ $register_exit_status != 0 ] || [ $HTTP_CODE -gt 201 ]
  then
    echo "$(tput setaf 1)$(tput blink)$(tput bold)"
    echo -e "Failed to broadcast $node_url \n"
    tput sgr0
    echo "$(tput setaf 1)$(tput bold)"
    echo -e "Make sure your nodes are alive \n"
    echo -e "Otherwise follow the section Running the app in the README.md again \n"
    exit 1
  else
    echo -e "$(tput setaf 2)$node_url broadcast successful! \n"
  fi
done

