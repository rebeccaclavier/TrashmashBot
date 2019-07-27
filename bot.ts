import path from 'path';
import { mkdirSync } from 'fs';
import rimraf from 'rimraf';
import chalk from 'chalk';

import { GameClient } from './models';

const client = new GameClient({
    commandPrefix: '!',
    owner: '131859790593785856',
    unknownCommandResponse: false,
});

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['trashmash', 'Commands for running trashmash games'],
	])
	.registerDefaultGroups()
	.registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log(chalk.green('[Global]') + ` Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('high quality mashes');

    rimraf.sync(client.dir);
    mkdirSync(client.dir);
    console.log(chalk.green('[Global]') + ' Created trashmash folder');
});

client.on('error', console.error);

client.login(process.env.DISCORD_TOKEN);