export const Language = {
    Hebrew: 'he',
    English: 'en'
} as const;

export type Language = typeof Language[keyof typeof Language];