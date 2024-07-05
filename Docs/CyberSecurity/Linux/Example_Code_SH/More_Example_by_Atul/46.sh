read -p "Enter String-1:-" st1
read -p "Enter String-2:-" st2
st=$st1$st2
len=`echo $st | wc -c `
len=`expr $len - 1`
echo "Concatenation of Strings $st1 and $st2 = $st and its length is $len"
