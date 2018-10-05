
const { Server } = require('http');

const IO = require('socket.io');
const async = require('async');
const uuid = require('uuid');
const base32 = require('base32');
const _ = require('lodash');
const express = require('express');

const app = express();
const server = new Server(app);

const port = Number(process.env.PORT) || 3000;
const io = IO(server);
const client_dir = `${__dirname}/build`;
const db = require('mongojs')((process.env.MONGO_URL || 'mongodb://localhost:27017/sample_chat'), [ 'messages', 'people' ]);

io.use((socket, next) => {
	console.log(`socket ${socket.id} has connected`);

	let qs = socket.handshake.query;

	let send_inbox = () => {
		let get_to = (cb) => {
			db.messages
				.distinct('from', { to: socket.nickname }, (error, messages) => {
					cb(messages || [])
				});
		};

		let get_from = (cb) => {
			db.messages
				.distinct('to', { from: socket.nickname }, (error, messages) => {
					cb(messages || [])
				});
		};

		get_to((people) => {
			get_from((people_) => {
				people = _.uniq(people.concat(people_)).filter((n) => n !== socket.nickname);

				async.map(people, (person, next) => {
					db.messages
						.find({ $or: [ { to: socket.nickname, from: person }, { to: person, from: socket.nickname } ] })
						.sort({ time: -1 })
						.limit(1)
						.next(next);
				}, (error, messages) => {

					messages = messages
									.filter(Boolean)
									.sort((a,b) => a.time>b.time ? -1 : a.time<b.time ? 1 : 0)
									.map((m) => {
										m.who = (m.from !== socket.nickname) ? m.from : m.to;
										return m;
									});
					socket.emit('load inbox', messages)
				})
			});
		})
	};

	let set_nickname = (nickname) => {
		socket.nickname = nickname;
		socket.join(nickname);
		io.sockets.to(`${nickname}:online`).emit(`${nickname}:online`, true);
		db.people.update({ nickname }, { $set: { nickname, online: true } }, { upsert: true }, (error) => {
			
		});
	};

	socket.once('disconnect', () => {
		if (socket.nickname){
			io.sockets.to(`${socket.nickname}:online`).emit(`${socket.nickname}:online`, false);
			db.people.update({ nickname: socket.nickname }, { $set: { online: false } }, { upsert: false }, (error) => {
				
			});		
		}
	})

	if (!qs.nickname) {
		console.log(`socket ${socket.id} did not send us a nickname, requesting that the user enter one`);
		socket.emit('obtain nickname');
	} else {
		console.log(`socket ${socket.id} will now be referred to as ${qs.nickname}`);
		set_nickname(qs.nickname);
	}

	socket.on('set nickname', (nickname) => {
		console.log(`socket ${socket.id} will now be referred to as ${nickname}`);
		set_nickname(nickname);
	});

	socket.on('obtain inbox', () => {
		console.log(`${socket.nickname} has asked for their inbox`)
		send_inbox();
	});

	socket.on('lookup person', (nickname, callback) => {
		db.people
			.find({ nickname: { $regex: nickname, $options: 'ig' } }, { nickname: 1 })
			.limit(10)
			.toArray((error, people) => {
				callback((error && []) || (people && people.map((p) => p.nickname).filter((n) => n !== socket.nickname)));
			});
	});

	socket.on('see if the other person is typing', (nickname) => {
		socket.join(`${nickname}:typing`);
	});

	socket.on("I don't care if the other person is typing", (nickname) => {
		socket.leave(`${nickname}:typing`);
	})

	socket.on('see if the other person is online', (nickname) => {
		socket.join(`${nickname}:online`);
		db.people
			.find({ nickname }, { online: 1 })
			.limit(1)
			.next((error, person) => {
				socket.emit(`${nickname}:online`, (person && person.online));
			});
	});

	socket.on("I don't care if the other person is online", (nickname) => {
		socket.leave(`${nickname}:online`);
	})

	socket.on('typing', (typing) => {
		console.log(`${socket.nickname} ${typing ? 'is' : "isn't"} typing`)
		io.sockets.to(`${socket.nickname}:typing`).emit(`${socket.nickname}:typing`, typing)
	});

	socket.on('send message', (message) => {
		message.from = socket.nickname;

		let buf =  new Buffer(32);
		uuid.v4(null, buf, 0);

		message.id = message.key = base32.encode(buf);
		message._id = buf;
		message.time = Date(message.time);

		console.log(`${message.from} sent message ${message.id} to ${message.to} at ${message.time.toString()}`)

		db.messages.insert(message, (error) => {
			if (!error) {
				socket.emit('message sent', message);
				io.sockets.to(message.to).emit('update inbox');
				io.sockets.to(message.to).emit(`message from ${socket.nickname}`, message);
			}
		});
	})

	socket.on('obtain conversation', (who) => {
		console.log(`${socket.nickname} is requesting all messages from or to ${who}`)

		db.messages.find({ 
			$or: [
				{ to: who, from: socket.nickname },
				{ from: who, to: socket.nickname }
			]
		})
		.sort({ time: 1 })
		.toArray((err, msgs) => {
			if (!err)
				socket.emit('load messages', msgs);
		});
	});

	next();
});

app.use(express.static(client_dir));

app.use((req, res) => {
	res.set('content-type', 'text/html');
	res.sendFile(`${client_dir}/index.html`);
});

server.listen(port, (error) => {
	if (error) {
		console.error(`Error listening on port ${port}: ${error.stack}`)
		return process.exit(1);
	}

	console.log(`Server is listening on port ${port}`)
});