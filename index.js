const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-CopyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector(".data-indicator");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols="!@#$%^&*()_+{}:~|/<>=-]["
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle to grey
setIndicator("#ccc");

//set passwordLength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";

}
function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;

}
function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;

}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
function generateRandomNumber(){
    return getRandomInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbols(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSymbol=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSymbol=true;
    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength >=8){
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper) && (hasNum||hasSymbol) && passwordLength>=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";

    }
    catch(e){
        copyMsg.innerText="failed";
    }
    //To make copy wala span visible
    copyMsg.classList.add("active");
    //to make copy wala span invisible
    setTimeout(()=>{copyMsg.classList.remove("active");},2000);

}

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount=checkCount+1;
        }
    });
    //special condition
     if(passwordLength<checkCount){
         passwordLength=checkCount;
         handleSlider();
     }
}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
generateBtn.addEventListener('click',()=>{
    //none of the checkbox is ticked
  
    if(checkCount==0){
        return;
    }


    if(passwordLength<checkCount){
        passwordLength=checkCount;
   
        handleSlider();
    }
    //New password
    //remove old password
 
    password="";
 
    let funcArr=[];
    if (uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked){
        funcArr.push(generateSymbols);
    }
    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
  
    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRandomInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }

    //shuffle the password
    password=shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;
    calcStrength();


})
