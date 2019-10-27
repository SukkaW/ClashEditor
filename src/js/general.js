(() => {
    let generalConfig;
    const msgEl = document.getElementById('msg');
    const generalConfigLS = localStorage.getItem('clashEditor:config:general');

    const generalCodeEditor = CodeMirror(document.getElementById('general-editor'), {
        lineNumbers: true,
        mode: 'yaml'
    });

    if (generalConfigLS && generalConfigLS !== '') {
        generalCodeEditor.setValue(generalConfigLS);
    }

    document.getElementById('ce-general-btn-validate').addEventListener('click', () => {
        try {
            generalConfig = jsyaml.load(generalCodeEditor.getValue());

            try {
                if (generalConfig['port'] && generalConfig['socks-port'] && typeof generalConfig['allow-lan'] === 'boolean') {
                    setLS('clashEditor:config:general', generalCodeEditor.getValue());
                    msgEl.innerHTML = `<span class="text-success">General 配置检查通过！</span>`;
                    document.getElementById('ce-general-btn-continue').classList.remove('disabled');
                    document.getElementById('ce-general-btn-continue').removeAttribute('disabled');
                    document.getElementById('ce-general-btn-continue').setAttribute('href', '/proxy');
                } else {
                    Modal(
                        '您的 General 配置不符合要求！',
                        `General 配置必须是合法的 YAML 格式，并且必须包括 <code>port</code>，<code>socks-port</code> 和 <code>allow-lan</code>`
                    )
                }
            } catch (e) {
                Modal(
                    '您的 General 配置不符合要求！',
                    `General 配置必须是合法的 YAML 格式，并且必须包括 <code>port</code>，<code>socks-port</code> 和 <code>allow-lan</code> 属性。`
                )
            };
        } catch (err) {
            Modal(
                '这看起来不太正常',
                `<p>Clash Editor 似乎不能解析您提交的 YAML 内容</p>
                <p>报错信息如下所示：</p>
                <p><code>${err}</code></p>
                <p>如果您认为这不是您的问题，请在 Clash Editor 的 GitHub 上提交一条 issue，并在 issue 中附上报错信息以供调试</p>`
            )
        }
    })
})();
