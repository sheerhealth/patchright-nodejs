import { Project, SyntaxKind, IndentationText } from "ts-morph";

const project = new Project({
  manipulationSettings: {
    indentationText: IndentationText.TwoSpaces,
  },
});


// ----------------------------
// client/clientHelper.ts
// ----------------------------
const clientHelperSourceFile = project.addSourceFileAtPath(
  "packages/playwright-core/src/client/clientHelper.ts",
);
// ------- addSourceUrlToScript Function -------
const addSourceUrlToScriptFunction = clientHelperSourceFile.getFunction("addSourceUrlToScript");
addSourceUrlToScriptFunction.setBodyText(`return script`);

// ----------------------------
// client/browserContext.ts
// ----------------------------
const clientBrowserContextSourceFile = project.addSourceFileAtPath(
  "packages/playwright-core/src/client/browserContext.ts",
);
// ------- BrowserContext Class -------
const clientBrowserContextClass = clientBrowserContextSourceFile.getClass("BrowserContext");
clientBrowserContextClass.addProperty({ name: "routeInjecting", type: "boolean", initializer: "false" });

// -- addInitScript Method --
const clientAddInitScriptMethod = clientBrowserContextClass.getMethod("addInitScript");
const clientAddInitScriptMethodBody = clientAddInitScriptMethod.getBody();
clientAddInitScriptMethodBody.insertStatements(0, "await this.installInjectRoute();");

// -- exposeBinding Method --
const clientExposeBindingMethod = clientBrowserContextClass.getMethod("exposeBinding");
const clientExposeBindingMethodBody = clientExposeBindingMethod.getBody();
clientExposeBindingMethodBody.insertStatements(0, "await this.installInjectRoute();");

// -- exposeFunction Method --
const clientExposeFunctionMethod = clientBrowserContextClass.getMethod("exposeFunction");
const clientExposeFunctionMethodBody = clientExposeFunctionMethod.getBody();
clientExposeFunctionMethodBody.insertStatements(0, "await this.installInjectRoute();");

// -- installInjectRoute Method --
clientBrowserContextClass.addMethod({
  name: "installInjectRoute",
  isAsync: true,
});
const clientBrowserContextInstallInjectRouteMethod = clientBrowserContextClass.getMethod("installInjectRoute");
clientBrowserContextInstallInjectRouteMethod.setBodyText(`
if (this.routeInjecting) return;
await this.route('**/*', async route => {
  if (route.request().resourceType() === 'document' && route.request().url().startsWith('http')) {
    try {
      const response = await route.fetch({ maxRedirects: 0 });
      await route.fulfill({ response: response });
    } catch (e) {
      await route.continue();
    }
  } else {
    await route.continue();
  }
});
this.routeInjecting = true;
`);

// ----------------------------
// client/page.ts
// ----------------------------
const clientPageSourceFile = project.addSourceFileAtPath(
  "packages/playwright-core/src/client/page.ts",
);
// ------- Page Class -------
const clientPageClass = clientPageSourceFile.getClass("Page");
clientPageClass.addProperty({ name: "routeInjecting", type: "boolean", initializer: "false" });

// -- addInitScript Method --
const clientPageAddInitScriptMethod = clientPageClass.getMethod("addInitScript");
const clientPageAddInitScriptMethodBody = clientPageAddInitScriptMethod.getBody();
clientPageAddInitScriptMethodBody.insertStatements(0, "await this.installInjectRoute();");

// -- exposeBinding Method --
const clientPageExposeBindingMethod = clientPageClass.getMethod("exposeBinding");
const clientPageExposeBindingMethodBody = clientPageExposeBindingMethod.getBody();
clientPageExposeBindingMethodBody.insertStatements(0, "await this.installInjectRoute();");

// -- exposeFunction Method --
const clientPageExposeFunctionMethod = clientPageClass.getMethod("exposeFunction");
const clientPageExposeFunctionMethodBody = clientPageExposeFunctionMethod.getBody();
clientPageExposeFunctionMethodBody.insertStatements(0, "await this.installInjectRoute();");

// -- installInjectRoute Method --
clientPageClass.addMethod({
  name: "installInjectRoute",
  isAsync: true,
});
const clientPageInstallInjectRouteMethod = clientPageClass.getMethod("installInjectRoute");
clientPageInstallInjectRouteMethod.setBodyText(`
if (this.routeInjecting || this.context().routeInjecting) return;
await this.route('**/*', async route => {
  if (route.request().resourceType() === 'document' && route.request().url().startsWith('http')) {
    try {
      const response = await route.fetch({ maxRedirects: 0 });
      await route.fulfill({ response: response });
    } catch (e) {
      await route.continue();
    }
  } else {
    await route.continue();
  }
});
this.routeInjecting = true;
`);


// ----------------------------
// client/clock.ts
// ----------------------------
const clientClockSourceFile = project.addSourceFileAtPath(
  "packages/playwright-core/src/client/clock.ts",
);
// ------- Page Class -------
const clientClockClass = clientClockSourceFile.getClass("Clock");
// -- install Method --
const clientInstallMethod = clientClockClass.getMethod("install");
const clientInstallMethodBody = clientInstallMethod.getBody();
clientInstallMethodBody.insertStatements(0, "await this._browserContext.installInjectRoute()");

// Here the Driver Patch will be added by fetching the code from the main Driver Repository (in the workflow).
// The URL from which the code is added is: https://raw.githubusercontent.com/Kaliiiiiiiiii-Vinyzu/patchright/refs/heads/main/patchright_driver_patch.js
// Note: The Project is also synced (saved) in this code, so we dont need to add it here.

