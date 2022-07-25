"use strict";(self.webpackChunkwifi=self.webpackChunkwifi||[]).push([[179],{24:function(e,n,s){var r=s(526),t=s(470),o=s(885),l=s(365),i=s(652),a=s.n(i),c=s(369),u=s(494),d=s(557),f=r.createContext({online:!1,networks:[]});function m(){return(0,r.useContext)(f)}var p={online:a().bool.isRequired,networks:a().arrayOf(a().shape({ssid:a().string,online:a().bool})).isRequired,children:a().node.isRequired};function h(e){var n=e.online,s=e.networks,t=e.children,o=(0,r.useMemo)((function(){return{online:n,networks:s}}),[n,s]);return(0,d.jsx)(f.Provider,{value:o,children:t})}h.propTypes=p,h.defaultProps={};var b=s(942),j=s(403),x=s.n(j),w=s(982),v=s(901),k=s(246);function N(e,n){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),s.push.apply(s,r)}return s}function y(e){for(var n=1;n<arguments.length;n++){var s=null!=arguments[n]?arguments[n]:{};n%2?N(Object(s),!0).forEach((function(n){(0,b.Z)(e,n,s[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):N(Object(s)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(s,n))}))}return e}var g={online:a().bool,networks:a().arrayOf(a().shape({ssid:a().string})),onClickRefresh:a().func,className:a().string};function O(e){var n=e.online,s=e.networks,t=e.className,o=e.onClickRefresh,l=(0,r.useMemo)((function(){return s.reduce((function(e,n){var s=n.ssid;return-1===e.indexOf(s)?[].concat((0,w.Z)(e),[s]):e}),[])}),[s]),i=(0,r.useCallback)((function(e){return e.currentTarget.value}),[]),a=(0,v.c)({fields:["ssid","password"],action:"/connect",initialValue:l.length>0?{ssid:l[0]}:null,getFieldValue:i}),c=a.fields,u=a.onSubmit,f=a.status;return(0,d.jsx)("div",{className:x()(["card",(0,b.Z)({},t,null!==t)]),children:(0,d.jsxs)("div",{className:"card-body",children:[n?(0,d.jsx)("h4",{className:"mb-4",children:(0,d.jsx)(k.Z,{id:"im3rey"})}):(0,d.jsx)("h4",{className:"mb-4",children:(0,d.jsx)(k.Z,{id:"1frZJs"})}),(0,d.jsxs)("form",{action:"/connect",method:"post",onSubmit:u,children:[(0,d.jsxs)("div",{className:"mb-3",children:[(0,d.jsx)("label",{className:"form-label",htmlFor:"ssid",children:(0,d.jsx)(k.Z,{id:"Iy8s8H"})}),(0,d.jsxs)("div",{className:"input-group",children:[(0,d.jsx)("select",y(y({name:"ssid",className:"form-control form-control-lg",required:!0,disabled:0===l.length},c.ssid),{},{children:l.length>0?l.map((function(e){return(0,d.jsx)("option",{value:e,children:e},"option-".concat(e))})):(0,d.jsx)("option",{value:"",children:"No network found."})})),(0,d.jsx)("button",{type:"button",className:"btn btn-outline-secondary",onClick:o,children:(0,d.jsx)("i",{className:"bi bi-arrow-clockwise"})})]})]}),(0,d.jsxs)("div",{className:"mb-4",children:[(0,d.jsx)("label",{className:"form-label",htmlFor:"password",children:(0,d.jsx)(k.Z,{id:"F/Xc6f"})}),(0,d.jsx)("input",y({type:"text",name:"password",className:"form-control form-control-lg",required:!0},c.password))]}),(0,d.jsx)("div",{children:(0,d.jsx)("button",{type:"submit",className:"btn btn-lg btn-primary",disabled:"loading"===f,children:(0,d.jsx)(k.Z,{id:"qJeGtX"})})})]})]})})}O.propTypes=g,O.defaultProps={online:!1,networks:[],onClickRefresh:null,className:null};var Z=O,P={networks:a().arrayOf(a().shape({ssid:a().string,connected:a().bool})),online:a().bool,className:a().string};function C(e){var n=e.online,s=e.networks,r=e.className,t=(s.find((function(e){var n=e.connected;return void 0!==n&&n}))||{}).ssid,o=void 0===t?null:t;return(0,d.jsx)("div",{className:x()(["card",(0,b.Z)({"text-bg-success":n,"text-bg-warning":!n},r,null!==r)]),children:(0,d.jsx)("div",{className:"card-body text-center",children:(0,d.jsxs)("div",{className:x()([{h4:n,h6:!n,"m-4":n,"m-2":!n}]),children:[(0,d.jsx)("i",{className:x()(["bi","me-4",{"bi-hand-thumbs-up":n,"bi-x-circle":!n}])}),n?(0,d.jsx)(k.Z,{id:"ClZC/d",values:{network:o}}):(0,d.jsx)(k.Z,{id:"JwOtbQ"})]})})})}C.propTypes=P,C.defaultProps={networks:[],online:!0,className:null};var R=C,q={className:a().string,onRefreshNetworks:a().func};function S(e){var n=e.className,s=e.onRefreshNetworks,r=m().online,t=m().networks;return(0,d.jsx)("div",{className:x()(["container",(0,b.Z)({},n,null!==n)]),children:(0,d.jsx)("div",{className:"row justify-content-center mt-4",children:(0,d.jsxs)("div",{className:x()(["col-lg-5","d-flex",{"flex-column-reverse":!r,"flex-column":r}]),children:[(0,d.jsx)(R,{online:r,networks:t,className:x()([{"mb-4":r,"mt-4":!r}])}),(0,d.jsx)(Z,{networks:t,onClickRefresh:s})]})})})}S.propTypes=q,S.defaultProps={className:null,onRefreshNetworks:null};var T=S,E=(0,u.ZP)("http://localhost:8001"),D={networks:a().arrayOf(a().shape({ssid:a().string})),online:a().bool,locale:a().string,translations:a().objectOf(a().arrayOf(a().shape({type:a().number,value:a().string})))};function F(e){var n=e.online,s=e.networks,t=e.locale,i=e.translations,a=(0,r.useState)(n),u=(0,o.Z)(a,2),f=u[0],m=u[1],p=(0,r.useState)(s),b=(0,o.Z)(p,2),j=b[0],x=b[1],w=(0,r.useCallback)((function(){(0,l.xA)("/networks").then((function(e){return x(e)}))}),[x]);return(0,r.useEffect)((function(){return E.on("status",(function(e){var n=e.online,s=e.networks;m(n),x(s)})),E.on("online",(function(e){m(e)})),E.on("networks",(function(e){x(e)})),function(){E.off("status"),E.off("online"),E.off("networks")}}),[m,x]),(0,d.jsx)(h,{online:f,networks:j,children:(0,d.jsx)(c.Z,{locale:t,messages:i,children:(0,d.jsx)(T,{onRefreshNetworks:w})})})}F.propTypes=D,F.defaultProps={networks:[],online:!1,locale:"en",translations:{}};var J=F,I=document.getElementById("app"),M=r.createElement(J,window.props||{});(0,t.s)(I).render(M)}},function(e){e.O(0,[339],(function(){return 24,e(e.s=24)})),e.O()}]);
//# sourceMappingURL=main.8cedd23a.js.map