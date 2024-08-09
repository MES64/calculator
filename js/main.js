"use strict";

//---------- Calculation ----------//

function plus(number1, number2) {
    return number1 + number2;
}
function minus(number1, number2) {
    return number1 - number2;
}
function multiply(number1, number2) {
    return number1 * number2;
}
function divide(number1, number2) {
    if (number2 === 0) throw new Error("Divide by zero error! (number2 = 0)");
    return number1 / number2;
}

function calculate(number1, number2, operator) {
    let result;
    switch(operator) {
        case "+":
            result = plus(number1, number2);
            break;
        case "-":
            result = minus(number1, number2);
            break;
        case "x":
            result = multiply(number1, number2);
            break;
        case "÷":
            result = divide(number1, number2);
            break;
        default:
            throw new Error("Invalid Operator (operator1): Must be +, -, x, ÷");
    }
    return result;
}

//---------- Button Input Processing: Main Logic ----------//

function processButtonPress(event) {
    const btn = event.target;

    let nextDisplayText = display.textContent;
    if (checkButtonIsNumber(btn)) {
        nextDisplayText += btn.id;
    }
    else if (checkButtonIsOperator(btn)) {
        nextDisplayText += ` ${btn.id} `;
    }
    else {
        console.log("Special Button Pressed");
        return;
    }
    updateDisplay(nextDisplayText);
}

function updateDisplay(nextDisplayText) {
    let finalOutput;
    if (checkLastInputIsNumber(nextDisplayText)) {
        finalOutput = processInputIfNumber(nextDisplayText);
    }
    else {
        finalOutput = processInputIfOperator(nextDisplayText);
    }
    display.textContent = finalOutput;
}

function processInputIfNumber(nextDisplayText) {
    const numberAsString = getNumberFromLatestInput(nextDisplayText);
    if (checkIsValidNumber(numberAsString)) {
        return nextDisplayText;
    }
    if (checkIsStartOfNegativeNumber(numberAsString)) {
        return removeSpacesAroundMinus();
    }
    if (checkIsStartOfDecimal(numberAsString)) {
        return insertZeroBeforeDecimal(nextDisplayText);
    }
    return display.textContent;
}

function processInputIfOperator(nextDisplayText) {
    const prevNumberAsString = getNumberFromPreviousInput(nextDisplayText);
    if (checkIsStartOfNegativeNumber(prevNumberAsString)) {
        return display.textContent;
    }
    if (checkIsStartOfDecimal(prevNumberAsString)) {
        return insertZeroAfterDecimal(nextDisplayText);
    }
    return nextDisplayText;
}

//---------- Button Input Processing: Small Helper Functions ----------//

// Edit Next Display Text

function insertZeroBeforeDecimal(nextDisplayText) {
    return nextDisplayText.slice(0, -1) + "0.";
}

function insertZeroAfterDecimal(nextDisplayText){
    return nextDisplayText.slice(0, -3) + "0" + nextDisplayText.slice(-3);
}

function removeSpacesAroundMinus() {
    return display.textContent + "-";
}

// Check Number

function checkIsValidNumber(numberAsString) {
    return !isNaN(+numberAsString);
}

function checkIsStartOfNegativeNumber(numberAsString) {
    return numberAsString === "-";
}

function checkIsStartOfDecimal(numberAsString) {
    return numberAsString.slice(-1) === ".";
}

// Get Most Recent Number

function getNumberFromLatestInput(nextDisplayText) {
    return nextDisplayText
        .split(" ")
        .filter((item) => item !== "")
        .slice(-1)[0];
}

function getNumberFromPreviousInput(nextDisplayText) {
    return nextDisplayText
        .split(" ")
        .filter((item) => item !== "")
        .slice(-2, -1)[0];
}

// Check Which Button Pressed

function checkButtonIsNumber(btn) {
    const btnClasses = Array.from(btn.classList);
    return btnClasses.includes("number");
}

function checkButtonIsOperator(btn) {
    const btnClasses = Array.from(btn.classList);
    return btnClasses.includes("operator")
}

// Check last entry is a number

function checkLastInputIsNumber(nextDisplayText) {
    const arrayOfInputs = nextDisplayText
        .split(" ")
        .filter((item) => item !== "");
    return arrayOfInputs.length % 2 !== 0;  // Every odd entry is a number input
}

//---------- Main ----------//

const display = document.querySelector("#display");
const btns = document.querySelector("#btns");
btns.addEventListener("click", processButtonPress);

let number1;
let operator;
let number2;

let displayText = "-10.2 - -2";

[number1, operator, number2] = displayText.split(" ");

//display.textContent = calculate(+number1, +number2, operator);