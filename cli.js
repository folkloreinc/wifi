#!/usr/bin/env node
'use strict';

var commander = require('commander');
var os$1 = require('os');
var child_process = require('child_process');
var Parser = require('table-parser');
var createDebug = require('debug');
var ejs = require('ejs');
var express = require('express');
var fs = require('fs-extra');
var http = require('http');
var require$$3 = require('got');
var require$$0 = require('util');
var require$$1 = require('dgram');
var require$$2 = require('dns-socket');
var require$$4 = require('is-ip');
var require$$3$1 = require('p-any');
var require$$4$1 = require('p-timeout');
var path = require('path');
var socket_io = require('socket.io');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var os__default = /*#__PURE__*/_interopDefaultLegacy(os$1);
var Parser__default = /*#__PURE__*/_interopDefaultLegacy(Parser);
var createDebug__default = /*#__PURE__*/_interopDefaultLegacy(createDebug);
var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
var require$$3__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$3$1);
var require$$4__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$4$1);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function parseItemsFromLines(out, properties, resetProperty = null, valueDelimiter = ' ') {
  const {
    items
  } = out.split('\n').map(it => it.trim()).reduce(({
    item: currentItem,
    items: currentItems
  }, line) => {
    const [label, value = null] = line.split(valueDelimiter, 2);
    const key = label.trim();

    if (typeof properties[key] !== 'undefined' && value !== null) {
      const reset = key === resetProperty;
      const property = properties[key];
      return {
        item: reset ? {
          [property]: value.trim()
        } : { ...currentItem,
          [property]: value.trim()
        },
        items: currentItem !== null && reset ? [...currentItems, currentItem] : currentItems
      };
    }

    return {
      item: currentItem,
      items: currentItems
    };
  }, {
    item: null,
    items: []
  });
  return items;
}

