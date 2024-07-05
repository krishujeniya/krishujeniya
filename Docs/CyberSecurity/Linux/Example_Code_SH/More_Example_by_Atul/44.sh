read -p "Enter Filename:-" filename
read -p "Enter Word to Find It's Occurence:-" word
echo "The Occurence of word $word is "
grep -o -i $word $filename | wc -l

