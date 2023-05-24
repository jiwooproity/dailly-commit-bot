const Convert = {
    getCommand({ content }) {
        const parseMsg = content.split(" ");
        return parseMsg[0];
    },
    getUsers() {},
    getContent({ command, content }) {
        const removedCmd = content.replace(`${command} `, '');
        return removedCmd;
    },
    getPinchContent({ userId, content }) {
        const pinchContent = content.replace(`${userId} `, '');
        return pinchContent;
    }
}

exports.Convert = Convert;