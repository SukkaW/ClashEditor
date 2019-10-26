window.ClashEditor = {};

function Modal(title = '', body = '', footer = '') {
    document.getElementById('modal-title').innerHTML = title;
    document.getElementById('modal-body').innerHTML = body;
    if (footer !== '') {
        document.getElementById('modal-footer').innerHTML = footer;
    }
    $('#modal').modal();
}

function setLS(key, value) {
    try {
        localStorage.setItem(key, value)
    } catch (o) {
        Modal(
            '这看起来不太正常',
            `<p>你的浏览器不支持 localStorage，因此无法继续使用 ClashEditor</p>
            <p>报错信息如下所示：</p>
            <p><code>${o}</code></p>`
        )
    }
}

const getValue = (elId) => document.getElementById(elId).value;
