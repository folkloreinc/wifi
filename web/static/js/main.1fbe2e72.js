"use strict";(self.webpackChunkwifi=self.webpackChunkwifi||[]).push([[179],{507:function(e,s,n){var r=n(526),t=n(961),c=n(652),a=n.n(c),i=n(942),l=n(982),o=n(569),d=n(403),u=n.n(d),m=n(557);function p(e,s){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);s&&(r=r.filter((function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable}))),n.push.apply(n,r)}return n}function f(e){for(var s=1;s<arguments.length;s++){var n=null!=arguments[s]?arguments[s]:{};s%2?p(Object(n),!0).forEach((function(s){(0,i.Z)(e,s,n[s])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(s){Object.defineProperty(e,s,Object.getOwnPropertyDescriptor(n,s))}))}return e}var b={networks:a().arrayOf(a().shape({ssid:a().string})),className:a().string};function h(e){var s=e.networks,n=e.className,t=(0,r.useMemo)((function(){return s.reduce((function(e,s){var n=s.ssid;return-1===e.indexOf(n)?[].concat((0,l.Z)(e),[n]):e}),[])}),[s]),c=(0,r.useCallback)((function(e){return e.currentTarget.value}),[]),a=(0,o.c)({fields:["ssid","password"],action:"/connect",initialValue:t.length>0?t[0]:null,getFieldValue:c}),d=a.fields,p=a.onSubmit,b=a.status;return(0,m.jsxs)("form",{className:u()(["connect-form_container__3nE9K",(0,i.Z)({},n,null!==n)]),action:"/connect",method:"post",onSubmit:p,children:[(0,m.jsxs)("div",{className:"mb-3",children:[(0,m.jsx)("label",{className:"form-label",htmlFor:"ssid",children:"Réseau"}),(0,m.jsx)("select",f(f({name:"ssid",className:"form-control form-control-lg",required:!0},d.ssid),{},{children:t.map((function(e){return(0,m.jsx)("option",{value:e,children:e})}))}))]}),(0,m.jsxs)("div",{className:"mb-4",children:[(0,m.jsx)("label",{className:"form-label",htmlFor:"password",children:"Mot de passe"}),(0,m.jsx)("input",f({type:"text",name:"password",className:"form-control form-control-lg",required:!0},d.password))]}),(0,m.jsx)("div",{children:(0,m.jsx)("button",{type:"submit",className:"btn btn-lg btn-primary",disabled:"loading"===b,children:"Se connecter"})})]})}h.propTypes=b,h.defaultProps={networks:[],className:null};var j=h,v={networks:a().arrayOf(a().shape({ssid:a().string})),online:a().bool};function x(e){var s=e.online,n=e.networks,r=(n.find((function(e){var s=e.connected;return void 0!==s&&s}))||{}).ssid,t=void 0===r?null:r;return(0,m.jsx)("div",{className:"app_container__2sKL5",children:(0,m.jsxs)("div",{className:"container",children:[s?(0,m.jsx)("div",{className:"row justify-content-center mt-4",children:(0,m.jsx)("div",{className:"col-6",children:(0,m.jsx)("div",{className:"card text-bg-success",children:(0,m.jsx)("div",{className:"card-body  text-center p-4",children:(0,m.jsxs)("div",{className:"h4 m-4 text-bold",children:[(0,m.jsx)("i",{className:"bi bi-hand-thumbs-up"})," Connecté au réseau ",t]})})})})}):null,(0,m.jsx)("div",{className:"row justify-content-center mt-4",children:(0,m.jsx)("div",{className:"col-6",children:(0,m.jsx)("div",{className:"card",children:(0,m.jsxs)("div",{className:"card-body",children:[s?(0,m.jsx)("h4",{className:"mb-4",children:"Modifier le réseau"}):null,(0,m.jsx)(j,{networks:n})]})})})})]})})}x.propTypes=v,x.defaultProps={networks:[],online:!0};var w=x,N=r.createElement(w,window.props||{});t.render(N,document.getElementById("app"))}},function(e){e.O(0,[447],(function(){return 507,e(e.s=507)})),e.O()}]);
//# sourceMappingURL=main.1fbe2e72.js.map