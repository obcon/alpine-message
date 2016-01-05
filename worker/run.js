var amqp = require('amqplib/callback_api');

amqp.connect('amqp://' + process.env.RABBITMQ, function(err, conn) {
	if (!err) {
	    conn.createChannel(function(err, ch) {
		var ex = 'broadcast';

		ch.assertExchange(ex, 'fanout', {durable: false});

		ch.assertQueue('', {exclusive: true}, function(err, q) {
			console.log(" [*] Waiting for messages in %s", q.queue);
			ch.bindQueue(q.queue, ex, '');

			ch.consume(q.queue, function(msg) {
				console.log(" [x] %s", msg.content.toString());
			    }, {noAck: true});
		    });
	    });
	} else {
	    console.log(err);
	}
    });
