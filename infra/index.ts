import * as az from "@pulumi/azure-native";
import * as pulumi from "@pulumi/pulumi";

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
