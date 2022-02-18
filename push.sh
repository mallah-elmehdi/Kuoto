#!/bin/bash
while true
do
        echo "------------PUSHING...------------"
        git add .
		read commitmessage
        git commit -m "$commitmessage"
        git push
        echo "------------FINISHED------------"
        sleep 10
done