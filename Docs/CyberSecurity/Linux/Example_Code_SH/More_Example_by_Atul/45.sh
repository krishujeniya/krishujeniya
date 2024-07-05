read -p "Enter String:-" str
read -p "Enter Character you want to remove from the String:-" rem
echo "$str" | tr -d $rem
