import * as os from "node:os"
import * as fs from "node:fs"
import * as v8 from "node:v8"
import * as pulumi from "@pulumi/pulumi";
import * as az from "@pulumi/azure-native";

console.log(v8.getHeapStatistics())


let i = 0
let int = setInterval(() => {
  const stats = v8.getHeapStatistics()
  console.log(stats.heap_size_limit - stats.used_heap_size)
  const out = fs.openSync("out.txt", "a")
  fs.writeSync(out, `${stats.heap_size_limit - stats.used_heap_size}\n`)
  fs.fsyncSync(out)
  fs.closeSync(out)
  i++
  if (i > 5) {
    clearInterval(int)
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