function run(command, args = null) {
  return new Promise((resolve, reject) => {
    child_process.exec(`${command}${args !== null ? ` ${args.join(' ')}` : ''}`, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });
}

function listInterfaces() {
  switch (os__default["default"].platform()) {
    case 'darwin':
      return run('networksetup', ['-listallhardwareports']).then(out => parseItemsFromLines(out, {
        'Hardware Port': 'label',
        Device: 'id',
        'Ethernet Address': 'mac'
      }, 'Hardware Port', ':')).then(interfaces => interfaces.filter(({
        label
      }) => label.match(/^(Wi-Fi|Wireless)/i)));

    case 'linux':
      return run('nmcli', ['device', 'show']).then(out => parseItemsFromLines(out, {
        'GENERAL.DEVICE': 'id',
        'GENERAL.HWADDR': 'mac',
        'GENERAL.TYPE': 'type',
        'GENERAL.CONNECTION': 'connection',
        'GENERAL.STATE': 'state'
      }, 'GENERAL.DEVICE', ':')).then(interfaces => interfaces.filter(({
        type
      }) => type === 'wifi').map(({
        connection,
        state,
        ...iface
      }) => ({ ...iface,
        hotspot: (connection || '').toLowerCase() === 'hotspot',
        connected: (state || '').split(' ')[0] === '100'
      })));

    default:
      return Promise.reject(new Error('OS not supported'));
  }
}

function listNetworks(int) {
  switch (os__default["default"].platform()) {
    case 'linux':
      return run('nmcli', ['device', 'wifi', 'rescan', 'ifname', int]).catch(() => {}).then(() => run('nmcli', ['device', 'wifi', 'list', 'ifname', int]).then(out => {
        const items = Parser__default["default"].parse(out);
        return items.map(({
          SSID,
          SECURITY
        }) => ({
          ssid: SSID.join(' '),
          security: SECURITY.join(' ')
        }));
      }));

    default:
      return Promise.reject(new Error('OS not supported'));
  }
}

function connect(int, ssid, password) {
  switch (os__default["default"].platform()) {
    case 'linux':
      return run('nmcli', ['device', 'wifi', 'connect', ssid, 'password', password, 'ifname', int]).then(out => {
        console.log(out);
      });

    default:
      return Promise.reject(new Error('OS not supported'));
  }
}

function getNetwork(int) {
  switch (os__default["default"].platform()) {
    case 'linux':
      return run('nmcli', ['device', 'show', int]).then(out => {
        const connectionLine = out.split('\n').find(line => line.match(/^GENERAL\.CONNECTION/) !== null);
        const [, value = null] = connectionLine.split(':', 2) || [];

        if (value === null || value.trim().length === 0) {
          throw new Error('No connection');
        }

        return value.trim();
      }).then(connectionName => run('nmcli', ['conn', 'show', `"${connectionName}"`])).then(out => {
        const ssidLine = out.split('\n').find(line => line.match(/^802-11-wireless\.ssid/) !== null);
        const [, value = null] = ssidLine.split(':', 2) || [];
        return value !== null ? value.trim() : null;
      }).catch(() => null);

    default:
      return Promise.reject(new Error('OS not supported'));
  }
}

class Wifi {
  constructor(int, opts) {
    this.interface = int;
  }

  static interfaces() {
    return listInterfaces();
  }

  networks() {
    return listNetworks(this.interface);
  }

  connected() {}

  network() {
    return getNetwork(this.interface);
  }

  connect(ssid, password) {
    return connect(this.interface, ssid, password);
  }

  disconnect() {}

}

const command$2 = new commander.Command('interfaces');
command$2.description('List interfaces').action(async () => {
  const interfaces = await Wifi.interfaces();
  console.log(JSON.stringify(interfaces));
});

const command$1 = new commander.Command('networks');
command$1.description('List networks').argument('<interface>', 'Wifi interface').action(async int => {
  const wifi = new Wifi(int);
  const networks = await wifi.networks();
  console.log(JSON.stringify(networks));
});

var publicIp$1 = {};

const {promisify} = require$$0__default["default"];
const dgram = require$$1__default["default"];
const dns = require$$2__default["default"];
const {get: got$1, CancelError} = require$$3__default["default"];
const isIp = require$$4__default["default"];

const defaults = {
	timeout: 5000,
	onlyHttps: false
};

const dnsServers = [
	{
		v4: {
			servers: [
				'208.67.222.222',
				'208.67.220.220',
				'208.67.222.220',
				'208.67.220.222'
			],
			name: 'myip.opendns.com',
			type: 'A'
		},
		v6: {
			servers: [
				'2620:0:ccc::2',
				'2620:0:ccd::2'
			],
			name: 'myip.opendns.com',
			type: 'AAAA'
		}
	},
	{
		v4: {
			servers: [
				'216.239.32.10',
				'216.239.34.10',
				'216.239.36.10',
				'216.239.38.10'
			],
			name: 'o-o.myaddr.l.google.com',
			type: 'TXT',
			transform: ip => ip.replace(/"/g, '')
		},
		v6: {
			servers: [
				'2001:4860:4802:32::a',
				'2001:4860:4802:34::a',
				'2001:4860:4802:36::a',
				'2001:4860:4802:38::a'
			],
			name: 'o-o.myaddr.l.google.com',
			type: 'TXT',
			transform: ip => ip.replace(/"/g, '')
		}
	}
];

const type = {
	v4: {
		dnsServers: dnsServers.map(({v4: {servers, ...question}}) => ({
			servers, question
		})),
		httpsUrls: [
			'https://icanhazip.com/',
			'https://api.ipify.org/'
		]
	},
	v6: {
		dnsServers: dnsServers.map(({v6: {servers, ...question}}) => ({
			servers, question
		})),
		httpsUrls: [
			'https://icanhazip.com/',
			'https://api6.ipify.org/'
		]
	}
};

const queryDns = (version, options) => {
	const data = type[version];

	const socket = dns({
		retries: 0,
		maxQueries: 1,
		socket: dgram.createSocket(version === 'v6' ? 'udp6' : 'udp4'),
		timeout: options.timeout
	});

	const socketQuery = promisify(socket.query.bind(socket));

	const promise = (async () => {
		for (const dnsServerInfo of data.dnsServers) {
			const {servers, question} = dnsServerInfo;
			for (const server of servers) {
				if (socket.destroyed) {
					return;
				}

				try {
					const {name, type, transform} = question;

					// eslint-disable-next-line no-await-in-loop
					const dnsResponse = await socketQuery({questions: [{name, type}]}, 53, server);

					const {
						answers: {
							0: {
								data
							}
						}
					} = dnsResponse;

					const response = (typeof data === 'string' ? data : data.toString()).trim();

					const ip = transform ? transform(response) : response;

					if (ip && isIp[version](ip)) {
						socket.destroy();
						return ip;
					}
				} catch (_) {}
			}
		}

		socket.destroy();

		throw new Error('Couldn\'t find your IP');
	})();

	promise.cancel = () => {
		socket.destroy();
	};

	return promise;
};

const queryHttps = (version, options) => {
	let cancel;

	const promise = (async () => {
		try {
			const requestOptions = {
				family: version === 'v6' ? 6 : 4,
				retries: 0,
				timeout: options.timeout
			};

			const urls = [].concat.apply(type[version].httpsUrls, options.fallbackUrls || []);

			for (const url of urls) {
				try {
					const gotPromise = got$1(url, requestOptions);
					cancel = gotPromise.cancel;

					// eslint-disable-next-line no-await-in-loop
					const response = await gotPromise;

					const ip = (response.body || '').trim();

					if (ip && isIp[version](ip)) {
						return ip;
					}
				} catch (error) {
					if (error instanceof CancelError) {
						throw error;
					}
				}
			}

			throw new Error('Couldn\'t find your IP');
		} catch (error) {
			// Don't throw a cancellation error for consistency with DNS
			if (!(error instanceof CancelError)) {
				throw error;
			}
		}
	})();

	promise.cancel = function () {
		return cancel.apply(this);
	};

	return promise;
};

const queryAll = (version, options) => {
	let cancel;
	const promise = (async () => {
		let response;
		const dnsPromise = queryDns(version, options);
		cancel = dnsPromise.cancel;
		try {
			response = await dnsPromise;
		} catch (_) {
			const httpsPromise = queryHttps(version, options);
			cancel = httpsPromise.cancel;
			response = await httpsPromise;
		}

		return response;
	})();

	promise.cancel = cancel;

	return promise;
};

publicIp$1.v4 = options => {
	options = {
		...defaults,
		...options
	};

	if (!options.onlyHttps) {
		return queryAll('v4', options);
	}

	if (options.onlyHttps) {
		return queryHttps('v4', options);
	}

	return queryDns('v4', options);
};

publicIp$1.v6 = options => {
	options = {
		...defaults,
		...options
	};

	if (!options.onlyHttps) {
		return queryAll('v6', options);
	}

	if (options.onlyHttps) {
		return queryHttps('v6', options);
	}

	return queryDns('v6', options);
};

const os = os__default["default"];
const got = require$$3__default["default"];
const publicIp = publicIp$1;
const pAny = require$$3__default$1["default"];
const pTimeout = require$$4__default$1["default"];

// Use Array#flat when targeting Node.js 12
const flat = array => [].concat(...array);

const appleCheck = options => {
	const gotPromise = got('https://captive.apple.com/hotspot-detect.html', {
		timeout: options.timeout,
		dnsLookupIpVersion: options.ipVersion === 6 ? 'ipv6' : 'ipv4',
		headers: {
			'user-agent': 'CaptiveNetworkSupport/1.0 wispr'
		}
	});

	const promise = (async () => {
		try {
			const {body} = await gotPromise;
			if (!body || !body.includes('Success')) {
				throw new Error('Apple check failed');
			}
		} catch (error) {
			if (!(error instanceof got.CancelError)) {
				throw error;
			}
		}
	})();

	promise.cancel = gotPromise.cancel;

	return promise;
};

const isOnline = options => {
	options = {
		timeout: 5000,
		ipVersion: 4,
		...options
	};

	if (flat(Object.values(os.networkInterfaces())).every(({internal}) => internal)) {
		return Promise.resolve(false);
	}

	if (![4, 6].includes(options.ipVersion)) {
		throw new TypeError('`ipVersion` must be 4 or 6');
	}

	const publicIpFunctionName = options.ipVersion === 4 ? 'v4' : 'v6';

	const queries = [];

	const promise = pAny([
		(async () => {
			const query = publicIp[publicIpFunctionName](options);
			queries.push(query);
			await query;
			return true;
		})(),
		(async () => {
			const query = publicIp[publicIpFunctionName]({...options, onlyHttps: true});
			queries.push(query);
			await query;
			return true;
		})(),
		(async () => {
			const query = appleCheck(options);
			queries.push(query);
			await query;
			return true;
		})()
	]);

	return pTimeout(promise, options.timeout).catch(() => {
		for (const query of queries) {
			query.cancel();
		}

		return false;
	});
};

var isOnline_1 = isOnline;

const debug = createDebug__default["default"]('wifi:server');
const command = new commander.Command('server');
const localesPath = path__default["default"].join(__dirname, './locale') ;
const webPath = path__default["default"].join(__dirname, './web') ;
command.description('Run server').option('-c, --config <config>', 'Config file').option('-p, --port <port>', 'Server port').option('-l, --locale <locale>', 'interface locale').option('-i, --iface <interface>', 'Interface to use').option('--online-check-interval <interval>', 'Interval to check if online').action(async () => {
  // Options
  const {
    config: configPath = null,
    ...options
  } = command.opts();
  const config = configPath !== null ? await fs__default["default"].readJson(configPath) : null;
  const {
    port = process.env.PORT || 5000,
    iface = null,
    locale = process.env.UI_LOCALE || 'en',
    onlineCheckInterval = 10000
  } = { ...config,
    ...options
  };
  const translations = await fs__default["default"].readJson(path__default["default"].join(localesPath, `${locale}.json`)); // Server

  const app = express__default["default"]();
  const httpServer = http.createServer(app);
  const io = new socket_io.Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });
  app.set('view engine', 'html');
  app.engine('html', ejs.renderFile);
  app.use(express__default["default"].json());
  app.use(express__default["default"].urlencoded({
    extended: false
  })); // Get network interfaces

  const interfaces = await Wifi.interfaces();
  const networkInterface = interfaces.find(({
    hotspot
  }) => !hotspot);
  const {
    id: networkInterfaceId = null
  } = networkInterface || {};
  const interfaceId = iface || networkInterfaceId;
  const wifi = new Wifi(interfaceId); // Status

  async function getStatus() {
    let networks = [];

    try {
      networks = await wifi.networks();
    } catch (e) {
      debug('Status error with networks: %s', e);
    }

    let online = false;

    try {
      online = await isOnline_1();
    } catch (e) {
      debug('Status error with online: %s', e);
    }

    let network = null;

    try {
      network = await wifi.network();
    } catch (e) {
      debug('Status error with network: %s', e);
    }

    return {
      online,
      networks: networks.map(({
        ssid,
        ...data
      }) => ({ ...data,
        ssid,
        connected: ssid === network
      }))
    };
  }

  let status = await getStatus();

  async function checkOnline() {
    debug('Checking online...');
    const {
      online: currentOnline = false
    } = status;
    let newOnline = false;

    try {
      newOnline = await isOnline_1();
    } catch (e) {
      debug('Status error with online: %s', e);
    }

    if (currentOnline !== newOnline) {
      debug('Online status changed: %s', newOnline ? 'true' : 'false');
      status = { ...status,
        online: newOnline
      };
      io.emit('online', newOnline);
    } else {
      debug('Online status unchanged.');
    }
  }

  setInterval(checkOnline, onlineCheckInterval);

  async function updateStatus() {
    status = await getStatus();
    io.emit('status', status);
    return status;
  }

  debug('Interface %s', interfaceId);
  debug(`Status %O`, status); // Server

  io.on('connection', socket => {
    socket.emit('status', status);
  });
  app.use((req, res, next) => {
    if (req.get('User-Agent') && req.get('User-Agent').search('CaptiveNetworkSupport') !== -1) {
      debug('Receiving CaptiveNetworkSupport');
      return res.end('NO SUCCESS');
    }

    return next();
  });
  app.use(express__default["default"].static(webPath));
  app.get('/status', (req, res) => res.json(status));
  app.post('/status', async (req, res) => {
    const newStatus = await updateStatus();
    return res.json(newStatus);
  });
  app.get('/networks', async (req, res) => {
    const {
      networks: currentNetworks
    } = status;
    return res.json(currentNetworks);
  });
  app.post('/networks', async (req, res) => {
    const {
      networks: newNetworks
    } = await updateStatus();
    return res.json(newNetworks);
  });
  app.post('/connect', async (req, res) => {
    const {
      ssid,
      password
    } = req.body;
    debug('Connect to %s...', ssid);

    try {
      await wifi.connect(ssid, password);
    } catch (e) {
      debug('Error while connecting: %s', e);
    }

    try {
      await updateStatus();
    } catch (e) {
      debug('Error while updating status: %s', e);
    }

    return res.json(status);
  });
  app.get('/', async (req, res) => res.render(path__default["default"].join(webPath, 'index.html.ejs'), { ...status,
    locale,
    translations,
    fromServer: true
  }));
  app.get('*', async (req, res) => {
    debug('Request to %s', req.pathname);
    return res.render(path__default["default"].join(webPath, 'index.html.ejs'), { ...status,
      locale,
      translations,
      fromServer: true
    });
  });
  httpServer.listen(port, () => {
    debug('Listening on port %i', port);
  });
});

commander.program.description('Handle wifi').addCommand(command$2).addCommand(command$1).addCommand(command, {
  isDefault: true
});
commander.program.parse();
