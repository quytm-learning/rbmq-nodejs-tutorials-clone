#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn) {

  conn.createChannel(function(err, ch) {
    var q = 'task_queue';

    // `durable` use for deciding to hold message in queue when RabbitMQ is quited or died. If durable = true, then message is hold
    // *Note: if we wanto hold all, need to be applied in both Producer and Consumer
    ch.assertQueue(q, {durable: true});

    // Fair dispatch
    // When a worker is doing a heavy message, if we don't want to add new message in queue for that worker, mean that at that time it only have a message
    // we need to use prefetch with value is 1, This tells RabbitMQ not to give more than one message to a worker at a time
    ch.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

    ch.consume(q, function(msg) {

      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        // Need to send ACK back to Producer, Message still is in queue util ACK is sent back by consumer
        ch.ack(msg);
      }, secs * 1000);

    }, {noAck: false}); // noAck = false: Turn on Message acknowledgments

  });
});

