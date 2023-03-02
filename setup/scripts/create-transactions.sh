echo -e "$(tput setaf 3)Creating transactions"
tput sgr0
NODE_URL="$1"

curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "amount": 13,
  "sender": "92521d50-c3c3-4d28-b952-761226f270fa",
  "receiver": "18769950-52ae-44b2-8be8-94206dcfe0a2"
}' \
 $NODE_URL'/blobby/decentralised/transaction'

curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "amount": 10,
  "sender": "e3fe192e-858d-4aca-b878-b567276e6465",
  "receiver": "375de158-472e-46a9-a80c-6f7430e159ff"
}' \
 $NODE_URL'/blobby/decentralised/transaction'

curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "amount": 100,
  "sender": "375de158-472e-46a9-a80c-6f7430e159ff",
  "receiver": "e3fe192e-858d-4aca-b878-b567276e6465"
}' \
 $NODE_URL'/blobby/decentralised/transaction'

echo -e "$(tput setaf 2)Successfully created transactions \n"

echo "$(tput setaf 6)Mine created transactions"
echo "$(tput setaf 3)please wait..."
curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{}' \
 $NODE_URL'/blobby/mine'

echo -e "$(tput setaf 2)Successfully mined transactions \n"

tput sgr0
