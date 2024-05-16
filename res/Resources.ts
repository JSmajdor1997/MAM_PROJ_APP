export const Resources = {
    Colors: {
        Primary: "#00bfa5",
        White: "#FFFFFF",
        Black: "#000000",
        Beige: "#eee",
        Grey: "#00000055",
        Red: "#ad3a28",
        Blue: "#3886c2",
    } as const,
    Fonts: {
        Primary: "leafy"
    } as const,
    Locale: {
        LanguageCode: "pl-PL"
    } as const,
    Strings: {

    } as const,
    Env: {
        GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY as string
    } as const
}