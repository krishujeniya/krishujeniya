read -p "Enter No:-" n
if [ $((n % 2)) -eq 0 ]
then
	echo "$n is a EVEN Number"
else
	echo "$n is an ODD Number"
fi

