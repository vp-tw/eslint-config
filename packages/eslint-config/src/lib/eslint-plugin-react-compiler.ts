import { ensurePackages, interopDefault } from "@antfu/eslint-config";

const reactCompiler = async () => {
  await ensurePackages(["eslint-plugin-react-compiler"]);
  const reactCompiler = await interopDefault(
    import("eslint-plugin-react-compiler"),
  );
  return reactCompiler;
};

export { reactCompiler };
