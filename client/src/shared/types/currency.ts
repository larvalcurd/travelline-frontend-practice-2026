export type CurrencyOption = {
    code: string;
    label: string;
};

export type CurrencyInfo = {
    title: string;
    description: string;
};

export type CurrencyRowData = {
    amount: string;
    currencyCode: string;
    options: CurrencyOption[];
};

export type CurrencyConverterData = {
    headline: string;
    result: string;
    updatedAt: string;
    topRow: CurrencyRowData;
    bottomRow: CurrencyRowData;
    pairLabel: string;
    infoBlocks: CurrencyInfo[];
};
