type RawContent = {
    type: string;
    data?: string;
}


type JsonContent = RawContent & {
    dataType: string;
    parsed?: any;
}