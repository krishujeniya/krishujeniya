echo "Enter File Name:"
read a
touch $a
echo "File Created" 
echo "-----------------------------------"
echo "File Content" 
echo -e "My name is AI\nline 1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10" > $a
cat $a


