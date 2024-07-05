read -p "Enter No-1:-" n1
read -p "Enter No-2:-" n2
read -p "Enter No-3:-" n3
if [ $n1 -gt $n2 ] && [ $n1 -gt $n3 ]
then
	echo "$n1 is greater than $n2,$n3"
elif [ $n2 -gt $n1 ] && [ $n2 -gt $n3 ]
then
	echo "$n2 is greater than $n1,$n3"
else
	echo "$n3 is greater than $n1,$n2"
fi
