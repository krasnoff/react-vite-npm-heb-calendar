export const Format = {
    LARGE: 0,
    SMALL: 1
} as const;

export type Format = typeof Format[keyof typeof Format];