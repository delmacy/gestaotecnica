const { Module } = require("node:module");
const originalRequire = Module.prototype.require;

global.mockDbResult = [];

Module.prototype.require = function (id) {
  if (id === "@/db" || id.includes("src/db")) {
    return {
      getDb: () => ({
        select: () => ({
          from: () => ({
            where: () => {
              const res = [...global.mockDbResult];
              res.limit = () => global.mockDbResult;
              return res;
            }
          })
        })
      })
    };
  }
  return originalRequire.apply(this, arguments);
};
