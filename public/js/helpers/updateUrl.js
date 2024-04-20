export default function (codeHash) {
    history.replaceState({}, '', '/?h=' + codeHash);
}