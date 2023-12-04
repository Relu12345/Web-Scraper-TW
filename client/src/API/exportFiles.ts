interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
}

const ExportFiles = async (valuesToExport: ResponseMessageText[], type: string) => {
    try {
        const response = await fetch('http://localhost:5000/api/exportData', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({values: valuesToExport, type: type})
        })

        return response
    } catch (error) {
        console.error("Error at sending data that has to be exported to the server: ", error)
    }
}

export {ExportFiles}