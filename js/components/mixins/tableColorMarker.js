export default {
    methods: {
        getRowCustomColorName(status) {
            const colorsRelationToStatusesMap = {
                createdContract: 'blue',
                formCreditRequest: 'blue',
                expertRequestCreditCalculation: 'blue',
                opercentrRequestCreditCalculation: 'blue',
                salesContractCreditCalculation: 'blue',
                carRegistrationCreditCalculation: 'blue',
                loanAppointmentCreditCalculation: 'blue',
                loanConfirmationCreditCalculation: 'blue',
                carIssuanceCreditCalculation: 'blue',

                formedContract: 'green',
                agreedCreditCalculation: 'green',
                duplicateCalculation: 'green',

                pendingByOpercentrCreditCalculation: 'yellow',
                pendingByExpertCreditCalculation: 'yellow',
                loanRequestCreditCalculation: 'yellow',
                quoteRequest: 'yellow',
                enactedCalculation: 'yellow',

                agreedNeedsAction: 'orange',
                agreedProgramNotFound: 'orange',

                cancelledBlank: 'red',
                spoiledCalculation: 'red',
                interruptedCalculation: 'red',
                rejectedCreditCalculation: 'red',

                agreedEditedCreditCalculation: 'violet',

                createdConsultation: 'white',

                closedConsultation: 'grey',
            };

            return colorsRelationToStatusesMap[status];
        },

        emitSingleOrMultipleCheckedStatus({ checkedRows, defaultButtons }) {
            const checkedStatusesArr = checkedRows.map(row => row.calculation_status);

            if (checkedStatusesArr.length === 1) {
                this.setSingleCheckedStatus(checkedRows[0], checkedStatusesArr[0]);
            } else if (checkedStatusesArr.length > 0) {
                this.setMultipleCheckedStatus(checkedRows, checkedStatusesArr);
            } else {
                this.setDefaultCheckedStatus(defaultButtons);
            }
        },
        setCheckboxDisableStatus(checkedRow) {
            this.data.productsTable.forEach((row) => {
                row.checkbox.enabled = (
                    row.insurance_consultation_id === checkedRow.insurance_consultation_id
                    && row.product_subtype_alias === checkedRow.product_subtype_alias
                );
            });
        },
        setDefaultCheckedStatus(defaultButtons) {
            this.data.buttonsStatus = defaultButtons;

            this.data.productsTable.forEach((row) => {
                row.checkbox.enabled = true;
            });

            // this.data.statusEdit.isVisible = false;
        },
    },
};
