echo "(i)"
echo "Q-Enter Directory Name:" 
read fn
mkdir $fn
echo "Directory created"
echo "List of Directory:"
ls
echo "----------------------------------"
echo "(ii)"
echo "Q-Rename Directory:"
read rename
mv $fn $rename
echo "List of Directory:"
ls
echo "----------------------------------"
echo "(iii)"
echo "Q-Remove Directory:"
read rm_dir
rmdir $rm_dir
echo "Directory Removed"
echo "List of Directory:"
ls

