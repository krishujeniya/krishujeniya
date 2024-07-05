#!/bin/bash
echo "Enter File Name :"
read a
echo "Content in $a"
cat $a
echo "Number of Character :"
wc -m < $a
echo "Number of Words :"
wc -w < $a
echo "Number of Lines:"
wc -l < $a





