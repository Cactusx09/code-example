export default {
    methods: {
        concatFieldsString(fields, dataArr) {
            let parts = [];

            for (let key in fields) {
                let item = null;
                if (fields === dataArr) {
                    item = this.i18n(dataArr[key].name);
                } else {
                    let unit = null;
                    if (key.endsWith('_value')) {
                        unit = dataArr[key.substring(0, key.length - '_value'.length) + '_type_name'];
                    } else {
                        unit = fields[key].units;
                    }

                    if (dataArr[key] >= 0) {
                        item = `${dataArr[key]} ${unit}`;
                    } else {
                        item = '-';
                    }
                }
                parts.push(item);
            };

            return parts.join(' / ');
        },

        sortFields(fields, a, b, initialKey) {
            const initialValue = initialKey ? a[initialKey] - b[initialKey] : 0;
            return Object.keys(fields)
                .reduce((result, key) => (result === 0 ? a[key] - b[key] : result), initialValue);
        },
    },
};
