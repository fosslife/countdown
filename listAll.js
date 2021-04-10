const fig = require('figlet');

const allFonts = fig.fontsSync();

for (const font of allFonts){
    console.log("####", font);
    console.log(fig.textSync("Hello JS!", font))
}