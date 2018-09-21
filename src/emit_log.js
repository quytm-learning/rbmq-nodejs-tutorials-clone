#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'logs';
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';

    // Instead of `assertQueue`, we use `assertExchange` for adding message into exchange
    // `fanout` is a one type of exchange
    ch.assertExchange(ex, 'fanout', {durable: false});
    // Instead of `sendToQueue`, use `publish`
    // empty value mean that we don't want to send the message to any specific queue
    ch.publish(ex, '', new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

