read -p "Enter No:-" n
sum=0
while [ $n -ne 0 ]
do
	dig=`expr $n % 10`
	sum=`expr $sum + $dig`
	n=`expr $n / 10`
done
echo "Sum of Digits:-$sum"
