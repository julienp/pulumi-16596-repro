import * as os from "node:os"
import * as fs from "node:fs"
import * as v8 from "node:v8"
import * as pulumi from "@pulumi/pulumi";

console.log(v8.getHeapStatistics())

const az = require("@pulumi/azure-native");

console.log(v8.getHeapStatistics())

function mb(n: number): number {
  return Math.round(n / 1024 / 1024);
}


const out = fs.createWriteStream("out.txt", { flags: "a" })
out.write(`RSS\t\tTotal\tFree\n`)
out.end()
console.log(`RSS\t\tTotal\tFree`)


let i = 0
let int = setInterval(() => {
  const mem = process.memoryUsage();
  const out = fs.createWriteStream("out.txt", { flags: "a" })
  out.write(`${mb(mem.rss)}\t${mb(os.totalmem())}\t${mb(os.freemem())}\n`)
  out.end()
  console.log(`${mb(mem.rss)}\t${mb(os.totalmem())}\t${mb(os.freemem())}`)
  console.log(v8.getHeapStatistics())
  i++
  if (i > 5) {
    clearInterval(int)
    out.end()
  }
}, 2000)


const stack = pulumi.getStack().toUpperCase();
const resourceGroup = new az.resources.ResourceGroup("rg", {
  resourceGroupName: `MyResourceGroup-${stack}`,
});

const site = new az.web.StaticSite("app", {
  resourceGroupName: resourceGroup.name,
  sku: {
    tier: "Free",
    name: "Free",
  },
  provider: "Other",
  repositoryUrl: "https://github.com/julienp/astro-first-friday",
  branch: "main",
  buildProperties: {
    skipGithubActionWorkflowGeneration: true,
  },
});

export const resourceGroupId = resourceGroup.id;
export const appName = site.name;
export const scmProvider = site.provider;

// dummy change 2
