import re

lines = []
lines_mod = []
dict = {}

with open('dict.html',encoding='utf-8')as f:
    lines= f.readlines()


#print("lines:", len(lines))
buf = ""

for line in lines:
    line = line.rstrip()
    m = re.match(r'.+</li>.*', line)
    if not m:
        #print("no end:", line);
        buf += line
    else:
        lines_mod.append(buf + line)
        buf = ""

#print("lines_mod:", len(lines_mod))

for line in lines_mod:
    #m = re.match(r'^\s*mxUtils\.extend\((\S+)\s*,\s*(\S+)\s*\).*', entry)
    #m = re.match(r'\"(\S+)\".+\-(\S+)\.', line)
    #m = re.match(r'.+value=\"(\S+)\"', line)
    m = re.match(r'.+value=\"(\S+)\".+button>\s*(.+\.)', line)
    if m:
      #print(m.group(1))
      #print(m.group(2))
      dict[m.group(1)] = m.group(2)

print("<script>")
print("   let menu_dict = {")
for k in dict:
    k2 = k.replace('/','$').replace('.','_')
    print("      " +k2+":'"+ dict[k] + "',")
print("   }")
print("</script>")
print("</body>")
print("</html>")
