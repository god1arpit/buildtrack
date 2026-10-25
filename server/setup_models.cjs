const fs = require("fs");

const models = [
  "User",
  "Project",
  "Worker",
  "Attendance",
  "Wage",
  "Payment",
  "WorkUpdate",
  "SitePhoto",
  "Expense",
  "Notification"
];

models.forEach((name) => {
  const code = `import { ModelWrapper } from "../config/embeddedStore.js";\n\nconst ${name} = new ModelWrapper("${name}");\n\nexport default ${name};\n`;
  fs.writeFileSync(`models/${name}.js`, code, "utf8");
});

console.log("All server models updated with embedded store adapter!");
