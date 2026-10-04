export type JobSourceConfig={provider:"greenhouse"|"lever";token:string;company:string;country:"US"};
export const sourceRegistry:JobSourceConfig[]=[
 {provider:"greenhouse",token:"anthropic",company:"Anthropic",country:"US"},
 {provider:"greenhouse",token:"coinbase",company:"Coinbase",country:"US"},
 {provider:"greenhouse",token:"figma",company:"Figma",country:"US"}
];
export function normalizeText(value:unknown){return String(value??"").replace(/<[^>]*>/g," ").replace(/\\s+/g," ").trim();}
export function slugify(value:string){return value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");}
export function inferRemote(location:string,title=""){return /remote|work from home|wfh/i.test(location+" "+title);}
export function isUsLocation(location:string){return /united states|usa|remote/i.test(location)||/(^|,|\\s)(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|DC)(\\s|,|$)/i.test(location);}