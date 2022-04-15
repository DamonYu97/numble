import React from "react";


function Cell(props) {
    const easyValidInputPattern = "\\d|\\+|\\-|\\*|\\/";
    const hardValidInputPattern = "\\d|\\+|\\-|\\*|\\/|\\=|\\(|\\)"

    let validInputPattern = props.mode === 'EASY' ? easyValidInputPattern : hardValidInputPattern;

    if (props.cell.row === props.currentGuess && !props.won) {
        return <div className="input-cell " role={"navigation"} contentEditable={true} onKeyDown={cellKeyPressInput}
                    onKeyUp={cellKeyUp}/>
    } else {
        let cellColor = ''
        if (props.cell.state === 'CORRECT') {
            cellColor = 'correct'
        } else if (props.cell.state === 'WRONG_POSITION') {
            cellColor = 'wong-position'
        } else if (props.cell.state === 'NOT_EXIST') {
            cellColor = 'not-exist'
        }
        return <div className={'cell ' + cellColor} role={"navigation"}>{props.cell.guessChar}</div>
    }

    function cellKeyPressInput(e) {
        if (e.target.textContent.length === 1 || !e.key.match(validInputPattern)) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                e.currentTarget.textContent = '';
                console.log(e);
            } else if (e.key === "ArrowLeft") {
                e.target.previousSibling.focus();
            } else if (e.key === 'ArrowRight') {
                e.target.nextSibling.focus();
            }
            e.preventDefault();
        }
    }

    function cellKeyUp(e) {
        if (e.key.match(validInputPattern)) {
            if (e.target.textContent.length === 1) {
                e.currentTarget.textContent = e.key;
            }
            if (e.target.nextSibling !== undefined && e.target.nextSibling !== null) {
                e.target.nextSibling.focus();
            }
        }
    }
}

export default Cell;