echo "Enter n:"
read n
s=0
for((i=1;i<=n;i++))
do 
	echo "Enter No $i :"
	read a
	s=$((s + a))
done
echo "Sum= $s"
av=$((s / n))
echo "Average= $av"
