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

echo -e "$(tput setaf 3)Creating a few more transactions to mine another block"

curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "amount": 103,
  "sender": "e3fe192e-858d-4aca-b878-b567276e6465",
  "receiver": "375de158-472e-46a9-a80c-6f7430e159ff"
}' \
 $NODE_URL'/blobby/decentralised/transaction'


curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "amount": 76,
  "sender": "f631ec51-b9a8-4032-b960-e34f5e1fefc9",
  "receiver": "1f23a431-bbf9-4290-afd9-eba79e995359"
}' \
 $NODE_URL'/blobby/decentralised/transaction'

curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "amount": 7600,
  "sender": "985cdc05-de20-4c96-9ca3-d6a1e92c6e46",
  "receiver": "ec4aa3eb-955a-4769-8b9c-ed0e172da9d8"
}' \
 $NODE_URL'/blobby/decentralised/transaction'

curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{
  "amount": 58,
  "sender": "ec4aa3eb-955a-4769-8b9c-ed0e172da9d8",
  "receiver": "985cdc05-de20-4c96-9ca3-d6a1e92c6e46"
}' \
 $NODE_URL'/blobby/decentralised/transaction'

echo -e "$(tput setaf 2)Successfully created transactions \n"

echo "$(tput setaf 6)Mine the newly created transactions"
echo "$(tput setaf 3)please wait..."
curl -s -o /dev/null -i -X POST \
   -H "Content-Type:application/json" \
   -d \
'{}' \
 $NODE_URL'/blobby/mine'

echo -e "$(tput setaf 2)Successfully mined transactions \n"

tput sgr0
