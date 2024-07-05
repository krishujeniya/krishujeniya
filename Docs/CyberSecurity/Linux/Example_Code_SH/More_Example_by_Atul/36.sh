read -p "Enter No:-" n
num=$n
ans=0
while [ $n -ne 0 ]
do
	dig=`expr $n % 10`
	ans=`expr $ans \* 10 + $dig`
	n=`expr $n / 10`
done
echo "Reversed of $num is $ans"
