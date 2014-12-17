!function(t){"object"==typeof exports?module.exports=t():"function"==typeof define&&define.amd?define(t):"undefined"!=typeof window?window.io=t():"undefined"!=typeof global?global.io=t():"undefined"!=typeof self&&(self.io=t())}(function(){var t
return function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require
if(!a&&c)return c(s,!0)
if(i)return i(s,!0)
throw Error("Cannot find module '"+s+"'")}var p=n[s]={exports:{}}
t[s][0].call(p.exports,function(e){var n=t[s][1][e]
return o(n?n:e)},p,p.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s])
return o}({1:[function(t,e){e.exports=t("./lib/")},{"./lib/":2}],2:[function(t,e,n){function r(t,e){"object"==typeof t&&(e=t,t=void 0),e=e||{}
var n,r=o(t),i=r.source,p=r.id
return e.forceNew||!1===e.multiplex?(a("ignoring socket cache for %s",i),n=s(i,e)):(c[p]||(a("new io instance for %s",i),c[p]=s(i,e)),n=c[p]),n.socket(r.path)}var o=t("./url"),i=t("socket.io-parser"),s=t("./manager"),a=t("debug")("socket.io-client")
e.exports=n=r
var c=n.managers={}
n.protocol=i.protocol,n.connect=r,n.Manager=t("./manager"),n.Socket=t("./socket")},{"./manager":3,"./socket":5,"./url":6,debug:8,"socket.io-parser":39}],3:[function(t,e){function n(t,e){return this instanceof n?("object"==typeof t&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connected=0,this.attempts=0,this.encoding=!1,this.packetBuffer=[],this.encoder=new s.Encoder,this.decoder=new s.Decoder,void this.open()):new n(t,e)}var r=(t("./url"),t("engine.io-client")),o=t("./socket"),i=t("emitter"),s=t("socket.io-parser"),a=t("./on"),c=t("bind"),p=(t("object-component"),t("debug")("socket.io-client:manager"))
e.exports=n,i(n.prototype),n.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},n.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},n.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this):this._reconnectionDelay},n.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this):this._reconnectionDelayMax},n.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},n.prototype.maybeReconnectOnOpen=function(){this.openReconnect||this.reconnecting||!this._reconnection||(this.openReconnect=!0,this.reconnect())},n.prototype.open=n.prototype.connect=function(t){if(p("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this
p("opening %s",this.uri),this.engine=r(this.uri,this.opts)
var e=this.engine,n=this
this.readyState="opening"
var o=a(e,"open",function(){n.onopen(),t&&t()}),i=a(e,"error",function(e){if(p("connect_error"),n.cleanup(),n.readyState="closed",n.emit("connect_error",e),t){var r=Error("Connection error")
r.data=e,t(r)}n.maybeReconnectOnOpen()})
if(!1!==this._timeout){var s=this._timeout
p("connect attempt will timeout after %d",s)
var c=setTimeout(function(){p("connect attempt timed out after %d",s),o.destroy(),e.close(),e.emit("error","timeout"),n.emit("connect_timeout",s)},s)
this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(i),this},n.prototype.onopen=function(){p("open"),this.cleanup(),this.readyState="open",this.emit("open")
var t=this.engine
this.subs.push(a(t,"data",c(this,"ondata"))),this.subs.push(a(this.decoder,"decoded",c(this,"ondecoded"))),this.subs.push(a(t,"error",c(this,"onerror"))),this.subs.push(a(t,"close",c(this,"onclose")))},n.prototype.ondata=function(t){this.decoder.add(t)},n.prototype.ondecoded=function(t){this.emit("packet",t)},n.prototype.onerror=function(t){p("error",t),this.emit("error",t)},n.prototype.socket=function(t){var e=this.nsps[t]
if(!e){e=new o(this,t),this.nsps[t]=e
var n=this
e.on("connect",function(){n.connected++})}return e},n.prototype.destroy=function(){--this.connected||this.close()},n.prototype.packet=function(t){p("writing packet %j",t)
var e=this
e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(t){for(var n=0;n<t.length;n++)e.engine.write(t[n])
e.encoding=!1,e.processPacketQueue()}))},n.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift()
this.packet(t)}},n.prototype.cleanup=function(){for(var t;t=this.subs.shift();)t.destroy()
this.packetBuffer=[],this.encoding=!1,this.decoder.destroy()},n.prototype.close=n.prototype.disconnect=function(){this.skipReconnect=!0,this.engine.close()},n.prototype.onclose=function(t){p("close"),this.cleanup(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},n.prototype.reconnect=function(){if(this.reconnecting)return this
var t=this
if(this.attempts++,this.attempts>this._reconnectionAttempts)p("reconnect failed"),this.emit("reconnect_failed"),this.reconnecting=!1
else{var e=this.attempts*this.reconnectionDelay()
e=Math.min(e,this.reconnectionDelayMax()),p("will wait %dms before reconnect attempt",e),this.reconnecting=!0
var n=setTimeout(function(){p("attempting reconnect"),t.emit("reconnect_attempt"),t.open(function(e){e?(p("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emit("reconnect_error",e.data)):(p("reconnect success"),t.onreconnect())})},e)
this.subs.push({destroy:function(){clearTimeout(n)}})}},n.prototype.onreconnect=function(){var t=this.attempts
this.attempts=0,this.reconnecting=!1,this.emit("reconnect",t)}},{"./on":4,"./socket":5,"./url":6,bind:7,debug:8,emitter:9,"engine.io-client":10,"object-component":36,"socket.io-parser":39}],4:[function(t,e){function n(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}}e.exports=n},{}],5:[function(t,e,n){function r(t,e){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.open(),this.buffer=[],this.connected=!1,this.disconnected=!0}{var o=t("socket.io-parser"),i=t("emitter"),s=t("to-array"),a=t("./on"),c=t("bind"),p=t("debug")("socket.io-client:socket"),u=t("has-binary-data")
t("indexof")}e.exports=n=r
var f={connect:1,disconnect:1,error:1},h=i.prototype.emit
i(r.prototype),r.prototype.open=r.prototype.connect=function(){if(this.connected)return this
var t=this.io
return t.open(),this.subs=[a(t,"open",c(this,"onopen")),a(t,"error",c(this,"onerror")),a(t,"packet",c(this,"onpacket")),a(t,"close",c(this,"onclose"))],"open"==this.io.readyState&&this.onopen(),this},r.prototype.send=function(){var t=s(arguments)
return t.unshift("message"),this.emit.apply(this,t),this},r.prototype.emit=function(t){if(f.hasOwnProperty(t))return h.apply(this,arguments),this
var e=s(arguments),n=o.EVENT
u(e)&&(n=o.BINARY_EVENT)
var r={type:n,data:e}
return"function"==typeof e[e.length-1]&&(p("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),r.id=this.ids++),this.packet(r),this},r.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},r.prototype.onerror=function(t){this.emit("error",t)},r.prototype.onopen=function(){p("transport is open - connecting"),"/"!=this.nsp&&this.packet({type:o.CONNECT})},r.prototype.onclose=function(t){p("close (%s)",t),this.connected=!1,this.disconnected=!0,this.emit("disconnect",t)},r.prototype.onpacket=function(t){if(t.nsp==this.nsp)switch(t.type){case o.CONNECT:this.onconnect()
break
case o.EVENT:this.onevent(t)
break
case o.BINARY_EVENT:this.onevent(t)
break
case o.ACK:this.onack(t)
break
case o.BINARY_ACK:this.onack(t)
break
case o.DISCONNECT:this.ondisconnect()
break
case o.ERROR:this.emit("error",t.data)}},r.prototype.onevent=function(t){var e=t.data||[]
p("emitting event %j",e),null!=t.id&&(p("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?h.apply(this,e):this.buffer.push(e)},r.prototype.ack=function(t){var e=this,n=!1
return function(){if(!n){n=!0
var r=s(arguments)
p("sending ack %j",r)
var i=u(r)?o.BINARY_ACK:o.ACK
e.packet({type:i,id:t,data:r})}}},r.prototype.onack=function(t){p("calling ack %s with %j",t.id,t.data)
var e=this.acks[t.id]
e.apply(this,t.data),delete this.acks[t.id]},r.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},r.prototype.emitBuffered=function(){for(var t=0;t<this.buffer.length;t++)h.apply(this,this.buffer[t])
this.buffer=[]},r.prototype.ondisconnect=function(){p("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},r.prototype.destroy=function(){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy()
this.io.destroy(this)},r.prototype.close=r.prototype.disconnect=function(){return this.connected?(p("performing disconnect (%s)",this.nsp),this.packet({type:o.DISCONNECT}),this.destroy(),this.onclose("io client disconnect"),this):this}},{"./on":4,bind:7,debug:8,emitter:9,"has-binary-data":31,indexof:35,"socket.io-parser":39,"to-array":42}],6:[function(t,e){function n(t,e){var n=t,e=e||r.location
return null==t&&(t=e.protocol+"//"+e.hostname),"string"==typeof t&&("/"==t.charAt(0)&&void 0!==e&&(t=e.hostname+t),/^(https?|wss?):\/\//.test(t)||(i("protocol-less url %s",t),t=void 0!==e?e.protocol+"//"+t:"https://"+t),i("parse %s",t),n=o(t)),(/(http|ws)/.test(n.protocol)&&80==n.port||/(http|ws)s/.test(n.protocol)&&443==n.port)&&delete n.port,n.path=n.path||"/",n.id=n.protocol+n.host+(n.port?":"+n.port:""),n.href=n.protocol+"://"+n.host+(n.port?":"+n.port:""),n}var r="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},o=t("parseuri"),i=t("debug")("socket.io-client:url")
e.exports=n},{debug:8,parseuri:37}],7:[function(t,e){var n=[].slice
e.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw Error("bind() requires a function")
var r=[].slice.call(arguments,2)
return function(){return e.apply(t,r.concat(n.call(arguments)))}}},{}],8:[function(t,e){function n(t){return n.enabled(t)?function(e){e=r(e)
var o=new Date,i=o-(n[t]||o)
n[t]=o,e=t+" "+e+" +"+n.humanize(i),window.console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}:function(){}}function r(t){return t instanceof Error?t.stack||t.message:t}e.exports=n,n.names=[],n.skips=[],n.enable=function(t){try{localStorage.debug=t}catch(e){}for(var r=(t||"").split(/[\s,]+/),o=r.length,i=0;o>i;i++)t=r[i].replace("*",".*?"),"-"===t[0]?n.skips.push(RegExp("^"+t.substr(1)+"$")):n.names.push(RegExp("^"+t+"$"))},n.disable=function(){n.enable("")},n.humanize=function(t){var e=1e3,n=6e4,r=60*n
return t>=r?(t/r).toFixed(1)+"h":t>=n?(t/n).toFixed(1)+"m":t>=e?(t/e|0)+"s":t+"ms"},n.enabled=function(t){for(var e=0,r=n.skips.length;r>e;e++)if(n.skips[e].test(t))return!1
for(var e=0,r=n.names.length;r>e;e++)if(n.names[e].test(t))return!0
return!1}
try{window.localStorage&&n.enable(localStorage.debug)}catch(o){}},{}],9:[function(t,e){function n(t){return t?r(t):void 0}function r(t){for(var e in n.prototype)t[e]=n.prototype[e]
return t}var o=t("indexof")
e.exports=n,n.prototype.on=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks[t]=this._callbacks[t]||[]).push(e),this},n.prototype.once=function(t,e){function n(){r.off(t,n),e.apply(this,arguments)}var r=this
return this._callbacks=this._callbacks||{},e._off=n,this.on(t,n),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this
var n=this._callbacks[t]
if(!n)return this
if(1==arguments.length)return delete this._callbacks[t],this
var r=o(n,e._off||e)
return~r&&n.splice(r,1),this},n.prototype.emit=function(t){this._callbacks=this._callbacks||{}
var e=[].slice.call(arguments,1),n=this._callbacks[t]
if(n){n=n.slice(0)
for(var r=0,o=n.length;o>r;++r)n[r].apply(this,e)}return this},n.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks[t]||[]},n.prototype.hasListeners=function(t){return!!this.listeners(t).length}},{indexof:35}],10:[function(t,e){e.exports=t("./lib/")},{"./lib/":11}],11:[function(t,e){e.exports=t("./socket"),e.exports.parser=t("engine.io-parser")},{"./socket":12,"engine.io-parser":20}],12:[function(t,e){function n(t,e){if(!(this instanceof n))return new n(t,e)
if(e=e||{},t&&"object"==typeof t&&(e=t,t=null),t&&(t=u(t),e.host=t.host,e.secure="https"==t.protocol||"wss"==t.protocol,e.port=t.port,t.query&&(e.query=t.query)),this.secure=null!=e.secure?e.secure:o.location&&"https:"==location.protocol,e.host){var r=e.host.split(":")
e.hostname=r.shift(),r.length&&(e.port=r.pop())}this.agent=e.agent||!1,this.hostname=e.hostname||(o.location?location.hostname:"localhost"),this.port=e.port||(o.location&&location.port?location.port:this.secure?443:80),this.query=e.query||{},"string"==typeof this.query&&(this.query=h.decode(this.query)),this.upgrade=!1!==e.upgrade,this.path=(e.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!e.forceJSONP,this.forceBase64=!!e.forceBase64,this.timestampParam=e.timestampParam||"t",this.timestampRequests=e.timestampRequests,this.transports=e.transports||["polling","websocket"],this.readyState="",this.writeBuffer=[],this.callbackBuffer=[],this.policyPort=e.policyPort||843,this.rememberUpgrade=e.rememberUpgrade||!1,this.open(),this.binaryType=null,this.onlyBinaryUpgrades=e.onlyBinaryUpgrades}function r(t){var e={}
for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])
return e}var o="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},i=t("./transports"),s=t("emitter"),a=t("debug")("engine.io-client:socket"),c=t("indexof"),p=t("engine.io-parser"),u=t("parseuri"),f=t("parsejson"),h=t("parseqs")
e.exports=n,n.priorWebsocketSuccess=!1,s(n.prototype),n.protocol=p.protocol,n.Socket=n,n.Transport=t("./transport"),n.transports=t("./transports"),n.parser=t("engine.io-parser"),n.prototype.createTransport=function(t){a('creating transport "%s"',t)
var e=r(this.query)
e.EIO=p.protocol,e.transport=t,this.id&&(e.sid=this.id)
var n=new i[t]({agent:this.agent,hostname:this.hostname,port:this.port,secure:this.secure,path:this.path,query:e,forceJSONP:this.forceJSONP,forceBase64:this.forceBase64,timestampRequests:this.timestampRequests,timestampParam:this.timestampParam,policyPort:this.policyPort,socket:this})
return n},n.prototype.open=function(){var t
t=this.rememberUpgrade&&n.priorWebsocketSuccess&&-1!=this.transports.indexOf("websocket")?"websocket":this.transports[0],this.readyState="opening"
var t=this.createTransport(t)
t.open(),this.setTransport(t)},n.prototype.setTransport=function(t){a("setting transport %s",t.name)
var e=this
this.transport&&(a("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},n.prototype.probe=function(t){function e(){if(h.onlyBinaryUpgrades){var e=!this.supportsBinary&&h.transport.supportsBinary
f=f||e}f||(a('probe transport "%s" opened',t),u.send([{type:"ping",data:"probe"}]),u.once("packet",function(e){if(!f)if("pong"==e.type&&"probe"==e.data)a('probe transport "%s" pong',t),h.upgrading=!0,h.emit("upgrading",u),n.priorWebsocketSuccess="websocket"==u.name,a('pausing current transport "%s"',h.transport.name),h.transport.pause(function(){f||"closed"!=h.readyState&&"closing"!=h.readyState&&(a("changing transport and sending upgrade packet"),p(),h.setTransport(u),u.send([{type:"upgrade"}]),h.emit("upgrade",u),u=null,h.upgrading=!1,h.flush())})
else{a('probe transport "%s" failed',t)
var r=Error("probe error")
r.transport=u.name,h.emit("upgradeError",r)}}))}function r(){f||(f=!0,p(),u.close(),u=null)}function o(e){var n=Error("probe error: "+e)
n.transport=u.name,r(),a('probe transport "%s" failed because of error: %s',t,e),h.emit("upgradeError",n)}function i(){o("transport closed")}function s(){o("socket closed")}function c(t){u&&t.name!=u.name&&(a('"%s" works - aborting "%s"',t.name,u.name),r())}function p(){u.removeListener("open",e),u.removeListener("error",o),u.removeListener("close",i),h.removeListener("close",s),h.removeListener("upgrading",c)}a('probing transport "%s"',t)
var u=this.createTransport(t,{probe:1}),f=!1,h=this
n.priorWebsocketSuccess=!1,u.once("open",e),u.once("error",o),u.once("close",i),this.once("close",s),this.once("upgrading",c),u.open()},n.prototype.onOpen=function(){if(a("socket open"),this.readyState="open",n.priorWebsocketSuccess="websocket"==this.transport.name,this.emit("open"),this.flush(),"open"==this.readyState&&this.upgrade&&this.transport.pause){a("starting upgrade probes")
for(var t=0,e=this.upgrades.length;e>t;t++)this.probe(this.upgrades[t])}},n.prototype.onPacket=function(t){if("opening"==this.readyState||"open"==this.readyState)switch(a('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(f(t.data))
break
case"pong":this.setPing()
break
case"error":var e=Error("server error")
e.code=t.data,this.emit("error",e)
break
case"message":this.emit("data",t.data),this.emit("message",t.data)}else a('packet received with socket readyState "%s"',this.readyState)},n.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!=this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},n.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer)
var e=this
e.pingTimeoutTimer=setTimeout(function(){"closed"!=e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},n.prototype.setPing=function(){var t=this
clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){a("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},n.prototype.ping=function(){this.sendPacket("ping")},n.prototype.onDrain=function(){for(var t=0;t<this.prevBufferLen;t++)this.callbackBuffer[t]&&this.callbackBuffer[t]()
this.writeBuffer.splice(0,this.prevBufferLen),this.callbackBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0==this.writeBuffer.length?this.emit("drain"):this.flush()},n.prototype.flush=function(){"closed"!=this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(a("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},n.prototype.write=n.prototype.send=function(t,e){return this.sendPacket("message",t,e),this},n.prototype.sendPacket=function(t,e,n){var r={type:t,data:e}
this.emit("packetCreate",r),this.writeBuffer.push(r),this.callbackBuffer.push(n),this.flush()},n.prototype.close=function(){return("opening"==this.readyState||"open"==this.readyState)&&(this.onClose("forced close"),a("socket closing - telling transport to close"),this.transport.close()),this},n.prototype.onError=function(t){a("socket error %j",t),n.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},n.prototype.onClose=function(t,e){if("opening"==this.readyState||"open"==this.readyState){a('socket close with reason: "%s"',t)
var n=this
clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),setTimeout(function(){n.writeBuffer=[],n.callbackBuffer=[],n.prevBufferLen=0},0),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e)}},n.prototype.filterUpgrades=function(t){for(var e=[],n=0,r=t.length;r>n;n++)~c(this.transports,t[n])&&e.push(t[n])
return e}},{"./transport":13,"./transports":14,debug:8,emitter:9,"engine.io-parser":20,indexof:35,parsejson:28,parseqs:29,parseuri:37}],13:[function(t,e){function n(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket}var r=t("engine.io-parser"),o=t("emitter")
e.exports=n,o(n.prototype),n.timestamps=0,n.prototype.onError=function(t,e){var n=Error(t)
return n.type="TransportError",n.description=e,this.emit("error",n),this},n.prototype.open=function(){return("closed"==this.readyState||""==this.readyState)&&(this.readyState="opening",this.doOpen()),this},n.prototype.close=function(){return("opening"==this.readyState||"open"==this.readyState)&&(this.doClose(),this.onClose()),this},n.prototype.send=function(t){if("open"!=this.readyState)throw Error("Transport not open")
this.write(t)},n.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},n.prototype.onData=function(t){this.onPacket(r.decodePacket(t,this.socket.binaryType))},n.prototype.onPacket=function(t){this.emit("packet",t)},n.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},{emitter:9,"engine.io-parser":20}],14:[function(t,e,n){function r(t){var e,n=!1
if(o.location){var r="https:"==location.protocol,c=location.port
c||(c=r?443:80),n=t.hostname!=location.hostname||c!=t.port}return t.xdomain=n,e=new i(t),"open"in e&&!t.forceJSONP?new s(t):new a(t)}var o="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},i=t("xmlhttprequest"),s=t("./polling-xhr"),a=t("./polling-jsonp"),c=t("./websocket")
n.polling=r,n.websocket=c},{"./polling-jsonp":15,"./polling-xhr":16,"./websocket":18,xmlhttprequest:19}],15:[function(t,e){function n(){}function r(t){i.call(this,t),this.query=this.query||{},a||(o.___eio||(o.___eio=[]),a=o.___eio),this.index=a.length
var e=this
a.push(function(t){e.onData(t)}),this.query.j=this.index,o.document&&o.addEventListener&&o.addEventListener("beforeunload",function(){e.script&&(e.script.onerror=n)})}var o="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},i=t("./polling"),s=t("inherits")
e.exports=r
var a,c=/\n/g,p=/\\n/g
s(r,i),r.prototype.supportsBinary=!1,r.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null),i.prototype.doClose.call(this)},r.prototype.doPoll=function(){var t=this,e=document.createElement("script")
this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)}
var n=document.getElementsByTagName("script")[0]
n.parentNode.insertBefore(e,n),this.script=e
var r="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent)
r&&setTimeout(function(){var t=document.createElement("iframe")
document.body.appendChild(t),document.body.removeChild(t)},100)},r.prototype.doWrite=function(t,e){function n(){r(),e()}function r(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var e='<iframe src="javascript:0" name="'+o.iframeId+'">'
i=document.createElement(e)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this
if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),u=this.iframeId="eio_iframe_"+this.index
s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=u,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),r(),t=t.replace(p,"\\\n"),this.area.value=t.replace(c,"\\n")
try{this.form.submit()}catch(f){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"==o.iframe.readyState&&n()}:this.iframe.onload=n}},{"./polling":17,inherits:27}],16:[function(t,e){function n(){}function r(t){if(c.call(this,t),s.location){var e="https:"==location.protocol,n=location.port
n||(n=e?443:80),this.xd=t.hostname!=s.location.hostname||n!=t.port}}function o(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.async=!1!==t.async,this.data=void 0!=t.data?t.data:null,this.agent=t.agent,this.create(t.isBinary,t.supportsBinary)}function i(){for(var t in o.requests)o.requests.hasOwnProperty(t)&&o.requests[t].abort()}var s="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},a=t("xmlhttprequest"),c=t("./polling"),p=t("emitter"),u=t("debug")("engine.io-client:polling-xhr"),f=t("inherits")
e.exports=r,e.exports.Request=o,f(r,c),r.prototype.supportsBinary=!0,r.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,new o(t)},r.prototype.doWrite=function(t,e){var n="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:n}),o=this
r.on("success",e),r.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=r},r.prototype.doPoll=function(){u("xhr poll")
var t=this.request(),e=this
t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},p(o.prototype),o.prototype.create=function(t,e){var n=this.xhr=new a({agent:this.agent,xdomain:this.xd}),r=this
try{if(u("xhr open %s: %s",this.method,this.uri),n.open(this.method,this.uri,this.async),e&&(n.responseType="arraybuffer"),"POST"==this.method)try{t?n.setRequestHeader("Content-type","application/octet-stream"):n.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(i){}"withCredentials"in n&&(n.withCredentials=!0),n.onreadystatechange=function(){var t
try{if(4!=n.readyState)return
if(200==n.status||1223==n.status){var o=n.getResponseHeader("Content-Type")
t="application/octet-stream"===o?n.response:e?"ok":n.responseText}else setTimeout(function(){r.onError(n.status)},0)}catch(i){r.onError(i)}null!=t&&r.onData(t)},u("xhr data %s",this.data),n.send(this.data)}catch(i){return void setTimeout(function(){r.onError(i)},0)}s.document&&(this.index=o.requestsCount++,o.requests[this.index]=this)},o.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},o.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},o.prototype.onError=function(t){this.emit("error",t),this.cleanup()},o.prototype.cleanup=function(){if(void 0!==this.xhr&&null!==this.xhr){this.xhr.onreadystatechange=n
try{this.xhr.abort()}catch(t){}s.document&&delete o.requests[this.index],this.xhr=null}},o.prototype.abort=function(){this.cleanup()},s.document&&(o.requestsCount=0,o.requests={},s.attachEvent?s.attachEvent("onunload",i):s.addEventListener&&s.addEventListener("beforeunload",i))},{"./polling":17,debug:8,emitter:9,inherits:27,xmlhttprequest:19}],17:[function(t,e){function n(t){var e=t&&t.forceBase64;(!c||e)&&(this.supportsBinary=!1),r.call(this,t)}var r=t("../transport"),o=t("parseqs"),i=t("engine.io-parser"),s=t("debug")("engine.io-client:polling"),a=t("inherits")
e.exports=n
var c=function(){var e=t("xmlhttprequest"),n=new e({agent:this.agent,xdomain:!1})
return null!=n.responseType}()
a(n,r),n.prototype.name="polling",n.prototype.doOpen=function(){this.poll()},n.prototype.pause=function(t){function e(){s("paused"),n.readyState="paused",t()}var n=this
if(this.readyState="pausing",this.polling||!this.writable){var r=0
this.polling&&(s("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){s("pre-pause polling complete"),--r||e()})),this.writable||(s("we are currently writing - waiting to pause"),r++,this.once("drain",function(){s("pre-pause writing complete"),--r||e()}))}else e()},n.prototype.poll=function(){s("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},n.prototype.onData=function(t){var e=this
s("polling got data %s",t)
var n=function(t){return"opening"==e.readyState&&e.onOpen(),"close"==t.type?(e.onClose(),!1):void e.onPacket(t)}
i.decodePayload(t,this.socket.binaryType,n),"closed"!=this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"==this.readyState?this.poll():s('ignoring poll - transport state "%s"',this.readyState))},n.prototype.doClose=function(){function t(){s("writing close packet"),e.write([{type:"close"}])}var e=this
"open"==this.readyState?(s("transport open - closing"),t()):(s("transport not open - deferring close"),this.once("open",t))},n.prototype.write=function(t){var e=this
this.writable=!1
var n=function(){e.writable=!0,e.emit("drain")},e=this
i.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,n)})},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",n=""
return!1!==this.timestampRequests&&(t[this.timestampParam]=+new Date+"-"+r.timestamps++),this.supportsBinary||t.sid||(t.b64=1),t=o.encode(t),this.port&&("https"==e&&443!=this.port||"http"==e&&80!=this.port)&&(n=":"+this.port),t.length&&(t="?"+t),e+"://"+this.hostname+n+this.path+t}},{"../transport":13,debug:8,"engine.io-parser":20,inherits:27,parseqs:29,xmlhttprequest:19}],18:[function(t,e){function n(t){var e=t&&t.forceBase64
e&&(this.supportsBinary=!1),r.call(this,t)}var r=t("../transport"),o=t("engine.io-parser"),i=t("parseqs"),s=t("debug")("engine.io-client:websocket"),a=t("inherits"),c=t("ws")
e.exports=n,a(n,r),n.prototype.name="websocket",n.prototype.supportsBinary=!0,n.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=void 0,n={agent:this.agent}
this.ws=new c(t,e,n),void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.binaryType="arraybuffer",this.addEventListeners()}},n.prototype.addEventListeners=function(){var t=this
this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},"undefined"!=typeof navigator&&/iPad|iPhone|iPod/i.test(navigator.userAgent)&&(n.prototype.onData=function(t){var e=this
setTimeout(function(){r.prototype.onData.call(e,t)},0)}),n.prototype.write=function(t){function e(){n.writable=!0,n.emit("drain")}var n=this
this.writable=!1
for(var r=0,i=t.length;i>r;r++)o.encodePacket(t[r],this.supportsBinary,function(t){try{n.ws.send(t)}catch(e){s("websocket closed before onclose event")}})
setTimeout(e,0)},n.prototype.onClose=function(){r.prototype.onClose.call(this)},n.prototype.doClose=function(){void 0!==this.ws&&this.ws.close()},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",n=""
return this.port&&("wss"==e&&443!=this.port||"ws"==e&&80!=this.port)&&(n=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=+new Date),this.supportsBinary||(t.b64=1),t=i.encode(t),t.length&&(t="?"+t),e+"://"+this.hostname+n+this.path+t},n.prototype.check=function(){return!(!c||"__initialize"in c&&this.name===n.prototype.name)}},{"../transport":13,debug:8,"engine.io-parser":20,inherits:27,parseqs:29,ws:30}],19:[function(t,e){var n=t("has-cors")
e.exports=function(t){var e=t.xdomain
try{if("undefined"!=typeof XMLHttpRequest&&(!e||n))return new XMLHttpRequest}catch(r){}if(!e)try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(r){}}},{"has-cors":33}],20:[function(t,e,n){function r(t,e,r){if(!e)return n.encodeBase64Packet(t,r)
var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength)
s[0]=d[t.type]
for(var a=0;a<i.length;a++)s[a+1]=i[a]
return r(s.buffer)}function o(t,e,r){if(!e)return n.encodeBase64Packet(t,r)
var o=new FileReader
return o.onload=function(){t.data=o.result,n.encodePacket(t,e,r)},o.readAsArrayBuffer(t.data)}function i(t,e,r){if(!e)return n.encodeBase64Packet(t,r)
if(l)return o(t,e,r)
var i=new Uint8Array(1)
i[0]=d[t.type]
var s=new m([i.buffer,t.data])
return r(s)}function s(t,e,n){for(var r=Array(t.length),o=f(t.length,n),i=function(t,n,o){e(n,function(e,n){r[t]=n,o(e,r)})},s=0;s<t.length;s++)i(s,t[s],o)}var a="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},c=t("./keys"),p=t("arraybuffer.slice"),u=t("base64-arraybuffer"),f=t("after"),h=t("utf8"),l=navigator.userAgent.match(/Android/i)
n.protocol=2
var d=n.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},y=c(d),g={type:"error",data:"parser error"},m=t("blob")
n.encodePacket=function(t,e,n){"function"==typeof e&&(n=e,e=!1)
var o=void 0===t.data?void 0:t.data.buffer||t.data
if(a.ArrayBuffer&&o instanceof ArrayBuffer)return r(t,e,n)
if(m&&o instanceof a.Blob)return i(t,e,n)
var s=d[t.type]
return void 0!==t.data&&(s+=h.encode(t.data+"")),n(""+s)},n.encodeBase64Packet=function(t,e){var r="b"+n.packets[t.type]
if(m&&t.data instanceof m){var o=new FileReader
return o.onload=function(){var t=o.result.split(",")[1]
e(r+t)},o.readAsDataURL(t.data)}var i
try{i=String.fromCharCode.apply(null,new Uint8Array(t.data))}catch(s){for(var c=new Uint8Array(t.data),p=Array(c.length),u=0;u<c.length;u++)p[u]=c[u]
i=String.fromCharCode.apply(null,p)}return r+=a.btoa(i),e(r)},n.decodePacket=function(t,e){if("string"==typeof t||void 0===t){if("b"==t.charAt(0))return n.decodeBase64Packet(t.substr(1),e)
t=h.decode(t)
var r=t.charAt(0)
return+r==r&&y[r]?t.length>1?{type:y[r],data:t.substring(1)}:{type:y[r]}:g}var o=new Uint8Array(t),r=o[0],i=p(t,1)
return m&&"blob"===e&&(i=new m([i])),{type:y[r],data:i}},n.decodeBase64Packet=function(t,e){var n=y[t.charAt(0)]
if(!a.ArrayBuffer)return{type:n,data:{base64:!0,data:t.substr(1)}}
var r=u.decode(t.substr(1))
return"blob"===e&&m&&(r=new m([r])),{type:n,data:r}},n.encodePayload=function(t,e,r){function o(t){return t.length+":"+t}function i(t,r){n.encodePacket(t,e,function(t){r(null,o(t))})}return"function"==typeof e&&(r=e,e=null),e?m&&!l?n.encodePayloadAsBlob(t,r):n.encodePayloadAsArrayBuffer(t,r):t.length?void s(t,i,function(t,e){return r(e.join(""))}):r("0:")},n.decodePayload=function(t,e,r){if("string"!=typeof t)return n.decodePayloadAsBinary(t,e,r)
"function"==typeof e&&(r=e,e=null)
var o
if(""==t)return r(g,0,1)
for(var i,s,a="",c=0,p=t.length;p>c;c++){var u=t.charAt(c)
if(":"!=u)a+=u
else{if(""==a||a!=(i=+a))return r(g,0,1)
if(s=t.substr(c+1,i),a!=s.length)return r(g,0,1)
if(s.length){if(o=n.decodePacket(s,e),g.type==o.type&&g.data==o.data)return r(g,0,1)
var f=r(o,c+i,p)
if(!1===f)return}c+=i,a=""}}return""!=a?r(g,0,1):void 0},n.encodePayloadAsArrayBuffer=function(t,e){function r(t,e){n.encodePacket(t,!0,function(t){return e(null,t)})}return t.length?void s(t,r,function(t,n){var r=n.reduce(function(t,e){var n
return n="string"==typeof e?e.length:e.byteLength,t+(""+n).length+n+2},0),o=new Uint8Array(r),i=0
return n.forEach(function(t){var e="string"==typeof t,n=t
if(e){for(var r=new Uint8Array(t.length),s=0;s<t.length;s++)r[s]=t.charCodeAt(s)
n=r.buffer}o[i++]=e?0:1
for(var a=""+n.byteLength,s=0;s<a.length;s++)o[i++]=parseInt(a[s])
o[i++]=255
for(var r=new Uint8Array(n),s=0;s<r.length;s++)o[i++]=r[s]}),e(o.buffer)}):e(new ArrayBuffer(0))},n.encodePayloadAsBlob=function(t,e){function r(t,e){n.encodePacket(t,!0,function(t){var n=new Uint8Array(1)
if(n[0]=1,"string"==typeof t){for(var r=new Uint8Array(t.length),o=0;o<t.length;o++)r[o]=t.charCodeAt(o)
t=r.buffer,n[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=""+i,a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o])
if(a[s.length]=255,m){var c=new m([n.buffer,a.buffer,t])
e(null,c)}})}s(t,r,function(t,n){return e(new m(n))})},n.decodePayloadAsBinary=function(t,e,r){"function"==typeof e&&(r=e,e=null)
for(var o=t,i=[];o.byteLength>0;){for(var s=new Uint8Array(o),a=0===s[0],c="",u=1;255!=s[u];u++)c+=s[u]
o=p(o,2+c.length),c=parseInt(c)
var f=p(o,0,c)
if(a)try{f=String.fromCharCode.apply(null,new Uint8Array(f))}catch(h){var l=new Uint8Array(f)
f=""
for(var u=0;u<l.length;u++)f+=String.fromCharCode(l[u])}i.push(f),o=p(o,c)}var d=i.length
i.forEach(function(t,o){r(n.decodePacket(t,e),o,d)})}},{"./keys":21,after:22,"arraybuffer.slice":23,"base64-arraybuffer":24,blob:25,utf8:26}],21:[function(t,e){e.exports=Object.keys||function(t){var e=[],n=Object.prototype.hasOwnProperty
for(var r in t)n.call(t,r)&&e.push(r)
return e}},{}],22:[function(t,e){function n(t,e,n){function o(t,r){if(o.count<=0)throw Error("after called too many times");--o.count,t?(i=!0,e(t),e=n):0!==o.count||i||e(null,r)}var i=!1
return n=n||r,o.count=t,0===t?e():o}function r(){}e.exports=n},{}],23:[function(t,e){e.exports=function(t,e,n){var r=t.byteLength
if(e=e||0,n=n||r,t.slice)return t.slice(e,n)
if(0>e&&(e+=r),0>n&&(n+=r),n>r&&(n=r),e>=r||e>=n||0===r)return new ArrayBuffer(0)
for(var o=new Uint8Array(t),i=new Uint8Array(n-e),s=e,a=0;n>s;s++,a++)i[a]=o[s]
return i.buffer}},{}],24:[function(t,e,n){!function(t){"use strict"
n.encode=function(e){var n,r=new Uint8Array(e),o=r.length,i=""
for(n=0;o>n;n+=3)i+=t[r[n]>>2],i+=t[(3&r[n])<<4|r[n+1]>>4],i+=t[(15&r[n+1])<<2|r[n+2]>>6],i+=t[63&r[n+2]]
return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},n.decode=function(e){var n,r,o,i,s,a=.75*e.length,c=e.length,p=0
"="===e[e.length-1]&&(a--,"="===e[e.length-2]&&a--)
var u=new ArrayBuffer(a),f=new Uint8Array(u)
for(n=0;c>n;n+=4)r=t.indexOf(e[n]),o=t.indexOf(e[n+1]),i=t.indexOf(e[n+2]),s=t.indexOf(e[n+3]),f[p++]=r<<2|o>>4,f[p++]=(15&o)<<4|i>>2,f[p++]=(3&i)<<6|63&s
return u}}("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")},{}],25:[function(t,e){function n(t,e){e=e||{}
for(var n=new o,r=0;r<t.length;r++)n.append(t[r])
return e.type?n.getBlob(e.type):n.getBlob()}var r="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},o=r.BlobBuilder||r.WebKitBlobBuilder||r.MSBlobBuilder||r.MozBlobBuilder,i=function(){try{var t=new Blob(["hi"])
return 2==t.size}catch(e){return!1}}(),s=o&&o.prototype.append&&o.prototype.getBlob
e.exports=function(){return i?r.Blob:s?n:void 0}()},{}],26:[function(e,n,r){var o="undefined"!=typeof self?self:"undefined"!=typeof window?window:{}
!function(e){function i(t){for(var e,n,r=[],o=0,i=t.length;i>o;)e=t.charCodeAt(o++),e>=55296&&56319>=e&&i>o?(n=t.charCodeAt(o++),56320==(64512&n)?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--)):r.push(e)
return r}function s(t){for(var e,n=t.length,r=-1,o="";++r<n;)e=t[r],e>65535&&(e-=65536,o+=b(e>>>10&1023|55296),e=56320|1023&e),o+=b(e)
return o}function a(t,e){return b(t>>e&63|128)}function c(t){if(0==(4294967168&t))return b(t)
var e=""
return 0==(4294965248&t)?e=b(t>>6&31|192):0==(4294901760&t)?(e=b(t>>12&15|224),e+=a(t,6)):0==(4292870144&t)&&(e=b(t>>18&7|240),e+=a(t,12),e+=a(t,6)),e+=b(63&t|128)}function p(t){for(var e,n=i(t),r=n.length,o=-1,s="";++o<r;)e=n[o],s+=c(e)
return s}function u(){if(v>=m)throw Error("Invalid byte index")
var t=255&g[v]
if(v++,128==(192&t))return 63&t
throw Error("Invalid continuation byte")}function f(){var t,e,n,r,o
if(v>m)throw Error("Invalid byte index")
if(v==m)return!1
if(t=255&g[v],v++,0==(128&t))return t
if(192==(224&t)){var e=u()
if(o=(31&t)<<6|e,o>=128)return o
throw Error("Invalid continuation byte")}if(224==(240&t)){if(e=u(),n=u(),o=(15&t)<<12|e<<6|n,o>=2048)return o
throw Error("Invalid continuation byte")}if(240==(248&t)&&(e=u(),n=u(),r=u(),o=(15&t)<<18|e<<12|n<<6|r,o>=65536&&1114111>=o))return o
throw Error("Invalid UTF-8 detected")}function h(t){g=i(t),m=g.length,v=0
for(var e,n=[];(e=f())!==!1;)n.push(e)
return s(n)}var l="object"==typeof r&&r,d="object"==typeof n&&n&&n.exports==l&&n,y="object"==typeof o&&o;(y.global===y||y.window===y)&&(e=y)
var g,m,v,b=String.fromCharCode,w={version:"2.0.0",encode:p,decode:h}
if("function"==typeof t&&"object"==typeof t.amd&&t.amd)t(function(){return w})
else if(l&&!l.nodeType)if(d)d.exports=w
else{var k={},A=k.hasOwnProperty
for(var B in w)A.call(w,B)&&(l[B]=w[B])}else e.utf8=w}(this)},{}],27:[function(t,e){e.exports="function"==typeof Object.create?function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:function(t,e){t.super_=e
var n=function(){}
n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},{}],28:[function(t,e){var n="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},r=/^[\],:{}\s]*$/,o=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,i=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,s=/(?:^|:|,)(?:\s*\[)+/g,a=/^\s+/,c=/\s+$/
e.exports=function(t){return"string"==typeof t&&t?(t=t.replace(a,"").replace(c,""),n.JSON&&JSON.parse?JSON.parse(t):r.test(t.replace(o,"@").replace(i,"]").replace(s,""))?Function("return "+t)():void 0):null}},{}],29:[function(t,e,n){n.encode=function(t){var e=""
for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]))
return e},n.decode=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;o>r;r++){var i=n[r].split("=")
e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},{}],30:[function(t,e){function n(t,e){var n
return n=e?new o(t,e):new o(t)}var r=function(){return this}(),o=r.WebSocket||r.MozWebSocket
e.exports=o?n:null,o&&(n.prototype=o.prototype)},{}],31:[function(t,e){function n(t){function e(t){if(!t)return!1
if(r.Buffer&&Buffer.isBuffer(t)||r.ArrayBuffer&&t instanceof ArrayBuffer||r.Blob&&t instanceof Blob||r.File&&t instanceof File)return!0
if(o(t)){for(var n=0;n<t.length;n++)if(e(t[n]))return!0}else if(t&&"object"==typeof t){t.toJSON&&(t=t.toJSON())
for(var i in t)if(e(t[i]))return!0}return!1}return e(t)}var r="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},o=t("isarray")
e.exports=n},{isarray:32}],32:[function(t,e){e.exports=Array.isArray||function(t){return"[object Array]"==Object.prototype.toString.call(t)}},{}],33:[function(t,e){var n=t("global")
try{e.exports="XMLHttpRequest"in n&&"withCredentials"in new n.XMLHttpRequest}catch(r){e.exports=!1}},{global:34}],34:[function(t,e){e.exports=function(){return this}()},{}],35:[function(t,e){var n=[].indexOf
e.exports=function(t,e){if(n)return t.indexOf(e)
for(var r=0;r<t.length;++r)if(t[r]===e)return r
return-1}},{}],36:[function(t,e,n){var r=Object.prototype.hasOwnProperty
n.keys=Object.keys||function(t){var e=[]
for(var n in t)r.call(t,n)&&e.push(n)
return e},n.values=function(t){var e=[]
for(var n in t)r.call(t,n)&&e.push(t[n])
return e},n.merge=function(t,e){for(var n in e)r.call(e,n)&&(t[n]=e[n])
return t},n.length=function(t){return n.keys(t).length},n.isEmpty=function(t){return 0==n.length(t)}},{}],37:[function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,r=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"]
e.exports=function(t){for(var e=n.exec(t||""),o={},i=14;i--;)o[r[i]]=e[i]||""
return o}},{}],38:[function(t,e,n){function r(t){return o.Buffer&&Buffer.isBuffer(t)||o.ArrayBuffer&&t instanceof ArrayBuffer}var o="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},i=t("isarray")
n.deconstructPacket=function(t){function e(t){if(!t)return t
if(o.Buffer&&Buffer.isBuffer(t)||o.ArrayBuffer&&t instanceof ArrayBuffer){var r={_placeholder:!0,num:n.length}
return n.push(t),r}if(i(t)){for(var s=Array(t.length),a=0;a<t.length;a++)s[a]=e(t[a])
return s}if("object"==typeof t&&!(t instanceof Date)){var s={}
for(var c in t)s[c]=e(t[c])
return s}return t}var n=[],r=t.data,s=t
return s.data=e(r),s.attachments=n.length,{packet:s,buffers:n}},n.reconstructPacket=function(t,e){function n(t){if(t&&t._placeholder){var r=e[t.num]
return r}if(i(t)){for(var o=0;o<t.length;o++)t[o]=n(t[o])
return t}if(t&&"object"==typeof t){for(var s in t)t[s]=n(t[s])
return t}return t}return t.data=n(t.data),t.attachments=void 0,t},n.removeBlobs=function(t,e){function n(t,c,p){if(!t)return t
if(o.Blob&&t instanceof Blob||o.File&&t instanceof File){s++
var u=new FileReader
u.onload=function(){p?p[c]=this.result:a=this.result,--s||e(a)},u.readAsArrayBuffer(t)}if(i(t))for(var f=0;f<t.length;f++)n(t[f],f,t)
else if(t&&"object"==typeof t&&!r(t))for(var h in t)n(t[h],h,t)}var s=0,a=t
n(a),s||e(a)}},{isarray:40}],39:[function(t,e,n){function r(){}function o(t){var e="",r=!1
return e+=t.type,(n.BINARY_EVENT==t.type||n.BINARY_ACK==t.type)&&(e+=t.attachments,e+="-"),t.nsp&&"/"!=t.nsp&&(r=!0,e+=t.nsp),null!=t.id&&(r&&(e+=",",r=!1),e+=t.id),null!=t.data&&(r&&(e+=","),e+=h.stringify(t.data)),f("encoded %j as %s",t,e),e}function i(t,e){function n(t){var n=d.deconstructPacket(t),r=o(n.packet),i=n.buffers
i.unshift(r),e(i)}d.removeBlobs(t,n)}function s(){this.reconstructor=null}function a(t){var e={},r=0
if(e.type=+t.charAt(0),null==n.types[e.type])return p()
if(n.BINARY_EVENT==e.type||n.BINARY_ACK==e.type){for(e.attachments="";"-"!=t.charAt(++r);)e.attachments+=t.charAt(r)
e.attachments=+e.attachments}if("/"==t.charAt(r+1))for(e.nsp="";++r;){var o=t.charAt(r)
if(","==o)break
if(e.nsp+=o,r+1==t.length)break}else e.nsp="/"
var i=t.charAt(r+1)
if(""!=i&&+i==i){for(e.id="";++r;){var o=t.charAt(r)
if(null==o||+o!=o){--r
break}if(e.id+=t.charAt(r),r+1==t.length)break}e.id=+e.id}if(t.charAt(++r))try{e.data=h.parse(t.substr(r))}catch(s){return p()}return f("decoded %s as %j",t,e),e}function c(t){this.reconPack=t,this.buffers=[]}function p(){return{type:n.ERROR,data:"parser error"}}var u="undefined"!=typeof self?self:"undefined"!=typeof window?window:{},f=t("debug")("socket.io-parser"),h=t("json3"),l=(t("isarray"),t("emitter")),d=t("./binary")
n.protocol=3,n.types=["CONNECT","DISCONNECT","EVENT","BINARY_EVENT","ACK","BINARY_ACK","ERROR"],n.CONNECT=0,n.DISCONNECT=1,n.EVENT=2,n.ACK=3,n.ERROR=4,n.BINARY_EVENT=5,n.BINARY_ACK=6,n.Encoder=r,r.prototype.encode=function(t,e){if(f("encoding packet %j",t),n.BINARY_EVENT==t.type||n.BINARY_ACK==t.type)i(t,e)
else{var r=o(t)
e([r])}},n.Decoder=s,l(s.prototype),s.prototype.add=function(t){var e
if("string"==typeof t)e=a(t),n.BINARY_EVENT==e.type||n.BINARY_ACK==e.type?(this.reconstructor=new c(e),0==this.reconstructor.reconPack.attachments&&this.emit("decoded",e)):this.emit("decoded",e)
else{if(!(u.Buffer&&Buffer.isBuffer(t)||u.ArrayBuffer&&t instanceof ArrayBuffer||t.base64))throw Error("Unknown type: "+t)
if(!this.reconstructor)throw Error("got binary data when not reconstructing a packet")
e=this.reconstructor.takeBinaryData(t),e&&(this.reconstructor=null,this.emit("decoded",e))}},s.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},c.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length==this.reconPack.attachments){var e=d.reconstructPacket(this.reconPack,this.buffers)
return this.finishedReconstruction(),e}return null},c.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},{"./binary":38,debug:8,emitter:9,isarray:40,json3:41}],40:[function(t,e){e.exports=t(32)},{}],41:[function(e,n,r){!function(e){function n(t){if(n[t]!==s)return n[t]
var e
if("bug-string-char-index"==t)e="a"!="a"[0]
else if("json"==t)e=n("json-stringify")&&n("json-parse")
else{var r,o='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}'
if("json-stringify"==t){var i=u.stringify,c="function"==typeof i&&f
if(c){(r=function(){return 1}).toJSON=r
try{c="0"===i(0)&&"0"===i(new Number)&&'""'==i(new String)&&i(a)===s&&i(s)===s&&i()===s&&"1"===i(r)&&"[1]"==i([r])&&"[null]"==i([s])&&"null"==i(null)&&"[null,null,null]"==i([s,a,null])&&i({a:[r,!0,!1,null,"\x00\b\n\f\r  "]})==o&&"1"===i(null,r)&&"[\n 1,\n 2\n]"==i([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==i(new Date(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==i(new Date(864e13))&&'"-000001-01-01T00:00:00.000Z"'==i(new Date(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==i(new Date(-1))}catch(p){c=!1}}e=c}if("json-parse"==t){var h=u.parse
if("function"==typeof h)try{if(0===h("0")&&!h(!1)){r=h(o)
var l=5==r.a.length&&1===r.a[0]
if(l){try{l=!h('" "')}catch(p){}if(l)try{l=1!==h("01")}catch(p){}if(l)try{l=1!==h("1.")}catch(p){}}}}catch(p){l=!1}e=l}}return n[t]=!!e}var o,i,s,a={}.toString,c="function"==typeof t&&t.amd,p="object"==typeof JSON&&JSON,u="object"==typeof r&&r&&!r.nodeType&&r
u&&p?(u.stringify=p.stringify,u.parse=p.parse):u=e.JSON=p||{}
var f=new Date(-0xc782b5b800cec)
try{f=-109252==f.getUTCFullYear()&&0===f.getUTCMonth()&&1===f.getUTCDate()&&10==f.getUTCHours()&&37==f.getUTCMinutes()&&6==f.getUTCSeconds()&&708==f.getUTCMilliseconds()}catch(h){}if(!n("json")){var l="[object Function]",d="[object Date]",y="[object Number]",g="[object String]",m="[object Array]",v="[object Boolean]",b=n("bug-string-char-index")
if(!f)var w=Math.floor,k=[0,31,59,90,120,151,181,212,243,273,304,334],A=function(t,e){return k[e]+365*(t-1970)+w((t-1969+(e=+(e>1)))/4)-w((t-1901+e)/100)+w((t-1601+e)/400)};(o={}.hasOwnProperty)||(o=function(t){var e,n={}
return(n.__proto__=null,n.__proto__={toString:1},n).toString!=a?o=function(t){var e=this.__proto__,n=t in(this.__proto__=null,this)
return this.__proto__=e,n}:(e=n.constructor,o=function(t){var n=(this.constructor||e).prototype
return t in this&&!(t in n&&this[t]===n[t])}),n=null,o.call(this,t)})
var B={"boolean":1,number:1,string:1,undefined:1},x=function(t,e){var n=typeof t[e]
return"object"==n?!!t[e]:!B[n]}
if(i=function(t,e){var n,r,s,c=0;(n=function(){this.valueOf=0}).prototype.valueOf=0,r=new n
for(s in r)o.call(r,s)&&c++
return n=r=null,c?i=2==c?function(t,e){var n,r={},i=a.call(t)==l
for(n in t)i&&"prototype"==n||o.call(r,n)||!(r[n]=1)||!o.call(t,n)||e(n)}:function(t,e){var n,r,i=a.call(t)==l
for(n in t)i&&"prototype"==n||!o.call(t,n)||(r="constructor"===n)||e(n);(r||o.call(t,n="constructor"))&&e(n)}:(r=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],i=function(t,e){var n,i,s=a.call(t)==l,c=!s&&"function"!=typeof t.constructor&&x(t,"hasOwnProperty")?t.hasOwnProperty:o
for(n in t)s&&"prototype"==n||!c.call(t,n)||e(n)
for(i=r.length;n=r[--i];c.call(t,n)&&e(n));}),i(t,e)},!n("json-stringify")){var C={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},S="000000",T=function(t,e){return(S+(e||0)).slice(-t)},E="\\u00",_=function(t){var e,n='"',r=0,o=t.length,i=o>10&&b
for(i&&(e=t.split(""));o>r;r++){var s=t.charCodeAt(r)
switch(s){case 8:case 9:case 10:case 12:case 13:case 34:case 92:n+=C[s]
break
default:if(32>s){n+=E+T(2,s.toString(16))
break}n+=i?e[r]:b?t.charAt(r):t[r]}}return n+'"'},P=function(t,e,n,r,c,p,u){var f,h,l,b,k,B,x,C,S,E,O,N,j,R,q,U
try{f=e[t]}catch(I){}if("object"==typeof f&&f)if(h=a.call(f),h!=d||o.call(f,"toJSON"))"function"==typeof f.toJSON&&(h!=y&&h!=g&&h!=m||o.call(f,"toJSON"))&&(f=f.toJSON(t))
else if(f>-1/0&&1/0>f){if(A){for(k=w(f/864e5),l=w(k/365.2425)+1970-1;A(l+1,0)<=k;l++);for(b=w((k-A(l,0))/30.42);A(l,b+1)<=k;b++);k=1+k-A(l,b),B=(f%864e5+864e5)%864e5,x=w(B/36e5)%24,C=w(B/6e4)%60,S=w(B/1e3)%60,E=B%1e3}else l=f.getUTCFullYear(),b=f.getUTCMonth(),k=f.getUTCDate(),x=f.getUTCHours(),C=f.getUTCMinutes(),S=f.getUTCSeconds(),E=f.getUTCMilliseconds()
f=(0>=l||l>=1e4?(0>l?"-":"+")+T(6,0>l?-l:l):T(4,l))+"-"+T(2,b+1)+"-"+T(2,k)+"T"+T(2,x)+":"+T(2,C)+":"+T(2,S)+"."+T(3,E)+"Z"}else f=null
if(n&&(f=n.call(e,t,f)),null===f)return"null"
if(h=a.call(f),h==v)return""+f
if(h==y)return f>-1/0&&1/0>f?""+f:"null"
if(h==g)return _(""+f)
if("object"==typeof f){for(R=u.length;R--;)if(u[R]===f)throw TypeError()
if(u.push(f),O=[],q=p,p+=c,h==m){for(j=0,R=f.length;R>j;j++)N=P(j,f,n,r,c,p,u),O.push(N===s?"null":N)
U=O.length?c?"[\n"+p+O.join(",\n"+p)+"\n"+q+"]":"["+O.join(",")+"]":"[]"}else i(r||f,function(t){var e=P(t,f,n,r,c,p,u)
e!==s&&O.push(_(t)+":"+(c?" ":"")+e)}),U=O.length?c?"{\n"+p+O.join(",\n"+p)+"\n"+q+"}":"{"+O.join(",")+"}":"{}"
return u.pop(),U}}
u.stringify=function(t,e,n){var r,o,i,s
if("function"==typeof e||"object"==typeof e&&e)if((s=a.call(e))==l)o=e
else if(s==m){i={}
for(var c,p=0,u=e.length;u>p;c=e[p++],s=a.call(c),(s==g||s==y)&&(i[c]=1));}if(n)if((s=a.call(n))==y){if((n-=n%1)>0)for(r="",n>10&&(n=10);r.length<n;r+=" ");}else s==g&&(r=n.length<=10?n:n.slice(0,10))
return P("",(c={},c[""]=t,c),o,i,r,"",[])}}if(!n("json-parse")){var O,N,j=String.fromCharCode,R={92:"\\",34:'"',47:"/",98:"\b",116:"  ",110:"\n",102:"\f",114:"\r"},q=function(){throw O=N=null,SyntaxError()},U=function(){for(var t,e,n,r,o,i=N,s=i.length;s>O;)switch(o=i.charCodeAt(O)){case 9:case 10:case 13:case 32:O++
break
case 123:case 125:case 91:case 93:case 58:case 44:return t=b?i.charAt(O):i[O],O++,t
case 34:for(t="@",O++;s>O;)if(o=i.charCodeAt(O),32>o)q()
else if(92==o)switch(o=i.charCodeAt(++O)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:t+=R[o],O++
break
case 117:for(e=++O,n=O+4;n>O;O++)o=i.charCodeAt(O),o>=48&&57>=o||o>=97&&102>=o||o>=65&&70>=o||q()
t+=j("0x"+i.slice(e,O))
break
default:q()}else{if(34==o)break
for(o=i.charCodeAt(O),e=O;o>=32&&92!=o&&34!=o;)o=i.charCodeAt(++O)
t+=i.slice(e,O)}if(34==i.charCodeAt(O))return O++,t
q()
default:if(e=O,45==o&&(r=!0,o=i.charCodeAt(++O)),o>=48&&57>=o){for(48==o&&(o=i.charCodeAt(O+1),o>=48&&57>=o)&&q(),r=!1;s>O&&(o=i.charCodeAt(O),o>=48&&57>=o);O++);if(46==i.charCodeAt(O)){for(n=++O;s>n&&(o=i.charCodeAt(n),o>=48&&57>=o);n++);n==O&&q(),O=n}if(o=i.charCodeAt(O),101==o||69==o){for(o=i.charCodeAt(++O),(43==o||45==o)&&O++,n=O;s>n&&(o=i.charCodeAt(n),o>=48&&57>=o);n++);n==O&&q(),O=n}return+i.slice(e,O)}if(r&&q(),"true"==i.slice(O,O+4))return O+=4,!0
if("false"==i.slice(O,O+5))return O+=5,!1
if("null"==i.slice(O,O+4))return O+=4,null
q()}return"$"},I=function(t){var e,n
if("$"==t&&q(),"string"==typeof t){if("@"==(b?t.charAt(0):t[0]))return t.slice(1)
if("["==t){for(e=[];t=U(),"]"!=t;n||(n=!0))n&&(","==t?(t=U(),"]"==t&&q()):q()),","==t&&q(),e.push(I(t))
return e}if("{"==t){for(e={};t=U(),"}"!=t;n||(n=!0))n&&(","==t?(t=U(),"}"==t&&q()):q()),(","==t||"string"!=typeof t||"@"!=(b?t.charAt(0):t[0])||":"!=U())&&q(),e[t.slice(1)]=I(U())
return e}q()}return t},D=function(t,e,n){var r=L(t,e,n)
r===s?delete t[e]:t[e]=r},L=function(t,e,n){var r,o=t[e]
if("object"==typeof o&&o)if(a.call(o)==m)for(r=o.length;r--;)D(o,r,n)
else i(o,function(t){D(o,t,n)})
return n.call(t,e,o)}
u.parse=function(t,e){var n,r
return O=0,N=""+t,n=I(U()),"$"!=U()&&q(),O=N=null,e&&a.call(e)==l?L((r={},r[""]=n,r),"",e):n}}}c&&t(function(){return u})}(this)},{}],42:[function(t,e){function n(t,e){var n=[]
e=e||0
for(var r=e||0;r<t.length;r++)n[r-e]=t[r]
return n}e.exports=n},{}]},{},[1])(1)})
