export default {
    data() {
        return {
            optionsTypeFile: [
                {
                    name: 'Povidomlennya',
                    type: 'text',
                },
                {
                    name: 'Fayly',
                    type: 'file',
                },
                {
                    name: 'Statusy dohovoriv',
                    type: 'calculationStatusChange',
                },
            ],
            optionsPerPage: [
                {
                    id: 10,
                    name: '10',
                },
                {
                    id: 15,
                    name: '15',
                },
                {
                    id: 20,
                    name: '20',
                },
                {
                    id: 30,
                    name: '30',
                },
            ],
        };
    },
};
