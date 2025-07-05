
#TARGET_DIR="./index.html"

#BEFORE="\"\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/dist\/mxgraph\.es\.js\""
#AFTER="\"\.\.\/\.\.\/\.\.\/\.\.\/dist\/mxgraph\.es\.js\""
#find ${TARGET_DIR}  -type f
#find ${TARGET_DIR}  -type f | xargs sed -i "s/${BEFORE}/${AFTER}/g"
#find ${TARGET_DIR}  -type f | xargs sed  "s/${BEFORE}/${AFTER}/g"
#

#TARGET_FILE="./tmp.html"
#BEFORE="<li><a href="
#AFTER="<li><button value="

#sed -i  "s/${BEFORE}/${AFTER}/g" ${TARGET_FILE}

#BEFORE="html\">"
#AFTER="html\" onclick=\"show(this)\">"

#sed -i  "s/${BEFORE}/${AFTER}/g" ${TARGET_FILE}

#BEFORE="a>"
#AFTER="button>"

#sed -i  "s/${BEFORE}/${AFTER}/g" ${TARGET_FILE}

TARGET_FILE="./index.html"
#BEFORE="button> \- .+$"
BEFORE="button> \- .+" 
AFTER="button><\/li>"

sed  -E -i  "s/${BEFORE}/${AFTER}/g" ${TARGET_FILE}
