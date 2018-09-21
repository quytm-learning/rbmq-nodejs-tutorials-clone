#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {

  conn.createChannel(function(err, ch) {

    var q = 'task_queue';
    var msg = process.argv.slice(2).join(' ') || "Hello World!";

	// `durable` use for deciding to hold message in queue when RabbitMQ is quited or died. If durable = true, then message is hold
    // *Note: if we wanto hold all, need to be applied in both Producer and Consumer
    ch.assertQueue(q, {durable: true});
    // If task_queue won't be lost even if RabbitMQ restart, we need to mark message as persistent (using `persistent` option)
    ch.sendToQueue(q, new Buffer(msg), {persistent: true});

    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

