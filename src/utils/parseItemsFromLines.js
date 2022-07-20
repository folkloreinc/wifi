function parseItemsFromLines(out, properties, resetProperty = null, valueDelimiter = ' ') {
    const { items } = out
        .split('\n')
        .map((it) => it.trim())
        .reduce(
            ({ item: currentItem, items: currentItems }, line) => {
                const [label, value = null] = line.split(valueDelimiter, 1);
                const key = label.trim();
                if (typeof properties[key] !== 'undefined' && value !== null) {
                    const reset = key === resetProperty;
                    const property = properties[key];
                    return {
                        item: reset
                            ? {
                                  [property]: value.trim(),
                              }
                            : {
                                  ...currentItem,
                                  [property]: value.trim(),
                              },
                        items:
                            currentItem !== null && reset
                                ? [...currentItems, currentItem]
                                : currentItems,
                    };
                }
                return {
                    item: currentItem,
                    items: currentItems,
                };
            },
            {
                item: null,
                items: [],
            },
        );
    return items;
}

export default parseItemsFromLines;
