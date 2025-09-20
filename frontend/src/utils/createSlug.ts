export const createSlug = (title: string, id: number) => {
    const titleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    return `${titleSlug}-${id}`;
};

export const extractIdFromSlug = (slug: string): number => {
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    return parseInt(lastPart, 10);
};