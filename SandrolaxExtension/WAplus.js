var isD = !1,
    messages = [],
    manifest = chrome.runtime.getManifest(),
    nightCSS = "";

function hashCode(e) {
    var a, f = 0;
    if (0 === e.length) return f;
    for (a = 0; a < e.length; a++) {
        var g = e.charCodeAt(a);
        f = (f << 5) - f + g, f |= 0
    }
    return f
}

//--Recarregar a página
chrome.runtime.onUpdateAvailable.addListener(function(b) {
        console.log("updating to version " + b.version),
            chrome.runtime.reload()
    }), //--
    //Atualizar a extensão ou caso o chrome atualize
    chrome.runtime.onInstalled.addListener(function(b) {
        chrome.notifications.create("onInstalled", {
                title: "WA Web Plus " + manifest.version,
                message: chrome.i18n.getMessage("new_version_installed"),
                type: "basic",
                iconUrl: "../../icons/icon-128.png"
            }),
            //Realiza a intalação da nova extensão
            "install" == b.reason && chrome.tabs.create({ url: "https://wawplus.com/changelog?v=" + manifest.version }),
            chrome.tabs.query({ url: "https://web.whatsapp.com/*", currentWindow: !0 },
                function(b) { 0 < b.length && chrome.tabs.reload(b[0].id) })
    }),

    //Ativa uma acão ao clicar no...
    chrome.browserAction.onClicked.addListener(function() {
        chrome.tabs.query({ url: "https://web.whatsapp.com/*", currentWindow: !0 },
            function(b) { chrome.tabs.sendMessage(b[0].id, "reloadOrActivate", function() {}) })
    }),

    //Colocando o popup no manifest
    chrome.tabs.onActivated.addListener(function(b) {
        chrome.tabs.get(b.tabId, function(b) {
            b.url && b.url.includes("web.whatsapp.com") ?
                chrome.browserAction.setPopup({ popup: "" }) : chrome.browserAction.setPopup({ popup: "/src/popup.html" })
        })
    }),


    chrome.runtime.onMessage.addListener(function(e, a, b) {

        if ("setIcon" == e.type) chrome.browserAction.setIcon({ path: e.icon });

        else if ("setBadgeText" == e.type) chrome.browserAction.setBadgeText({ text: e.title }),

            e.color ? chrome.browserAction.setBadgeBackgroundColor({ color: e.color || "#0000" }) :
            chrome.browserAction.setBadgeBackgroundColor({ color: "#0000" });
        else if ("openChat" == e.type) chrome.tabs.query({ url: "https://web.whatsapp.com/*", currentWindow: !0 },

            function(a) { chrome.tabs.executeScript(a[0].id, { code: "window.location.href='javascript:openChat(" + e.phone + ")';" }) });

        else if ("openSettings" == e.type) chrome.tabs.query({ url: "https://web.whatsapp.com/*", currentWindow: !0 },
            function(b) {
                chrome.tabs.executeScript(b[0].id, { code: "window.location.href='javascript:initFrame(true)';" })
            });
        else {
            if ("popupOpened" == e.type) return chrome.tabs.query({ url: "https://web.whatsapp.com/*", currentWindow: !0 },
                function(c) {
                    0 < c.length ? c[0].active ? (b("close"), chrome.tabs.executeScript(c[0].id, { code: "window.location.href='javascript:initFrame()';" },
                        function() { return !1 })) : chrome.tabs.executeScript(c[0].id, { code: "window.location.href='javascript:getUnreadMsgs()';" },
                        function() { setTimeout(function() { b(messages) }, 500) }) : (messages = [], b(void 0))
                }), !0;

            if ("setUnreadMessages" == e.type) messages = e.messages;

            else if ("getServerValues" == e.type) fetch("https://wa-web-plus.web.app/status.json?v=" + Math.random()).then(function(b) {
                200 === b.status ? b.json().then(function(d) {
                    isD && console.log(d);
                    var e = "";
                    if (e += "rV(\"blurRecentMessagesClass\", \"" + d.blurRecentMessagesClass + "\");",
                        e += "rV(\"blurRecentMessagesHoverClass\", \"" + d.blurRecentMessagesHoverClass + "\");",
                        e += "rV(\"blurContactsNamesClass\", \"" + d.blurContactsNamesClass + "\");",
                        e += "rV(\"blurContactsNamesHoverClass\", \"" + d.blurContactsNamesHoverClass + "\");",
                        e += "rV(\"blurContactsPhotosClass\", \"" + d.blurContactsPhotosClass + "\");",
                        e += "rV(\"blurContactsPhotosHoverClass\", \"" + d.blurContactsPhotosHoverClass + "\");",
                        e += "rV(\"blurConversationMessagesClass\", \"" + d.blurConversationMessagesClass + "\");",
                        e += "rV(\"blurConversationMessagesHoverClass\", \"" + d.blurConversationMessagesHoverClass + "\");",
                        e += "rV(\"contactListItemClass\", \"" + d.contactListItemClass + "\");",
                        e += "rV(\"containerClass\", \"" + d.containerClass + "\");",
                        e += "rV(\"sideHeaderClass\", \"" + d.sideHeaderClass + "\");",
                        e += "rV(\"headerButtonClass\", \"" + d.headerButtonClass + "\");",
                        e += "rV(\"footerButton1Class\", \"" + d.footerButton1Class + "\");",
                        e += "rV(\"footerButton2Class\", \"" + d.footerButton2Class + "\");",
                        e += "rV(\"footerButton3Class\", \"" + d.footerButton3Class + "\");",
                        e += "rV(\"contactStatusClass\", \"" + d.contactStatusClass + "\");",
                        e += "rV(\"nightModeCSS\", \"" + btoa(d.nightModeCSS) + "\");",
                        e += "rV(\"whitelist\", \"" + d.whitelist.join() + "\");", isD && console.log(e),
                        chrome.tabs.query({
                            url: "https://web.whatsapp.com/*",
                            currentWindow: !0
                        }, function(b) {
                            0 < b.length && chrome.tabs.executeScript(b[0].id, { code: "window.location.href='javascript:" + e + "';" })
                        }),
                        1 == d.warning && manifest.version < d.latest) {
                        var a = chrome.i18n.getUILanguage();
                        a = ["ar", "en", "es", "pt_BR", "pt-BR", "tr", "fr"].includes(a) ? a : "en", a = "en-US" == a ||
                            "en-GB" == a ? "en" : a, a = "es-419" == a ? "es" : a, void 0 !== d.message[a] && 0 < d.message[a].length ?
                            alert(d.message[a]) : alert(d.message.en), 0 < d.link.length && chrome.tabs.create({ url: d.link })
                    }
                }) : isD && console.log("Looks like there was a problem. Status Code: " + b.status)
            })["catch"](function(b) { isD && console.log("Fetch Error:", b) });

            else if ("addLicense" == e.type) {
                isD && console.log(e);
                try {
                    a = 1, "waw_premium" == e.product ? a = 1 : "waw_premium_10" == e.product ? a = 1 : "waw_premium_monthly_5_users" == e.product ?
                        a = 5 : "waw_premium_monthly_20_users" == e.product && (a = 20), fetch("https://wa-web-plus.firebaseio.com/users/" + e.time + ".json", {
                            method: "PUT",
                            headers: { Accept: "application/json, application/xml, text/plain, text/html, *.*", "Content-Type": "application/json; charset=utf-8" },
                            body: JSON.stringify({
                                current_users: [hashCode(e.user.toString())],
                                max_allowed: a,
                                product_id: e.product,
                                order_id: e.order,
                                referrer: e.referrer,
                                version: manifest.version
                            })
                        })
                } catch (a) { isD && console.log(a) }
            } else if ("validateLicense" == e.type)
                try {
                    fetch("https://wa-web-plus.firebaseio.com/users/" + e.time + ".json").then(function(a) {
                        if (isD && console.log(a), null === a || void 0 === a) {
                            isD && console.log("error", this), isD && console.log(e);
                            try {
                                a = 1, "waw_premium" == e.product ? a = 1 : "waw_premium_10" == e.product ?
                                    a = 1 : "waw_premium_monthly_5_users" == e.product ? a = 5 : "waw_premium_monthly_20_users" == e.product && (a = 20),
                                    fetch("https://wa-web-plus.firebaseio.com/users/" + e.time + ".json", {
                                        method: "PUT",
                                        headers: {
                                            Accept: "application/json, application/xml, text/plain, text/html, *.*",
                                            "Content-Type": "application/json; charset=utf-8"
                                        },
                                        body: JSON.stringify({
                                            current_users: [hashCode(e.user.toString())],
                                            max_allowed: a,
                                            product_id: e.product,
                                            order_id: e.order,
                                            referrer: e.referrer,
                                            version: manifest.version
                                        })
                                    })
                            } catch (a) { isD && console.log(a) }
                        } else if (a.current_users && a.current_users.length > a.max_allowed) chrome.tabs.query({
                                url: "https://web.whatsapp.com/*",
                                currentWindow: !0
                            },
                            function(a) {
                                chrome.tabs.executeScript(a[0].id, { code: "window.location.href='javascript:dP(\"" + e.product + "\", true)';" })
                            }
                        );
                        else {
                            a = a.current_users || [], isD && console.log("currentUsers", a);
                            var d = !0;
                            Array.isArray(a) ? (d = a.includes(hashCode(e.user))) || a.push(hashCode(e.user)) : (d = a == hashCode(e.user)) ||
                                (a = [a, hashCode(e.user)]), isD && console.log("currentUsers", a, d), d ||
                                fetch("https://wa-web-plus.firebaseio.com/users/" + e.time + "/current_users.json", {
                                    method: "PUT",
                                    headers: {
                                        Accept: "application/json, application/xml, text/plain, text/html, *.*",
                                        "Content-Type": "application/json; charset=utf-8"
                                    },
                                    body: JSON.stringify(a)
                                })
                        }
                    })
                }
            catch (a) { isD && console.log(a) }
        }
    });