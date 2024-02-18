type RawContent = {
    type: string;
    data?: string;
}

type GraphicalContent = RawContent & {
    image: string;
}

type JsonContent = RawContent & {
    dataType: string;
    parsed?: any;
}