function areAnyUndefined(list) {
    return list.filter((element) => {
            return element === undefined || element.length === 0
        }).length > 0;
}


// https://stackoverflow.com/questions/14446511
//  /most-efficient-method-to-groupby-on-an-array-of-objects
const groupBy = (alist, keyGetter) => {
    const map = new Map();

    alist.forEach((item) => {
        const key = keyGetter(item);

        const collection = map.get(key);

        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });

    return Array.from(map, ([name, value]) => ({ name, value }));
}

const topK = (aList, comparisonFn, k) => {
    const top = [];

    aList.forEach(element => {
        if (top.length < k) {
            top.push(element);
        } else {
            if (comparisonFn(element, top[0]) > 0) {
                top[0] = element;

                top.sort();
            }
        }
    });

    return top;
}

module.exports = {
    areAnyUndefined, groupBy, topK
};
