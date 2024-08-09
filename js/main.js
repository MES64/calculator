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

let number1;
let operator;
let number2;

let display = "-10.2 - -2";

[number1, operator, number2] = display.split(" ");

console.log(calculate(+number1, +number2, operator));