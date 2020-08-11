export default {
    data() {
        return {
            buttonsFormulaEditor: [
                {
                    class: 'info',
                    controls: ['І','АБО','ЯКЩО','ТОДІ','ІНАКШЕ','КІНЕЦЬ','=','<','>','<=','>=','==','!=', ]
                },{
                    class: 'warning',
                    controls: ['(',')'],
                },{
                    class: 'success',
                    controls: ['+', '-', '*', '/',],
                },{
                    class: 'danger',
                    controls: ['"', ';', '\\n',],
                }, 
            ],
        };
    },
};
