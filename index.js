const { exec } = require('child_process');
const util = require('util');

const Koa = require('koa');
const Router = require('koa-router');

const config = require('./config.json');

const app = new Koa();
const router = new Router();


function execAsync(command, options) {
    return new Promise((res, rej) => {
        exec(command, options, (err, stdout, stderr) => {
            if (err) rej(err);
            else res({stdout, stderr});
        });
    });
}

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
});

router.get('/routes', async (ctx, next) => {
    ctx.status = 200;
    ctx.body = Object.keys(config.routes);
});

for (const route in config.routes) {
    router.get(`/routes/${route}`, async (ctx, next) => {
        let url = ctx.query.url;
        console.log('Routing', url, 'to', route);
        ctx.status = 200;
        await execAsync(util.format(config.command, config.routes[route], url));
        ctx.body = 'ok';
    });
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, ()=> {
    console.log('App is listening on port', config.port);
});