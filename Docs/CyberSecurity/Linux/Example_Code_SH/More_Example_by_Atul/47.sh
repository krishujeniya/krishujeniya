read -p "Enter String in Lowercase:-" lower
echo "Lowercase String:-"
echo $lower
echo "Uppercase String:-"
echo $lower | tr '[:lower:]' '[:upper:]'
