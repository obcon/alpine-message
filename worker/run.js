var amqp = require('amqplib/callback_api');
console.log("started on: " + process.env.WORKER_NAME);

amqp.connect('amqp://' + process.env.RABBITMQ, function(err, conn) {
	if (!err) {
	    conn.createChannel(function(err, ch) {
		var ex = 'broadcast';

		ch.assertExchange(ex, 'fanout', {durable: false});

		ch.assertQueue('', {exclusive: true}, function(err, q) {
			console.log(" [*] Waiting for messages in %s", q.queue);
			ch.bindQueue(q.queue, ex, '');

			ch.consume(q.queue, function(msg) {
				var content = msg.content.toString();
				console.log(" [x] %s", content);
				if (content.indexOf("Hello") != -1) {
				    ch.publish(ex, '', new Buffer("Answer from " + process.env.WORKER_NAME));
				}

			    }, {noAck: true});
		    });
	    });
	} else {
	    console.log(err);
	}
    });
