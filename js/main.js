"use strict";

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

let number1 = -10.5;
let operator1 = "÷";
let number2 = 0;

let result;
switch(operator1) {
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

console.log(result);