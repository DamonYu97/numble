package standrews.cs5031.numble.impl;

import standrews.cs5031.numble.Cell;
import standrews.cs5031.numble.MethodNotAvailableException;
import standrews.cs5031.numble.NumbleModel;
import standrews.cs5031.numble.data.EquationData;

import java.util.LinkedList;
import java.util.List;

/**
 * Model implementation for the hard Numble game.
 */
public class NumbleModelHardModeImpl implements NumbleModel {

    private final int numCols;
    private final int numRows;

    /**
     * The desired equation.
     */
    private final String equation;

    private int numberOfGuessMade;
    private Cell[][] cells;

    private boolean won = false;
    private boolean lost = false;


    public NumbleModelHardModeImpl(int numRows, int numCols) {
        this.numCols = numCols;
        this.numRows = numRows;

        numberOfGuessMade = 0;
        cells = new Cell[numRows][numCols];
        for (int row = 0; row < numRows; row++) {
            for (int col = 0; col < numCols; col++) {
                cells[row][col] = new Cell(row, col);
            }
        }

        //Get a random equation from data source.
        this.equation = EquationData.getRandomEquation(Mode.HARD, numCols);
    }

    public int evaluate(String expression) throws IllegalArgumentException {
        //Splits guess string into each operator and the number its operating on. (as we are evaluating left to right)
        String[] guessParts = expression.split("((?=\\*))|((?=\\/))|((?=\\+))|((?=\\-))");

        int total = 0;
        for (int i = 0; i < guessParts.length; i++) {
            //if operator isnt * or /, just parse string and add to running total
            if (!guessParts[i].contains("*") && !guessParts[i].contains("/")) {

                int temp = Integer.parseInt(guessParts[i]);
                total += temp;
            } else if (guessParts[i].charAt(0) == '*') {

                int temp = Integer.parseInt(guessParts[i].substring(1));
                total = total * temp;
            } else if (guessParts[i].charAt(0) == '/') {

                int temp = Integer.parseInt(guessParts[i].substring(1));
                if(total % temp==0){
                    total = total / temp;
                }else{
                    throw new IllegalArgumentException("No decimal values");
                }

            }
        }
        return total;
    }


    @Override
    public boolean guess(String guess) {
        if (hasLost() || hasWon()) {
            throw new MethodNotAvailableException("Game is over, no more guess can be made");
        }
        if (isValidGuess(guess)) {
            //Store guess characters in cells
            storeGuess(guess);
            boolean isCorrect = isCorrectSolution(guess);
            numberOfGuessMade++;
            if (isCorrect) {
                won = true;
            } else {
                if (numberOfGuessMade >= numRows) {
                    lost = true;
                }
            }
            return isCorrect;
        } else {
            throw new IllegalArgumentException("Invalid guess input: " + guess);
        }

    }

    private void storeGuess(String guess) {
        for (int i = 0; i < numCols; i++) {
            cells[numberOfGuessMade][i].guessChar = guess.charAt(i);
        }
    }


    private boolean isCorrectSolution(String guess) {
        boolean isCorrect = true;
        //Mark if the character in lhs has been compared with the same character in guess.
        boolean[] comparedWithGuess = new boolean[guess.length()];
        //Find all characters in right place.
        for (int i = 0; i < guess.length(); i++) {
            char guessChar = guess.charAt(i);
            if (isCorrect(guessChar, i)) {
                cells[numberOfGuessMade][i].state = Cell.State.CORRECT;
                comparedWithGuess[i] = true;
            }
        }

        for (int i = 0; i < guess.length(); i++) {
            if (cells[numberOfGuessMade][i].state == Cell.State.CORRECT) {
                continue;
            }
            char guessChar = guess.charAt(i);
            if (exist(guessChar, comparedWithGuess)) {
                //Guess character in wrong place
                cells[numberOfGuessMade][i].state = Cell.State.WRONG_POSITION;
            } else {
                //Incorrect guess character
                cells[numberOfGuessMade][i].state = Cell.State.NOT_EXIST;
            }
            isCorrect = false;
        }
        return isCorrect;
    }

    private boolean isValidGuess(String guess) {
        //Check guess is of the correct length
        if(guess.length() != equation.length()){
            return false;
        }
        if (!containsAllRightChars(guess)) {
            return false;
        }
        //Check guess has no invalid symbols and lhs really equals to rhs
        try {
            int equationMarkIndex = guess.indexOf('=');
            if (equationMarkIndex < 0) {
                return false;
            }
            String lhs = guess.substring(0, equationMarkIndex);
            String rhs = guess.substring(equationMarkIndex + 1);
            return evaluate(lhs) == evaluate(rhs);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * This checks if guess reused all characters which are the “right character, right place” and “right
     * character, wrong place”.
     * @param guess the String equation player guessed
     * @return true if all right characters in last guess is in current guess expression, false otherwise.
     */
    private boolean containsAllRightChars(String guess) {
        List<Character> lastRightCharsGuessed = getLastRightCharsGuessed();
        for (int i = 0; i < guess.length(); i++) {
            if (lastRightCharsGuessed.size() == 0) {
                break;
            }
            char guessChar = guess.charAt(i);
            lastRightCharsGuessed.remove(Character.valueOf(guessChar));
        }
        return lastRightCharsGuessed.size() <= 0;
    }

    /**
     * This extracts all characters in previous row which are marked as "CORRECT" or "WRONG_POSITION".
     * @return a list of characters rightly guessed in previous row.
     */
    private List<Character> getLastRightCharsGuessed() {
        List<Character> lastRightCharsGuessed = new LinkedList<>();
        if (numberOfGuessMade - 1 >= 0) {
            for (Cell cell : cells[numberOfGuessMade - 1]) {
                if (cell.state == Cell.State.CORRECT || cell.state == Cell.State.WRONG_POSITION) {
                    lastRightCharsGuessed.add(cell.guessChar);
                }
            }
        }
        return lastRightCharsGuessed;
    }


    @Override
    public boolean hasLost() {
        return lost;
    }

    @Override
    public boolean hasWon() {
        return won;
    }

    @Override
    public boolean isCorrect(char guessChar, int position) {
        return guessChar == equation.charAt(position);
    }

    @Override
    public boolean exist(char guessChar, boolean[] comparedWithGuess) {
        for (int i = 0; i < equation.length(); i++) {
            if (!comparedWithGuess[i] && guessChar == equation.charAt(i)) {
                comparedWithGuess[i] = true;
                return true;
            }
        }
        return false;
    }

    @Override
    public int getNumCols() {
        return numCols;
    }

    @Override
    public int getNumRows() {
        return numRows;
    }

    @Override
    public int getNumberOfGuessMade() {
        return numberOfGuessMade;
    }

    @Override
    public Cell[][] getCells() {
        return cells;
    }

    @Override
    public Mode getMode() {
        return Mode.HARD;
    }
}