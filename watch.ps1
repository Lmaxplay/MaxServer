$sassBlock = {
    sass.exe -w page/
}

$tsBlock = {
    tsc -w --project ./tsconfig.json
}

Start-Job -ScriptBlock $sassBlock -Name "SASS"
Start-Job -ScriptBlock $tsBlock -Name "TSC"
nodemon "src/index.ts"