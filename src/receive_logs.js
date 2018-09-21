#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {

  conn.createChannel(function(err, ch) {
    var ex = 'logs';

    ch.assertExchange(ex, 'fanout', {durable: false});

    // Temporary queues
    // exclusive flag: when the connection that declared it closes, queue is deleted
    ch.assertQueue('', {exclusive: true}, function(err, q) {
      // Random queue name is generated, can get it by `q.queue`
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
      // Notifying to exchange send message to queue by `bindQueue` method
      ch.bindQueue(q.queue, ex, '');

      ch.consume(q.queue, function(msg) {
        console.log(" [x] %s", msg.content.toString());
      }, {noAck: true});
    });
    
  });

});

