(() => {
    let proxyConfig;
    const msgEl = document.getElementById('msg');
    const proxyConfigLS = localStorage.getItem('clashEditor:config:proxy');

    const proxyCodeEditor = CodeMirror(document.getElementById('proxy-editor'), {
        lineNumbers: true,
        mode: 'yaml'
    });

    if (proxyConfigLS && proxyConfigLS !== '') {
        proxyCodeEditor.setValue(proxyConfigLS);
    } else {
        proxyCodeEditor.setValue('Proxy:\n');
    }

    document.getElementById('ce-proxy-btn-validate').addEventListener('click', () => {
        try {
            proxyConfig = jsyaml.load(proxyCodeEditor.getValue());

            try {
                if (proxyConfig.Proxy) {
                    try {
                        proxyConfig.Proxy.map(proxy => {
                            if (proxy.type && proxy.type !== 'ss' && proxy.type !== 'vmess' && proxy.type !== 'socks5' && proxy.type !== 'http' && proxy.type !== 'snell') {
                                throw new Error(proxy.type)
                            }
                        });

                        setLS('clashEditor:config:proxy', proxyCodeEditor.getValue());
                        msgEl.innerHTML = `<span class="text-success">你的 Proxy 配置符合要求，你可以「继续」下一步了</span>`;
                        document.getElementById('ce-proxy-btn-continue').classList.remove('disabled');
                        document.getElementById('ce-proxy-btn-continue').removeAttribute('disabled');
                    } catch (proxyType) {
                        Modal(
                            '你的 Proxy 配置不符合要求！',
                            `<code>${proxyType}</code> 不是 ClashEditor 可以辨识的代理类型！`
                        );
                    }
                } else {
                    Modal(
                        '你的 Proxy 配置不符合要求！',
                        `Proxy 配置必须包括 <code>Proxy:</code>，并且 <code>Proxy:</code> 下的内容不能为空！`
                    )
                }
            } catch (e) {
                Modal(
                    '你的 Proxy 配置不符合要求！',
                    `请检查你的 Proxy 配置并重新输入！`
                )
            };
        } catch (err) {
            Modal(
                '这看起来不太正常',
                `<p>Clash Editor 不能解析您提交的 YAML 内容</p>
                <p>报错信息如下所示：</p>
                <p><code>${err}</code></p>
                <p>如果您认为这不是您的问题，请在 Clash Editor 的 GitHub 上提交一条 issue，并在 issue 中附上报错信息以供调试</p>`
            )
        }
    })

    document.getElementById('ss-form').addEventListener('submit', (evt) => {
        evt.preventDefault();
        const value = `${proxyCodeEditor.getValue()}
- name: "${getValue('ss-name')}"
  type: ss
  server: ${getValue('ss-server')}
  port: ${getValue('ss-port')}
  cipher: ${getValue('ss-cipher')}
  password: "${getValue('ss-password')}"
  udp: ${getValue('ss-udp')}
`;
        proxyCodeEditor.setValue(value);
        document.getElementById('ss-form').reset();
        $('#ss-helper').modal('hide')
    })

    document.getElementById('vmess-form').addEventListener('submit', (evt) => {
        evt.preventDefault();
        const value = `${proxyCodeEditor.getValue()}
- name: "${getValue('vmess-name')}"
  type: vmess
  server: ${getValue('vmess-server')}
  port: ${getValue('vmess-port')}
  uuid: ${getValue('vmess-uuid')}
  alterId: ${getValue('vmess-alterId')}
  cipher: ${getValue('vmess-cipher')}
  udp: ${getValue('vmess-udp')}
  tls: ${getValue('vmess-tls')}
`;
        proxyCodeEditor.setValue(value);
        document.getElementById('vmess-form').reset();
        $('#vmess-helper').modal('hide')
    })
})();
