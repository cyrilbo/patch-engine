import { bPlugin } from './plugins/b/b.plugin';
import { aPlugin } from './plugins/a/a.plugin';
import { $ } from 'zx';
import { Engine } from './engine/plugin.engine';

$.verbose = false;

Engine.run([aPlugin, bPlugin]);
