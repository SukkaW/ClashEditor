(() => {
    const proxygroupConfigLS = localStorage.getItem('clashEditor:config:proxygroup');
    const ruleLS = localStorage.getItem('clashEditor:config:rule');

    if (!proxygroupConfigLS || proxygroupConfigLS === '') {
        Modal(
            '这看起来不太正常',
            `ClashEditor 没法读取你的 Proxy Group 配置！<br>3 秒后将会回到 ClashEditor 首页！`
        );
        setTimeout(() => {
            window.location.pathname = '/'
        }, 3500)
    } else {
        const proxygroupList = [];
        const proxygroupConfig = jsyaml.load(proxygroupConfigLS);
        proxygroupConfig['Proxy Group'].map(item => {
            proxygroupList.push(`<code>${item.name}</code>`);
        })
        document.getElementById('rule-proxygroup-list').innerHTML = proxygroupList.join('，');
    }

    const ruleEditor = CodeMirror(document.getElementById('rule-editor'), {
        lineNumbers: true,
        mode: 'yaml'
    });

    if (ruleLS && ruleLS !== '') {
        ruleEditor.setValue(ruleLS);
    } else {
        ruleEditor.setValue('Rule:\n');
    }

    document.getElementById('ce-rule-btn-finish').addEventListener('click', () => {
        setLS('clashEditor:config:rule', ruleEditor.getValue());
        setTimeout(() => {
            window.location.pathname = '/finish/'
        }, 500)
    })
})();