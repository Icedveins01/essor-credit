// app/three-fix.ts
if (typeof window !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (message: any, ...args: any[]) => {
    if (typeof message === "string" && 
        (message.includes("THREE.Clock") || 
         message.includes("deprecated"))) {
      return;
    }
    originalWarn.call(console, message, ...args);
  };
}