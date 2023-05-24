const Convert = {
    getCommand({ content }) {
        const parseMsg = content.split(" ");
        return parseMsg[0];
    },
    getUsers() {},
    getContent({ command, content }) {
        const removedCmd = content.replace(`${command} `, '');
        return removedCmd;
    }
}

exports.Convert = Convert;