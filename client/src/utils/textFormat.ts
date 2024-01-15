const checkTextLength = (text: string) => {
    if (text.length > 15) {
        return text.slice(0,15).concat("...")
    }
    return text
}

export const textFormat = (text: string) => {
    const texts = text.split(' ')
    
    let textFormat = ''
    for (let substring of texts) {
        textFormat += substring.charAt(0).toUpperCase() + 
            substring.slice(1, substring.length).toLowerCase() + ' '
    }
    return checkTextLength(textFormat)
}
