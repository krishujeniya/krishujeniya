read -p "Enter N:-" n
i=1
sum=0
while [ $i -le $n ]
do
	sum=$(( sum+i ** 2 ))
	i=`expr $i + 1`
done
echo "Answer:-$sum"

