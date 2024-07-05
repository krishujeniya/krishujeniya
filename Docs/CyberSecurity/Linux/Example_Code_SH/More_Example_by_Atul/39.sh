read -p "Enter No:-" n
a=0
b=1
i=3
echo $a
echo $b
while [[ $i -le $n ]]
do
	c=$((a+b))
	echo $c
	a=$b
	b=$c
	i=$((i+1))
done
