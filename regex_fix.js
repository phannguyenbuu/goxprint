const tryFormatJson = (str) => {
    if (!str) return '';
    try {
        const obj = JSON.parse(str);
        // Sometimes the string has actual newlines that get stringified to \n
        // Sometimes it has backslash-n that get stringified to \\n
        // We replace both `\\\\n` (which is two backslashes + n) and `\\n` (one backslash + n)
        return JSON.stringify(obj, null, 2)
            .replace(/\\\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\\\t/g, '\t')
            .replace(/\\t/g, '\t');
    } catch(e) {
        return str
            .replace(/\\\\n/g, '\n')
            .replace(/\\n/g, '\n')
            .replace(/\\\\t/g, '\t')
            .replace(/\\t/g, '\t');
    }
};
