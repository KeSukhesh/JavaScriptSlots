// 1. Desposit some money (user input)
// 2. How many lines does user want to bet on (use input)
// 3. collect a bet amount (user input)
// 4. spin the slot machine
// 5. check if user won
// 6. give the user their winnings / or lossees
// 7. play again or user has no money left

// ----------------------------------------------------------------------------
// there are two ways to write functions in javascript
//method one:
// function deposit() {

// }

// method two:
// const deposit = () => {

// }
// Both are the exact same thing LOL
// ----------------------------------------------------------------------------

const prompt = require("prompt-sync")();

// Variables for the slot machine
const ROWS = 3;
const COLS = 3;

//this is called an object
const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}
// doing SYMBOLS_COUNT["A"] -> 2

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}

// 1. Deposit some money (user input)
const deposit = () => {
    // this loops forever till valid ammount is entered.
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ")

        // this turns numbers in a string to actual number,
        // it would turn "hello" (no numbers) -> "NaN" for 'Not a Number'
        const numberDepositAmount = parseFloat(depositAmount); 

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again.");
        } else {
            return numberDepositAmount;
        }
    }
};

// 2. How many lines does user want to bet on (use input)
const getNumberOfLines = () => {
    // this loops forever till valid ammount is entered.
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ")
        const numberOfLines = parseFloat(lines); 

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.");
        } else {
            return numberOfLines;
        }
    }
};

// 3. collect a bet amount (user input)
const getBet = (balance, lines) => {
    // this loops forever till valid ammount is entered.
    while (true) {
        const bet = prompt("Enter the bet per line: ")
        const numberBet = parseFloat(bet); 

        if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
            console.log("Invalid bet, try again.");
        } else {
            return numberBet;
        }
    }
};

// 4. spin the slot machine pt1
const spin = () => {
    // an array that has all the symbols we can have
    const symbols = [];

    //this loops through each entry in an object
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            //adds the symbols to the array by 'pushing them'
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        // for every coloumn it adds a reel ([])
        reels.push([]);

        // copies the symbols (from array) we have available into another array
        const reelSymbols = [...symbols];

        for (let j = 0; j < ROWS; j++) {

            // randomly select an index/positon from the reelSymbols array (the copy)
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];

            // adds the selected symbol to our reel
            reels[i].push(selectedSymbol);

            // removes the element we added to our reel from the array so we don't select it again
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

// Right now the reels array/matrix looks like this
// [[A B C], [D D D], [A A A]]
// But these represent coloumns, and we need to check rows so what we do is
// transpose the matrix!!! MATH1131 MOMENT YOOOOO, giving us:
// [A D A]
// [B D A]
// [C D A]

// 4. spin the slot machine pt2
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {

            //accessing each indivudal coloumn,
            //for each coloumn we are getting element in the row (i)
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
}

// 4. spin the slot machine pt3
const printRows = (rows) => {
    // this for loop is iterating by item, (its a 2D array)
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

// 5. check if user won
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for(let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }

    return winnings;
}

// 6. give the user their winnings / or lossees
const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);

        balance -= bet * numberOfLines;

        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);

        balance += winnings;

        console.log("You won $" + winnings.toString());

        // 7. play again or user has no money left

        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n): ");
        if (playAgain != "y") break;
    }
    
}

game();