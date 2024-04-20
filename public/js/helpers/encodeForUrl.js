export default function (data) {
    return btoa(data)
        .replace(/\+/g, '-') // Replace + with -
        .replace(/\//g, '_') // Replace / with _
        .replace(/=+$/, ''); // Remove trailing =
}