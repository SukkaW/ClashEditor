window.ClashEditor.select = ['DIRECT', 'REJECT'];

(() => {
    const msgEl = document.getElementById('msg');
    const proxyConfigLS = localStorage.getItem('clashEditor:config:proxy');
    const proxygroupConfigLS = localStorage.getItem('clashEditor:config:proxygroup');
    const updateProxyGroupList = () => {
        $('#proxygroup-select-list').sortable('destroy');

        let proxygroupHtml = '';
        for (let select of window.ClashEditor.select) {
            proxygroupHtml += `<div class="col-md-6 col-lg-4 col-xl-3 sk-px-1">
                    <input class="proxygroup-select-input sk-hide" name="proxygroup-select" id="proxygroup-select-${select}" type="checkbox" value="${select}">
                    <label class="proxygroup-select-label card sk-p-3 sk-font-14" for="proxygroup-select-${select}">${select}</label>
                </div>`
        }
        document.getElementById('proxygroup-select-list').innerHTML = proxygroupHtml;

        $('#proxygroup-select-list').sortable({
            placeholderClass: 'proxygroup-select-label card col-md-6 col-lg-4 col-xl-3'
        });
    }

    if (!proxyConfigLS || proxyConfigLS === '') {
        Modal(
            '这看起来不太正常',
            `Clash Editor 无法读取您的 Proxy 配置！<br>3 秒后将会回到 Proxy 编辑页面！`
        );
        setTimeout(() => {
            window.location.pathname = '/proxy'
        }, 3500)
    } else {
        for (let proxy of jsyaml.load(proxyConfigLS).Proxy) {
            window.ClashEditor.select.push(proxy.name)
        }

        updateProxyGroupList();
    }

    const proxygroupCodeEditor = CodeMirror(document.getElementById('proxygroup-editor'), {
        lineNumbers: true,
        mode: 'yaml'
    });

    if (proxygroupConfigLS && proxygroupConfigLS !== '') {
        proxygroupCodeEditor.setValue(proxygroupConfigLS);
    } else {
        proxygroupCodeEditor.setValue('Proxy Group:\n');
    }

    for (let radio of document.getElementsByName('proxygroup-category')) {
        radio.addEventListener('change', () => {
            if (radio.checked && radio.value !== 'select') {
                document.getElementById('proxygroup-httpcheck-container').style.display = 'block';
            } else {
                document.getElementById('proxygroup-httpcheck-container').style.display = 'none';
            }
        })
    }

    document.getElementById('ce-proxygroup-btn-select-opposite').addEventListener('click', () => {
        const inputElList = document.getElementsByName('proxygroup-select');
        for (const inputEl of inputElList) {
            if (inputEl.checked) {
                inputEl.checked = false;
            } else {
                inputEl.checked = true;
            };
        }
    })

    document.getElementById('ce-proxygroup-btn-select-all').addEventListener('click', () => {
        const inputElList = document.getElementsByName('proxygroup-select');
        for (const inputEl of inputElList) {
            inputEl.checked = true;
        }
    })

    document.getElementById('ce-proxygroup-btn-submit').addEventListener('click', (evt) => {
        const selectedProxy = [];
        let proxyGroupType = '';

        const proxygroupPolicyForm = document.getElementById('proxygroup-policy-list')

        const data = new FormData(proxygroupPolicyForm);
        for (const entry of data) {
            proxyGroupType = entry[1];
        };

        const inputElList = document.getElementsByName('proxygroup-select');
        for (const inputEl of inputElList) {
            if (inputEl.checked) {
                selectedProxy.push(`    - ${inputEl.value}`);
            }
        }

        let httpCheckConfig = '';

        for (let radio of document.getElementsByName('proxygroup-category')) {
            if (radio.checked && radio.value !== 'select') {
                httpCheckConfig = `url: ${getValue('proxygroup-httpcheck-url')}\n  interval: ${getValue('proxygroup-httpcheck-interval')}`
            }
        }

        const value = `${proxygroupCodeEditor.getValue()}
- name: ${getValue('proxygroup-name')}
  type: ${proxyGroupType}
  proxies:
${selectedProxy.join('\n')}
  ${httpCheckConfig}`

        window.ClashEditor.select.push(getValue('proxygroup-name'));
        proxygroupCodeEditor.setValue(value);
        proxygroupPolicyForm.reset();
        updateProxyGroupList();
        setLS('clashEditor:config:proxygroup', proxygroupCodeEditor.getValue());

        $('#ce-modal-proxygroup').modal('hide');
    })


    document.getElementById('ce-proxygroup-btn-validate').addEventListener('click', () => {
        try {
            jsyaml.load(proxygroupCodeEditor.getValue());
            setLS('clashEditor:config:proxygroup', proxygroupCodeEditor.getValue());
            msgEl.innerHTML = `<span class="text-success">Proxy Group 检查通过！</span>`;
            document.getElementById('ce-proxygroup-btn-continue').classList.remove('disabled');
            document.getElementById('ce-proxygroup-btn-continue').removeAttribute('disabled');
            document.getElementById('ce-proxygroup-btn-continue').setAttribute('href', '/rule');
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
})()