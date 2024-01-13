import React, {useState, useEffect} from "react"

interface Props {
    text: string,
    delay: number
}

/**
 * 
 * @text represents the text message that the user 
 * @delay represents the time it takes for each letter to be displayed 
 * @function checkTextLength will cut the text if it is over 15 characters long
 * @function addNextCharacter will make sure to display each letter with a delay
 */

const Typewriter: React.FC<Props> = ({text, delay}) => {
    const [visibleText, setVisibleText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    
    useEffect(() => {
        const addNextCharacter = () => {
            setVisibleText((prevText) => prevText + text[currentIndex])
            setCurrentIndex((prevIndex) => prevIndex + 1)
        }

        let intervalId = setInterval(() => {
            if (currentIndex < text.length)
                addNextCharacter()
            else
                clearInterval(intervalId)
        }, delay)

        return () => {
            clearInterval(intervalId)
        }
    }, [text, delay, currentIndex])
    
    return <span>{visibleText}</span>
}

export default Typewriter
