"use strict";var C=Object.create;var c=Object.defineProperty;var S=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var A=Object.getPrototypeOf,P=Object.prototype.hasOwnProperty;var L=(e,t)=>{for(var o in t)c(e,o,{get:t[o],enumerable:!0})},p=(e,t,o,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of w(t))!P.call(e,r)&&r!==o&&c(e,r,{get:()=>t[r],enumerable:!(s=S(t,r))||s.enumerable});return e};var l=(e,t,o)=>(o=e!=null?C(A(e)):{},p(t||!e||!e.__esModule?c(o,"default",{value:e,enumerable:!0}):o,e)),D=e=>p(c({},"__esModule",{value:!0}),e);var W={};L(W,{autoDeleteHandler:()=>I,handler:()=>k});module.exports=D(W);var u=require("@aws-sdk/client-ecr");var R=l(require("https")),y=l(require("url")),n={sendHttpRequest:x,log:N,includeStackTraces:!0,userHandlerIndex:"./index"},m="AWSCDK::CustomResourceProviderFramework::CREATE_FAILED",b="AWSCDK::CustomResourceProviderFramework::MISSING_PHYSICAL_ID";function h(e){return async(t,o)=>{let s={...t,ResponseURL:"..."};if(n.log(JSON.stringify(s,void 0,2)),t.RequestType==="Delete"&&t.PhysicalResourceId===m){n.log("ignoring DELETE event caused by a failed CREATE event"),await d("SUCCESS",t);return}try{let r=await e(s,o),a=T(t,r);await d("SUCCESS",a)}catch(r){let a={...t,Reason:n.includeStackTraces?r.stack:r.message};a.PhysicalResourceId||(t.RequestType==="Create"?(n.log("CREATE failed, responding with a marker physical resource id so that the subsequent DELETE will be ignored"),a.PhysicalResourceId=m):n.log(`ERROR: Malformed event. "PhysicalResourceId" is required: ${JSON.stringify(t)}`)),await d("FAILED",a)}}}function T(e,t={}){let o=t.PhysicalResourceId??e.PhysicalResourceId??e.RequestId;if(e.RequestType==="Delete"&&o!==e.PhysicalResourceId)throw new Error(`DELETE: cannot change the physical resource ID from "${e.PhysicalResourceId}" to "${t.PhysicalResourceId}" during deletion`);return{...e,...t,PhysicalResourceId:o}}async function d(e,t){let o={Status:e,Reason:t.Reason??e,StackId:t.StackId,RequestId:t.RequestId,PhysicalResourceId:t.PhysicalResourceId||b,LogicalResourceId:t.LogicalResourceId,NoEcho:t.NoEcho,Data:t.Data};n.log("submit response to cloudformation",o);let s=JSON.stringify(o),r=y.parse(t.ResponseURL),a={hostname:r.hostname,path:r.path,method:"PUT",headers:{"content-type":"","content-length":Buffer.byteLength(s,"utf8")}};await H({attempts:5,sleep:1e3},n.sendHttpRequest)(a,s)}async function x(e,t){return new Promise((o,s)=>{try{let r=R.request(e,a=>o());r.on("error",s),r.write(t),r.end()}catch(r){s(r)}})}function N(e,...t){console.log(e,...t)}function H(e,t){return async(...o)=>{let s=e.attempts,r=e.sleep;for(;;)try{return await t(...o)}catch(a){if(s--<=0)throw a;await F(Math.floor(Math.random()*r)),r*=2}}}async function F(e){return new Promise(t=>setTimeout(t,e))}var g="aws-cdk:auto-delete-images",i=new u.ECR({}),k=h(I);async function I(e){switch(e.RequestType){case"Create":break;case"Update":return _(e);case"Delete":return f(e.ResourceProperties?.RepositoryName)}}async function _(e){let t=e,o=t.OldResourceProperties?.RepositoryName,s=t.ResourceProperties?.RepositoryName;if(s&&o&&s!==o)return f(o)}async function E(e){let t=await i.listImages(e),o=[],s=[];(t.imageIds??[]).forEach(a=>{"imageTag"in a?s.push(a):o.push(a)});let r=t.nextToken??null;o.length===0&&s.length===0||(s.length!==0&&await i.batchDeleteImage({repositoryName:e.repositoryName,imageIds:s}),o.length!==0&&await i.batchDeleteImage({repositoryName:e.repositoryName,imageIds:o}),r&&await E({...e,nextToken:r}))}async function f(e){if(!e)throw new Error("No RepositoryName was provided.");let o=(await i.describeRepositories({repositoryNames:[e]})).repositories?.find(s=>s.repositoryName===e);if(!await q(o?.repositoryArn)){process.stdout.write(`Repository does not have '${g}' tag, skipping cleaning.
`);return}try{await E({repositoryName:e})}catch(s){if(!(s instanceof u.RepositoryNotFoundException))throw s}}async function q(e){return(await i.listTagsForResource({resourceArn:e})).tags?.some(o=>o.Key===g&&o.Value==="true")}0&&(module.exports={autoDeleteHandler,handler});
