// Global Variables
let currentInput = '0';  // Current display value
let shouldResetDisplay = false;  // Flag to reset display on next input

// Get display element reference
const display = document.getElementById('display');

/**
 * Function: Update the calculator display
 * Updates the display element with current input value
 */
function updateDisplay() {
    display.textContent = currentInput;
     display.scrollLeft = display.scrollWidth; // Auto scroll to the right
}

/**
 * Function: Clear the entire display (AC - All Clear)
 * Resets calculator to initial state
 */
function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

/**
 * Function: Delete the last entered character (Backspace)
 * Removes the last character from current input
 */
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

/**
 * Function: Add numbers or operators to the display
 * @param {string} value - The value to append (number or operator)
 */
function appendToDisplay(value) {
    // Reset display if needed (after calculation or initial state)
    if (shouldResetDisplay || currentInput === '0') {
        if ('+-×÷'.includes(value)) {
            // If operator is pressed after calculation, use previous result
            shouldResetDisplay = false;
        } else {
            // If number is pressed, start fresh
            currentInput = '';
            shouldResetDisplay = false;
        }
    }

    // Prevent multiple decimal points in the same number
    if (value === '.') {
        const lastNumber = currentInput.split(/[+\-×÷%]/).pop();
        if (lastNumber.includes('.')) {
            return; // Don't add another decimal point
        }
    }

    // Prevent consecutive operators (except for negative numbers)
    const lastChar = currentInput.slice(-1);
    if ('+-×÷%'.includes(value) && '+-×÷%'.includes(lastChar)) {
        return;
    }

    // Add the value to current input
    currentInput += value;
    updateDisplay();
}

/**
 * Function: Perform the calculation
 * Evaluates the mathematical expression and displays result
 */
function calculate() {
    try {
        // Replace display symbols with JavaScript operators
        let expression = currentInput
            .replace(/×/g, '*')    // Multiplication symbol
            .replace(/÷/g, '/')    // Division symbol
            .replace(/−/g, '-');   // Minus symbol

        // Handle percentage calculations
        expression = expression.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

        // Evaluate the mathematical expression
        const result = eval(expression);

        // Check for invalid results
        if (!isFinite(result)) {
            throw new Error('Invalid calculation');
        }

        // Update display with result
        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();

    } catch (error) {
        // Handle calculation errors
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

/**
 * Function: Toggle between dark and light themes
 * Switches theme and saves preference to localStorage
 */
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (body.getAttribute('data-theme') === 'dark') {
        // Switch to light mode
        body.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark mode
        body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

/**
 * Function: Load saved theme preference on page load
 * Retrieves theme from localStorage and applies it
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        themeToggle.textContent = '🌙';
    }
}

/**
 * Event Listener: Keyboard Support
 * Handles keyboard input for calculator operations
 */
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and operators
    if ('0123456789+-*/%.'.includes(key)) {
        event.preventDefault();
        let displayValue = key;
        
        // Convert keyboard symbols to display symbols
        if (key === '*') displayValue = '×';
        if (key === '/') displayValue = '÷';
        if (key === '-') displayValue = '−';
        
        appendToDisplay(displayValue);
    }
    // Enter or equals key for calculation
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Escape key for clear
    else if (key === 'Escape') {
        event.preventDefault();
        clearDisplay();
    }
    // Backspace for delete
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

/**
 * Event Listener: Initialize calculator when page loads
 * Loads theme preference and sets up initial display
 */
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    updateDisplay();
});