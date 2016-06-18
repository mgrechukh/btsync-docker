#!/bin/sh

nodejs btsync.js init

if [ "$#" -eq 2 ]
then
	nodejs btsync.js add-folder $1 $2
fi

nodejs btsync.js restart

while :; do nodejs console.js; done

