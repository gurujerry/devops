An attempt to convert Markdown to Google Slides using the unmaintained [Google Slides API access](https://github.com/googleworkspace/md2googleslides) repo. Assumes a Windows computer with Docker Desktop (using WSL).

Follow instruction on setting up to create the [client_id.json](./client_id.json) file

```bash
#docker run -it -p 3000:3000 --name "intern-demo" "node:18-alpine"
# This works
#docker run -it -v "${PWD}:/app" -p 3000:3000 --name "intern-demo" "node:18-alpine" /bin/sh
#docker run --rm -it -v "${PWD}/client_id.json:/root/.md2googleslides/client_id.json:ro" -v "${PWD}/Readme.md:/app/Readme.md" -w /app node:18-alpine sh
# Alpine doesn't have python, a requisite for one of the NPM packages so let's use the default image
docker run --rm -it -v "${PWD}/client_id.json:/root/.md2googleslides/client_id.json:ro" -v "${PWD}/Readme.md:/app/Readme.md" -w /app node:18 /bin/bash

docker run -it -p 3000:3000 -v "${PWD}/client_id.json:/root/client_id.json:ro" -v "${PWD}/Readme.md:/app/Readme.md" -w /app node:18 /bin/bash
mkdir /root/.md2googleslides/
cp /root/client_id.json /root/.md2googleslides/client_id.json
# Now in Linux NPM container, run command necessary to setup markdown to Google Docs
#npm install -g md2gslides
# Used a forked library with fixes
npm install -g @wescpy/md2gslides
# Check if client_id.json is missing redirect param and add if necesary
grep "redirect_uris" ~/.md2googleslides/client_id.json
#   If missing, run the 3 lines below
apt-get update
apt-get install -y jq
jq '.web.redirect_uris = ["http://localhost:3000/oauth2callback"]' ~/.md2googleslides/client_id.json > ~/.md2googleslides/tmp.json && mv ~/.md2googleslides/tmp.json ~/.md2googleslides/client_id.json
# Convert markdown to Google Doc
md2gslides /app/Readme.md --title "DevOps Title"

```
