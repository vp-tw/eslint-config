declare module "process" {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        LINT_STAGED_TYPE?: NodeJS.ProcessEnv[string];
      }
    }
  }
}
