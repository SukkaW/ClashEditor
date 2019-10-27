((document, localStorage, CodeMirror) => {
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
                        msgEl.innerHTML = `<span class="text-success">Proxy 配置检查通过！</span>`;
                        document.getElementById('ce-proxy-btn-continue').classList.remove('disabled');
                        document.getElementById('ce-proxy-btn-continue').removeAttribute('disabled');
                        document.getElementById('ce-proxy-btn-continue').setAttribute('href', '/proxygroup');
                    } catch (proxyType) {
                        Modal(
                            '您的 Proxy 配置不符合要求！',
                            `<code>${proxyType}</code> 不是 ClashEditor 可以辨识的代理类型！`
                        );
                    }
                } else {
                    Modal(
                        '您的 Proxy 配置不符合要求！',
                        `Proxy 配置必须包括 <code>Proxy:</code>，并且 <code>Proxy:</code> 下的内容不能为空！`
                    )
                }
            } catch (e) {
                Modal(
                    '您的 Proxy 配置不符合要求！',
                    `请检查您的 Proxy 配置并重新输入！`
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

    const get = (url, type) =>
        fetch(url, { method: 'GET' }).then((resp) => {
            if (type === 'text')
                return Promise.all([resp.ok, resp.status, resp.text(), resp.headers]);
            else {
                return Promise.all([resp.ok, resp.status, resp.json(), resp.headers]);
            }
        }).then(([ok, status, data, headers]) => {
            if (ok) {
                return {
                    ok,
                    status,
                    data,
                    headers
                }
            }
        }).catch(error => {
            throw error;
        })


    document.getElementById('ce-proxy-btn-import-online').addEventListener('click', () => {
        const url = getValue('proxy-online-url');
        get(`https://cors-anywhere.herokuapp.com/${url}`, 'text')
            .then(resp => {
                const onlineConfig = jsyaml.load(resp.data);
                if (onlineConfig.Proxy && onlineConfig.Proxy !== '') {
                    proxyCodeEditor.setValue(`Proxy:\n${jsyaml.dump(onlineConfig.Proxy)}`);
                } else {
                    throw new Error(`从 ${url} 下载的文件中没有找到 Proxy 字段或 Proxy 字段为空！`);
                }
                $('#online-helper').modal('hide');
            })
            .catch(err => {
                $('#online-helper').modal('hide');
                Modal(
                    '这看起来不太正常',
                    `<p>Clash Editor 不能解析您提交的在线托管配置</p>
                    <p>报错信息如下所示：</p>
                    <p><code>${err}</code></p>
                    <p>这可能是由于您提交了错误的在线托管配置的 URL，或者在线托管配置不是合法的 YAML。`
                )
            })
    })

    document.getElementById('surge-form').addEventListener('submit', (evt) => {
        evt.preventDefault();
        const proxies = [];
        const proxyObj = parseIni(getValue('surge-ini-textarea')).Proxy;

        for (const [name, data] of Object.entries(proxyObj)) {
            const info = data.split(',');
            if (info.length > 4 && info[5].includes('SSEncrypt.module')) {
                proxies.push({
                    name,
                    type: 'ss',
                    server: info[1],
                    port: info[2],
                    cipher: info[3],
                    password: info[4],
                    udp: true
                })
            }
        }

        let value = `Proxy:\n`

        for (const proxy of proxies) {
            value += `- name: "${proxy.name}"
  type: ss
  server: ${proxy.server}
  port: ${proxy.port}
  cipher: ${proxy.cipher}
  password: "${proxy.password}"
  udp: true
`
        }

        proxyCodeEditor.setValue(value);
        document.getElementById('surge-form').reset();
        $('#surge-helper').modal('hide')
    })

})(document, localStorage, CodeMirror);
