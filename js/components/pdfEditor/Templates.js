const errorHandler = (error) => {
    return {
        content: [
            {
                text: [
                    ' Не правильно сформована структура печатної форми. Для детального ознайомлення перейдіть за ',
                    {
                        text: 'посиланням',
                        link: 'https://pdfmake.github.io/docs/document-definition-object/',
                        color: '#209cee',
                        decoration: 'underline',
                    },
                    '.',
                ],
                marginTop: 30,
            },
            {
                marginTop: 20,
                text: [error.name, ':'],
                color: '#e74c3c',
            },
            {
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {
                                text: error.message,
                                color: '#e74c3c',
                                margin: 5,
                                fontSize: 10,
                            }
                        ]
                    ]
                },
                fillColor: '#f5f5f5',
                layout: 'noBorders',
                marginTop: 10,
            }
        ],
    };
};

const footer = (currentPage, pageCount) => {
    return {
        margin: 10,
        columns: [
            {
                fontSize: 9,
                text: [
                    {
                        text: '______________' +
                        '\n',
                    },
                    {
                        fontSize: 10,
                        text: `${currentPage} / ${pageCount}`,
                        margin: 20,
                    },
                ],
                alignment: 'center',
            },
        ]
    };
};

const watermark = {
    text: 'ЗРАЗОК',
    opacity: 0.3,
    bold: true,
    italics: false,
}

export {
    errorHandler,
    footer,
    watermark,
};
