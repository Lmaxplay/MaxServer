$sassBlock = {
    sass.exe -w page/
}

$tsBlock = {
    tsc -w --project ./tsconfig.json
}

Start-Job -ScriptBlock $sassBlock
Start-Job -ScriptBlock $tsBlock
nodemon "src/index.ts"