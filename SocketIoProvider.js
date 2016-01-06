Ext.define('Ext.direct.SocketIoProvider', {

    extend  : 'Ext.direct.RemotingProvider',

    alias   : 'direct.socketioprovider',

    type    : 'socketio',

    enableBuffer: false,

    doConnect: function(){

        if( !Ext.isDefined(io) ){
            Ext.raise('The io global is missing. Forgot to load /socket.io/socket.io.js?');
            return;
        }

        var url = this.url,
            opts = this.opts;

        this.socket = io(url, opts);

        this.callParent(arguments);
    },

    doDisconnect: function(){

        if( !this.socket ){
            return;
        }

        this.socket.disconnect();
    },

    getSocket: function(){

        return this.socket;
    },

    sendRequest: function(transaction){

        if( !this.socket ){
            return;
        }

        var key = transaction.action + '.' + transaction.method,
            payload = this.getPayload(transaction);

        this.socket.emit(key, payload, this.onData.bind(this));
    },

    onData: function(response){

        var event = this.createEvent(response),
            transaction = this.getTransaction(event);

        this.fireEvent('data', this, event);

        if( transaction && this.fireEvent('beforecallback', this, event, transaction) !== false ){
            this.runCallback(transaction, event, true);
        }

        Ext.direct.Manager.removeTransaction(transaction);
    }
});