"use strict";window.ClashEditor.select=["DIRECT","REJECT"],function(){function I(){$("#proxygroup-select-list").sortable("destroy");var e="",t=!0,r=!1,o=void 0;try{for(var l,n=window.ClashEditor.select[Symbol.iterator]();!(t=(l=n.next()).done);t=!0){var a=l.value;e+='<div class="col-md-6 col-lg-4 col-xl-3 sk-px-1">\n                    <input class="proxygroup-select-input sk-hide" name="proxygroup-select" id="proxygroup-select-'.concat(a,'" type="checkbox" value="').concat(a,'">\n                    <label class="proxygroup-select-label card sk-p-3 sk-font-14" for="proxygroup-select-').concat(a,'">').concat(a,"</label>\n                </div>")}}catch(e){r=!0,o=e}finally{try{t||null==n.return||n.return()}finally{if(r)throw o}}document.getElementById("proxygroup-select-list").innerHTML=e,$("#proxygroup-select-list").sortable({placeholderClass:"proxygroup-select-label card col-md-6 col-lg-4 col-xl-3"})}var e=localStorage.getItem("clashEditor:config:proxy"),t=localStorage.getItem("clashEditor:config:proxygroup");if(e&&""!==e){var r=!0,o=!1,l=void 0;try{for(var n,a=jsyaml.load(e).Proxy[Symbol.iterator]();!(r=(n=a.next()).done);r=!0){var c=n.value;window.ClashEditor.select.push(c.name)}}catch(e){o=!0,l=e}finally{try{r||null==a.return||a.return()}finally{if(o)throw l}}I()}else Modal("这看起来不太正常","Clash Editor 无法读取您的 Proxy 配置！<br>3 秒后将会回到 Proxy 编辑页面！"),setTimeout(function(){window.location.pathname="/proxy"},3500);var S=CodeMirror(document.getElementById("proxygroup-editor"),{lineNumbers:!0,mode:"yaml"});t&&""!==t?S.setValue(t):S.setValue("Proxy Group:\n");var u=!0,i=!1,y=void 0;try{for(var d,p=function(){var e=d.value;e.addEventListener("change",function(){e.checked&&"select"!==e.value?document.getElementById("proxygroup-httpcheck-container").style.display="block":document.getElementById("proxygroup-httpcheck-container").style.display="none"})},s=document.getElementsByName("proxygroup-category")[Symbol.iterator]();!(u=(d=s.next()).done);u=!0)p()}catch(e){i=!0,y=e}finally{try{u||null==s.return||s.return()}finally{if(i)throw y}}document.getElementById("ce-proxygroup-btn-select-opposite").addEventListener("click",function(){var e=document.getElementsByName("proxygroup-select"),t=!0,r=!1,o=void 0;try{for(var l,n=e[Symbol.iterator]();!(t=(l=n.next()).done);t=!0){var a=l.value;a.checked?a.checked=!1:a.checked=!0}}catch(e){r=!0,o=e}finally{try{t||null==n.return||n.return()}finally{if(r)throw o}}}),document.getElementById("ce-proxygroup-btn-select-all").addEventListener("click",function(){var e=document.getElementsByName("proxygroup-select"),t=!0,r=!1,o=void 0;try{for(var l,n=e[Symbol.iterator]();!(t=(l=n.next()).done);t=!0){l.value.checked=!0}}catch(e){r=!0,o=e}finally{try{t||null==n.return||n.return()}finally{if(r)throw o}}}),document.getElementById("ce-proxygroup-btn-submit").addEventListener("click",function(e){var t=[],r="",o=document.getElementById("proxygroup-policy-list"),l=new FormData(o),n=!0,a=!1,c=void 0;try{for(var u,i=l[Symbol.iterator]();!(n=(u=i.next()).done);n=!0){r=u.value[1]}}catch(e){a=!0,c=e}finally{try{n||null==i.return||i.return()}finally{if(a)throw c}}var y=document.getElementsByName("proxygroup-select"),d=!0,p=!1,s=void 0;try{for(var g,m=y[Symbol.iterator]();!(d=(g=m.next()).done);d=!0){var v=g.value;v.checked&&t.push("    - ".concat(v.value))}}catch(e){p=!0,s=e}finally{try{d||null==m.return||m.return()}finally{if(p)throw s}}var h="",f=!0,x=!1,E=void 0;try{for(var b,k=document.getElementsByName("proxygroup-category")[Symbol.iterator]();!(f=(b=k.next()).done);f=!0){var w=b.value;w.checked&&"select"!==w.value&&(h="url: ".concat(getValue("proxygroup-httpcheck-url"),"\n  interval: ").concat(getValue("proxygroup-httpcheck-interval")))}}catch(e){x=!0,E=e}finally{try{f||null==k.return||k.return()}finally{if(x)throw E}}var B="".concat(S.getValue(),"\n- name: ").concat(getValue("proxygroup-name"),"\n  type: ").concat(r,"\n  proxies:\n").concat(t.join("\n"),"\n  ").concat(h);window.ClashEditor.select.push(getValue("proxygroup-name")),S.setValue(B),o.reset(),I(),setLS("clashEditor:config:proxygroup",S.getValue()),$("#ce-modal-proxygroup").modal("hide")}),document.getElementById("ce-proxygroup-btn-continue").addEventListener("click",function(){setLS("clashEditor:config:proxygroup",S.getValue()),setTimeout(function(){window.location.pathname="/rule"},500)})}();