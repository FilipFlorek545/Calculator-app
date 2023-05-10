
import './App.css';
import React, {useEffect, useRef, useState} from "react";
import {Button} from "./Button";

function App() {
    const [calc, setCalc] = useState('')
    const [calcRes, setCalcRes] = useState('')
    const [sign, setSign] = useState('')
    const [brackets, setBrackets] = useState(0)
    const values = [
        "(", ")", "%", "AC",
        "7", "8", "9", "/",
        "4", "5", "6", "*",
        "1", "2", "3", "-",
        "0", ".", "=", "+",
    ]
    let buttons = document.querySelectorAll('button');

    const addNumber = (value) => {
        if(calc.length === 0 && value === '0') return
        if(calc.length > 12 && Number(calc[calc.length]) !== undefined){
            alert('Too many numbers, continue from result')
            evaluate()
            return
        }
        setCalcRes('')
        if(sign && sign !== '(') {
            setCalc(calc + sign + value)
        }
        else{
            setCalc(calc + value)
        }
        setSign('')
    }

    const addSymbol = (value,e) => {
        if(calcRes) setCalc(calcRes) //if user wants to continue calculations on result
        if(sign === '(') return
        if(value === '%'){
            //Percentage with adding and substracting is not working ideally
            //if we need to evaluate values in brackets
            if(sign === ')') {
                let i = calc.split(/[()]/)
                let l = dontUseEval(i[i.length-2])
                l = Number(l)
                l /= Math.pow(100,1)
                i[i.length-2] = l
                i.join('')
                setCalc(i.join(''))
            }
            else{
                let i = calc.split(/[*\/+\-()]/)
                let cutter = i[i.length-1].length
                i = i.map(el => Number(el))
                let j = i[i.length-1] /= Math.pow(100,1)
                setCalc(calc.slice(0,-cutter).concat(j.toString()))
                return;
            }
        }
        if((calc !== '' || calcRes !== '') || value === '-'){
            e.target.classList.add('active')
            setSign(value)
        }
    }

    const addBrackets = (value) => {
            if(value === '('){
                //sign is here so the user cannot put brackets right after numbers --> '3 * (' instead of '3('
                if(calc === '' || sign){
                    setBrackets(brackets + 1)
                    if(sign && sign !== '('){
                        setCalc(calc + sign + value)
                        setSign(value)
                    }
                    else{
                        setCalc(calc + value)
                        setSign(value)
                    }
                }
            }
            else if(brackets > 0){
                setBrackets(brackets - 1)
                setCalc(calc + value)
                setSign(value)
            }
        }

    useEffect(() => {
        //callback for sign
        setCalc(calc)
        setCalcRes(calcRes)
        setSign(sign)
    },[sign, calc, calcRes])

    function dontUseEval(fn){
        return new Function('return ' + fn)();
    }

    const evaluate = () => {
        try {
            let i = dontUseEval(calc)
            if(i.toString().length > 15) i = Math.round(i.toFixed(10) * 10000000000) / 10000000000
            setCalcRes(i)
            setCalc('')
            setSign('')
            setBrackets(0)
        }
        catch (err) {
            alert('Error')
            clear()
        }
    }


    const clear = () => {
        setCalc('')
        setCalcRes('')
        setSign('')
        setBrackets(0)
    }

    const handleClick = (e) => {
        buttons.forEach(el => el.classList.remove('active'))
        let {innerText} = e.target;
        switch (innerText){
            case "1" : case "2" : case "3" :
            case "4" : case "5" : case "6" :
            case "7" : case "8" : case "9" : case "0" :
                addNumber(innerText);
                break;
            case "+" : case "-" : case "%" :
            case "*" : case "/" : case '.' :
                addSymbol(innerText,e);
                break;
            case '(': case ')':
                addBrackets(innerText)
                break;
            case "=":
                evaluate()
                break;
            case ("AC"):
                clear()
                break;
            default:
                break;
        }
    }

  return (
    <div className="App">
        <div className="container">
            <div className="top">
                <span>{calcRes}</span>
                <input className='calcInput' readOnly type="text" value={calc ? calc : calcRes}/>
            </div>
            <div className="keyboard">
                    {values.map((value, i) =>
                        <Button key={i} onClick={handleClick} value={value} />
                    )}
            </div>
        </div>
    </div>
  );
}

export default App;
