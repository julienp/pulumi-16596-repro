import * as os from "node:os"
import * as az from "@pulumi/azure-native";
import * as pulumi from "@pulumi/pulumi";

function mb(n: number): number {
  return Math.round(n / 1024 / 1024);
}

console.log(`RSS\t\tTotal\tFree`)

let i = 0
let int = setInterval(() => {
  const mem = process.memoryUsage();
  console.log(`${mb(mem.rss)}\t${mb(os.totalmem())}\t${mb(os.freemem())}`)
  i++
  if (i > 90) {
    clearInterval(int)
  }
}, 1000)


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
