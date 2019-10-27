((document, localStorage, CodeMirror, window) => {
    const msgEl = document.getElementById('msg');
    const proxygroupConfigLS = localStorage.getItem('clashEditor:config:proxygroup');
    const ruleLS = localStorage.getItem('clashEditor:config:rule');
    const proxygroupList = [];

    if (!proxygroupConfigLS || proxygroupConfigLS === '') {
        Modal(
            '这看起来不太正常',
            `Clash Editor 无法读取您的 Proxy Group 配置！<br>3 秒后将会回到 Proxy Group 编辑页面！`
        );
        setTimeout(() => {
            window.location.pathname = '/proxygroup'
        }, 3500)
    } else {
        const proxygroupConfig = jsyaml.load(proxygroupConfigLS);
        proxygroupConfig['Proxy Group'].map(item => {
            proxygroupList.push(`${item.name}`);
        })
        const proxygroupListHtml = [];
        proxygroupList.forEach(item => {
            proxygroupListHtml.push(`<code>${item}</code>`)
        })
        document.getElementById('rule-proxygroup-list').innerHTML = proxygroupListHtml.join('，');
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

    document.getElementById('ce-rule-btn-validate').addEventListener('click', () => {
        try {
            const ruleConfig = jsyaml.load(ruleEditor.getValue()).Rule;
            const allowedMatch = ['DOMAIN-SUFFIX', 'DOMAIN-KEYWORD', 'DOMAIN', 'IP-CIDR', 'SRC-IP-CIDR', 'GEOIP', 'DST-PORT', 'SRC-PORT', 'MATCH', 'FINAL'];
            const allowedAction = proxygroupList.concat(['DIRECT', 'REJECT'])
            try {
                for (let rule of ruleConfig) {
                    const ruleMatch = rule.split(',')[0];
                    const ruleAction = rule.split(',')[2];

                    if (allowedAction.some((element) => element === ruleAction || ruleMatch === 'MATCH' || ruleMatch === 'FINAL')) {
                        if (allowedMatch.some((action) => action === ruleMatch)) {
                            setLS('clashEditor:config:rule', ruleEditor.getValue());
                            msgEl.innerHTML = `<span class="text-success">Rule 检查通过</span>`;
                            document.getElementById('ce-rule-btn-continue').classList.remove('disabled');
                            document.getElementById('ce-rule-btn-continue').removeAttribute('disabled');
                            document.getElementById('ce-rule-btn-continue').setAttribute('href', '/finish');
                        } else {
                            throw new Error('Clash Editor 不可辨识的匹配')
                        }
                    } else {
                        throw new Error('Rule 中使用了不存在的 Proxy Group')
                    }
                }
            } catch (err) {
                Modal(
                    '您的 Rule 不符合要求！',
                    `<p>报错信息如下所示：</p>
                    <p><code>${err}</code></p>`
                )
            }
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
})(document, localStorage, CodeMirror, window);