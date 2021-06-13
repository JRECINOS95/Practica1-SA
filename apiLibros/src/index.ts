import { Servidor } from './Servidor';

async function main() {
    const app = new Servidor();
    await app.listen();
}

main();