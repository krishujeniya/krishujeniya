read -p "Enter No-1:-" n1
read -p "Enter No-2:-" n2
read -p "Enter No-3:-" n3
if [ $n1 -lt $n2 ] && [ $n1 -lt $n3 ]
then
	echo "$n1 is less than $n2,$n3"
elif [ $n2 -lt $n1 ] && [ $n2 -lt $n3 ]
then
	echo "$n2 is less than $n1,$n3"
else
	echo "$n3 is less than $n1,$n2"
fi
