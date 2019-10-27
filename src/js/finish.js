((document, localStorage) => {
    const generalConfigLS = localStorage.getItem('clashEditor:config:general') || '';
    const proxyConfigLS = localStorage.getItem('clashEditor:config:proxy') || '';
    const proxygroupConfigLS = localStorage.getItem('clashEditor:config:proxygroup') || '';
    const ruleConfigLS = localStorage.getItem('clashEditor:config:rule') || '';

    const finalYAML =
        `${generalConfigLS}
${proxyConfigLS}
${proxygroupConfigLS}
${ruleConfigLS}`

    const renderYAML = () => {
        const previewYamlEl = document.getElementById('finish-yml');
        previewYamlEl.innerHTML = finalYAML;
        Prism.highlightElement(previewYamlEl, true)
        document.getElementById('finish-preview-yaml').removeEventListener('click', renderYAML);
    }

    document.getElementById('finish-preview-yaml').addEventListener('click', renderYAML);

    const setDownload = (id, data, name) => {
        const a = document.getElementById(id);
        const file = new Blob([data], { type: 'text/plain; charset=utf-8' });
        a.href = URL.createObjectURL(file);
        a.download = name;
    }

    setDownload('finish-download-yaml', finalYAML.toString(), `config.yaml`);
    setDownload('finish-download-json', JSON.stringify(jsyaml.load(finalYAML)), `config.json`);

    document.getElementById('finish-clean-cache').addEventListener('click', () => {
        localStorage.removeItem('clashEditor:config:general');
        localStorage.removeItem('clashEditor:config:proxy');
        localStorage.removeItem('clashEditor:config:proxygroup');
        localStorage.removeItem('clashEditor:config:rule');
        Modal(
            '清理成功！',
            `Clash Editor 已经清除了您浏览器中保存的 General、Proxy、Proxy Group、Rule 配置！在您下次编辑时这些配置将不会自动恢复！`
        );
    })
})(document, localStorage);