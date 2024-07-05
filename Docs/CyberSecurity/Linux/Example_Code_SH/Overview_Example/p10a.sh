echo "Enter No-1:"
read a
echo "Enter No-2:"
read b
echo "Enter No-3:"
read c
m=0
if [ $a -gt $b ] && [ $a -gt $c ] 
then
	echo "Max= $a"
elif [ $b -gt $a ] && [ $b -gt $c ]
then 
	echo "Max= $b"
else
	echo "Max= $c"
fi
