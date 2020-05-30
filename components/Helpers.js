/*
    File to contain reusable functions
*/

// generates options used for dropdown
export function generateOptions(options) {
    let l = [];
    for (let i = 0; i < options.length; i++) {
      l.push(<option value={options[i]}>{options[i]}</option>);
    }
    return l;
}
