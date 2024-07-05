read -p "Enter Filename:-" filename
find . -type f  ! -name "*.*"  -delete
echo "File Without Extension Deleted Successfully"
