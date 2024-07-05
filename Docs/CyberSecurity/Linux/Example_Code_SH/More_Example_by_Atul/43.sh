read -p "Enter Name:-" file
if [ -d $file ]
then
        echo "It is a Directory. Contents of Directory are:-"
        ls $file
elif [ -f $1 ]
then
        echo "It is a File. Content of File are:-"
        cat $file
else
        echo "Please Try Again :("
fi
