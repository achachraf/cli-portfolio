type RawContent = {
    type: string;
}

type TextualContent = RawContent & {
    text: string;
}

type GraphicalContent = RawContent & {
    image: string;
}