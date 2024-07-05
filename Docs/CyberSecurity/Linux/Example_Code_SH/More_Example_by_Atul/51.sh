read -p "Enter Filename:-" file
character=`cat $file | wc -c`
word=`cat $file | wc -w`
line=`cat $file | wc -l`
echo "Total Characters in $file:- $character"
echo "Total Word in $file:- $word"
echo "Total Lines in $file:- $line"
