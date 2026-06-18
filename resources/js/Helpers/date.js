export function formatDate(dateString, options = {}) {
    if (!dateString) return null;

    const date = new Date(dateString);

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        ...options,
    });
}
