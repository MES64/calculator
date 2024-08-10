"use strict";

// ToDo
// Chain operators
// Divide by zero should message the display, not throw an error
// Set limit to output given to display
// Keyboard input
// Change character limit of display to display scroll

//---------- Parse Display String ----------//

function parseDisplayToCalculate() {
    const arrayOfInputs = parseDisplay();

    if (checkIfCanCalculate(arrayOfInputs)) {
        let number1, operator, number2;
        [number1, operator, number2] = arrayOfInputs;
        display.textContent = calculate(+number1, +number2, operator);
    }
}

function checkIfCanCalculate(arrayOfInputs) {
    return (arrayOfInputs.length === 3) && (arrayOfInputs[2] !== "-");
}

function parseDisplay() {
    return display.textContent
        .split(" ")
        .filter((item) => item !== "");
}

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
        if (display.textContent.length === 11) return;
        nextDisplayText += btn.id;
    }
    else if (checkButtonIsOperator(btn)) {
        if (display.textContent.length > 8) return;
        nextDisplayText += ` ${btn.id} `;
    }
    else {
        console.log("Special Button Pressed");
        specialButtonPressed(btn);
        return;
    }
    updateDisplay(nextDisplayText);
}

function specialButtonPressed(btn) {
    if (btn.id === "ac") {
        allClear();
    }
    else if (btn.id === "back") {
        removeLastSymbol();
    }
    else if (btn.id === "=") {
        parseDisplayToCalculate();
    }
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
        if (checkIfLeadingZero(numberAsString)) {
            return removeLeadingZero(nextDisplayText);
        }
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
    if (checkIsNothingAfterDecimal(prevNumberAsString)) {
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

function removeLeadingZero(nextDisplayText) {
    return nextDisplayText.slice(0,-2) + nextDisplayText.slice(-1);
}

// Check Number

function checkIsValidNumber(numberAsString) {
    return !isNaN(+numberAsString);
}

function checkIsStartOfNegativeNumber(numberAsString) {
    return numberAsString === "-";
}

function checkIsStartOfDecimal(numberAsString) {
    return numberAsString === "." || numberAsString === "-.";
}

function checkIsNothingAfterDecimal(numberAsString) {
    return numberAsString.slice(-1) === ".";
}

function checkIfLeadingZero(numberAsString) {
    let stringOfInterest = numberAsString;
    // Remove "-" at start as it does not affect leading zero check
    if (numberAsString[0] === "-") stringOfInterest = stringOfInterest.slice(1);
    // If have just "0" then need to leave for "0." and "0" cases,
    // so need to wait for next number at length 2
    // and then check if it starts with a 0 and ends with a number (0-9)
    return (stringOfInterest.length === 2) && 
           (stringOfInterest[0] === "0") && 
           (stringOfInterest[1] !== ".");
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

// Delete Functions

function allClear() {
    display.textContent = "";
}

function removeLastSymbol() {
    if (checkIfLastCharacterIsSpace()) {
        removeLastOperator();
    }
    else {
        removeLastCharacter();
    }
}

// Check if trying to remove operator

function checkIfLastCharacterIsSpace() {
    return display.textContent.slice(-1)[0] === " ";
}

// Remove Symbols

function removeLastOperator() {
    display.textContent = display.textContent.slice(0, -3);
}

function removeLastCharacter() {
    display.textContent = display.textContent.slice(0, -1);
}

//---------- Main ----------//

const display = document.querySelector("#display");
const btns = document.querySelector("#btns");
btns.addEventListener("click", processButtonPress);