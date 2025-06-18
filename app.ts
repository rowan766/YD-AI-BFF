
import { addAliases } from 'module-alias';
addAliases({
  '@root': __dirname,
  '@interfaces': `${__dirname}/interface`,
  '@config': `${__dirname}/config`,
  '@middlewares': `${__dirname}/middlewares`,
});

import Koa from 'koa';
import { createContainer, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';
import co from 'co';
import render from 'koa-swig';
import config from '@config/index';

const app = new Koa();
const { port, viewDir, memoryFlag, staticDir } = config;

const container = createContainer();

//所有的可以被注入的代码都在container中
container.loadModules([`${__dirname}/services/*.ts`], {
  formatName: 'camelCase',
  resolverOptions: {
    lifetime: Lifetime.SCOPED,
  },
});

//每一次用户请求router中 都会从容器中取到注入的服务
app.use(scopePerRequest(container));
app.context.render = co.wrap(
  render({
    root: viewDir,
    autoescape: true,
    cache: <'memory' | false>memoryFlag,
    writeBody: false,
    ext: 'html',
  })
);

//让所有的路由全部生效
app.use(loadControllers(`${__dirname}/routers/*.ts`));

app.listen(port, () => {
  console.log('Server BFF启动成功');
});