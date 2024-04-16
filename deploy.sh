#i/bin/bash
DEST=~/public_html/TetrisX2
   declare -a FILES=("index.html" "tetris.js" "styles.css")
   mkdir -p $DEST
   for i in "${FILES[@]}"
   do
       echo "Copying $i to $DEST"
       cp "$i" $DEST/.
   done
