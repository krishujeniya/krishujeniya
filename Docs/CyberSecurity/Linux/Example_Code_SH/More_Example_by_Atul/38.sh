a=0
b=1
i=3
echo "Fibonacci Series Upto 10 are as Follows:-"
echo $a
echo $b
while [[ $i -le 10 ]]
do
	c=$((a+b))
	echo $c
	a=$b
	b=$c
	i=$((i+1))
done
