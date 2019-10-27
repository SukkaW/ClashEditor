window.ClashEditor = {};

function Modal(title = '', body = '', footer = '') {
    document.getElementById('modal-title').innerHTML = title;
    document.getElementById('modal-body').innerHTML = body;
    if (footer !== '') {
        document.getElementById('modal-footer').innerHTML = footer;
    }
    $('#modal').modal();
}

const setLS = (key, value) => {
    try {
        localStorage.setItem(key, value)
    } catch (o) {
        Modal(
            '这看起来不太正常',
            `<p>您的浏览器不支持 localStorage，因此无法继续使用 ClashEditor</p>
            <p>报错信息如下所示：</p>
            <p><code>${o}</code></p>`
        )
    }
}

const getValue = (elId) => document.getElementById(elId).value;

const parseIni = (data) => {
    const regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    const value = {};
    const lines = data.split(/[\r\n]+/);
    let section = null;
    lines.forEach(line => {
        if (regex.comment.test(line)) {
            return;
        } else if (regex.param.test(line)) {
            const match = line.match(regex.param);
            if (section) {
                value[section][match[1]] = match[2];
            } else {
                value[match[1]] = match[2];
            }
        } else if (regex.section.test(line)) {
            const match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        } else if (line.length == 0 && section) {
            section = null;
        };
    });
    return value;
}
