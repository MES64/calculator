"use strict";

// ToDo
// - Set limit to output given to display
// - Keyboard input

//---------- Read and Write to Display ----------//

function readFromDisplay() {
    return checkIfEqualsPresent() ? display.textContent.slice(2) : display.textContent;
}

function writeToDisplay(finalOutput) {
    display.textContent = (checkIfEqualsPresent() && finalOutput[0] !== "=") ? `= ${finalOutput}` : finalOutput;
    display.scrollLeft = display.scrollWidth;
}

//---------- Parse Display String ----------//

function parseToCalculate(calculationString) {
    const arrayOfInputs = parseInput(calculationString);

    if (checkIfCanCalculate(arrayOfInputs)) {
        let number1, operator1, number2, operator2;
        [number1, operator1, number2, operator2] = arrayOfInputs;

        let result;
        if (operator2 === undefined) {
            result = `= ${calculate(+number1, +number2, operator1)}`;
        }
        else {
            result = `= ${calculate(+number1, +number2, operator1)} ${operator2} `;
        }

        if (result.includes("= ÷ by 0?")) {
            writeToDisplay("= ÷ by 0?");
        }
        else {
            writeToDisplay(result);
        }
    }
}

function checkIfCanCalculate(arrayOfInputs) {
    return (arrayOfInputs.length > 2) && (arrayOfInputs[2] !== "-");
}

function parseInput(calculationString) {
    return calculationString
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
    if (number2 === 0) return "÷ by 0?";
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

    if (checkDivideByZeroError()) {
        allClear();
    }

    if (checkButtonIsNumber(btn)) {
        if (checkIfEditAnswer()) {
            allClear();
        }
        const nextDisplayText = readFromDisplay() + btn.id;
        updateDisplay(nextDisplayText);
    }
    else if (checkButtonIsOperator(btn)) {
        const nextDisplayText = readFromDisplay() + ` ${btn.id} `;
        updateDisplay(nextDisplayText);
    }
    else {
        specialButtonPressed(btn);
    }
}

function specialButtonPressed(btn) {
    if (btn.id === "ac") {
        allClear();
    }
    else if (btn.id === "back") {
        removeLastSymbol();
    }
    else if (btn.id === "=") {
        parseToCalculate(readFromDisplay());
    }
}

function updateDisplay(nextDisplayText) {
    let finalOutput;
    if (checkLastInputIsNumber(nextDisplayText)) {
        finalOutput = processInputIfNumber(nextDisplayText);
    }
    else {  // Last input is operator
        finalOutput = processInputIfOperator(nextDisplayText);
    }

    if (checkIfSecondOperator(finalOutput)) {
        parseToCalculate(finalOutput);
    }
    else {
        writeToDisplay(finalOutput);
    }
}

function checkIfSecondOperator(finalOutput) {
    return finalOutput
        .split(" ")
        .filter((item) => item !== "")
        .length === 4;
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
    return readFromDisplay();
}

function processInputIfOperator(nextDisplayText) {
    const prevNumberAsString = getNumberFromPreviousInput(nextDisplayText);
    if (checkIsStartOfNegativeNumber(prevNumberAsString)) {
        return readFromDisplay();
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
    return readFromDisplay() + "-";
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
    else if (checkIfEditAnswer()) {
        allClear();
    }
    else {
        removeLastCharacter();
    }
}

// Check if trying to remove operator

function checkIfLastCharacterIsSpace() {
    return readFromDisplay().slice(-1)[0] === " ";
}

// Checks for =

function checkIfEditAnswer() {
    return checkIfEqualsPresent() && checkIfEditFirstNumber();
}

function checkIfEqualsPresent() {
    return display.textContent[0] === "=";
}

function checkIfEditFirstNumber() {
    const arrayOfInputs = readFromDisplay()
        .split(" ")
        .filter((item) => item !== "");
    return arrayOfInputs.length === 1;
}

function checkDivideByZeroError() {
    return display.textContent === "= ÷ by 0?";
}

// Remove Symbols

function removeLastOperator() {
    writeToDisplay(readFromDisplay().slice(0, -3));
}

function removeLastCharacter() {
    writeToDisplay(readFromDisplay().slice(0, -1));
}

//---------- Main ----------//

const display = document.querySelector("#display");
const btns = document.querySelector("#btns");
btns.addEventListener("click", processButtonPress);