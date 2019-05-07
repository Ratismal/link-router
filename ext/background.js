let LINK_ROUTER_LOADED = false;

(function () {
    let routes = [];

    const LINK_ROUTER_ID = 'SC_LINK_ROUTER';

    function makeId(route) {
        return LINK_ROUTER_ID + '_' + route;
    }

    async function executeRoute(route, url) {
        try {
            let u = `http://localhost:9102/routes/${route}?url=${encodeURIComponent(url)}`;
            console.log('Fetching', u);
            await fetch(u);
        } catch (err) {
            console.error(err);
        }
    }

    function createRoute(chrome, body) {
        return new Promise(res => {
            chrome.contextMenus.remove(body.id, () => {
                if (chrome.runtime.lastError)
                    console.log(chrome.runtime.lastError);
                chrome.contextMenus.create(body, () => {
                    if (chrome.runtime.lastError)
                        console.log(chrome.runtime.lastError);
                    res();
                });
            });
        });
    }
 
    function removeRoute(chrome, id) {
        return new Promise(res => {
            chrome.contextMenus.remove(id, () => {
                if (chrome.runtime.lastError)
                    console.log(chrome.runtime.lastError);
                res();
            });
        })
    }

    async function fetchRoutes(chrome) {
        for (const route of routes) {
            await removeRoute(chrome, makeId(route));
        }

        const res = await fetch('http://localhost:9102/routes');
        routes = await res.json();
        console.log('[LinkRouter] Found routes:', routes);

        for (const route of routes) {
            await createRoute(chrome, {
                type: 'normal',
                id: makeId(route),
                title: 'Open in ' + route,
                parentId: LINK_ROUTER_ID,
                // onclick: (info) => {
                //     executeRoute(route, info.linkUrl);
                // },
                contexts: ['link']
            })
        }
    }


    async function start(chrome) {
        await createRoute(chrome, {
            type: 'normal',
            id: LINK_ROUTER_ID,
            title: 'Link Router',
            contexts: ['link']
        });

        setInterval(() => fetchRoutes(chrome), 60e3)
        await fetchRoutes(chrome);

        const func = async info => {
            if (info.parentMenuItemId === LINK_ROUTER_ID) {
                let route = info.menuItemId.substring(LINK_ROUTER_ID.length + 1);
                console.log('Clicked on', route);

                await executeRoute(route, info.linkUrl);
            }
        };

        chrome.contextMenus.onClicked.addListener(func);
    }

    start(window.chrome).catch(console.error);
})();