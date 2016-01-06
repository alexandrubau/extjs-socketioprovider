# Ext.direct.SocketIoProvider
Very simple and elegant Socket.io provider for Ext.Direct.

# Requirements
- ExtJS 6.0+ (may work with older)

# Usage

Just add the provider as you normally would with Ext.Direct:

```
Ext.direct.Manager.addProvider({
    id          : 'providerid',
    type        : 'socketio',
    url         : 'localhost:8080',
    namespace   : 'Socket',
    opts        : {
        reconnection: false,
        multiplex   : false
    },
    actions     : {
        Location: [
            {
                name: 'read',
                params: ['page', 'start', 'limit']
            },
            {
                name: 'add',
                params: ['name'],
                strict: false
            }
        ]
    }
});
```

From now on you can start making RPC calls.
The provider automatically connects to the Socket.io server using the supplied **url** and **opts**.

# Examples

Start your Socket.io server and listen for event:

```
socket.on('Location.add', function(req, res){

    console.log(req.data.name); // Romania

    res({
        type    : req.type,
        tid     : req.tid,
        action  : req.action,
        method  : req.method,
        data    : [
            {
                success: true
            }
        ]
    });
});

socket.on('Location.read', function(req, res){

    console.log(req.data.page); // 1

    res({
        type    : req.type,
        tid     : req.tid,
        action  : req.action,
        method  : req.method,
        data    : [
            {
                id  : '123',
                name: 'Blabla'
            }
        ]
    });
});

```

## Global namespace example

Can be called from anywhere:

```
Socket.Location.add({name: 'Romania'}, function(result){
    // console.log(result);
});
```

## Store and model example

Model definition:

```
Ext.define('Location', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'name',
            type: 'string'
        }
    ],
    proxy: {
        type: 'direct',
        api : {
            read: 'Socket.Location.read'
        }
    }
});
```

Store definition:

```
Ext.define('Locations', {
    extend: 'Ext.data.Store',
    alias: 'store.locations',
    model: 'Location'
});

```

# Events

After adding the provider, you can bind to Socket.io events like so:

```
var socket = Ext.direct.Manager.getProvider('providerid').getSocket();
socket.on('connect_error', function(){ // code });
socket.on('error', function(){ // code });
```

For the complete event list go to Socket.io docs.

# Warning

Be aware Socket.io's connection multiplex feature. Socket.io uses the same connection for multiple namespaces. Therefore when you call `socket.disconnect()` it doesn't really close the connection to the server.

# Docs

- [Socket.io docs](http://socket.io/docs/)
- [Ext.direct](http://docs.sencha.com/extjs/6.0/backend_connectors/direct/specification.html)