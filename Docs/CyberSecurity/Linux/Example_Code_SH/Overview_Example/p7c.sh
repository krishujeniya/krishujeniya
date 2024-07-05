echo "Enter File 1:"
read a
echo "Enter File 2:"
read b
cp $a $b
echo "---------------------- File 1 ----------------"
cat $a
echo "---------------------- File 2 ----------------"
cat $b
