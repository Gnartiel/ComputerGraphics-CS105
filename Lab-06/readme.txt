To run this code, you must:
    1. Download NodeJS and NPM at https://nodejs.org/en/download
    2. Run .msi file to install
    3. Open cmd and paste this code: 
        npm install --location=global typescript
        tsc -v
    * Troubleshooting *
        - If you run tsc -v, and are using PowerShell as the VSCode integrated terminal, 
        then you may see the error: "tsc.ps1 cannot be loaded because running scripts is disabled on this system"
        -> You have several options, such as run your commands using the classic Windows CMD prompt, Git Bash or use the tsc.cmd option instead.
            tsc.cmd -v
    4. In VSCode, install Live Server Extensions
    5. install three.js by cmd: npm install three --save-dev
    6. To run:
        6.1. file light.js, in file index.html, row 24, change src = "light.js"
        6.2. file texture.js, in file index.html, row 24, change src = "texture.js"
    7. Click Right at file index.html, choose "Open with Live Server"
