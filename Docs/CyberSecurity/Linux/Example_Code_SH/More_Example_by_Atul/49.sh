read -p "Enter String:-" st
len=`echo $st | wc -c`
while [ $len -gt 0 ]
do
	rev=$rev`echo $st | cut -c $len`
	len=`expr $len - 1`
done
echo "Reversed String of $st is :-$rev"
if [[ $st = $rev ]] 
then 
	echo "The Given String is Palindrome"
else
	echo "Given String is Not Palindrome"
fi
