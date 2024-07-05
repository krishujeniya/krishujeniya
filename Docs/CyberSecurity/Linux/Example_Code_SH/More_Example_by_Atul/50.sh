read -p "Enter No-1:-"  n1
read -p "Enter No-2:-"  n2
read -p "Enter No-3:-"  n3
read -p "Enter No-4:-"  n4
read -p "Enter No-5:-"  n5
ar=($n1 $n2 $n3 $n4 $n5)
max=${ar[0]}
for n in "${ar[@]}"
do
	((n > max)) && max=$n
done
echo "Maximum Number from $n1,$n2,$n3,$n4,$n5 = $max"
