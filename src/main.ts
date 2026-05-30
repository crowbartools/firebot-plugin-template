import firebot, { Plugin } from "@crowbartools/firebot-types";

type Params = {
  message: string;
};

const plugin: Plugin<Params> = {
  manifest: {
    name: "Starter Plugin",
    description: "A starter Firebot plugin",
    icon: "fa-flask",
    color: "#a106de",
    version: "1.0",
    author: "SomeDev",
    type: "plugin",
  },
  parametersSchema: [
    {
      name: "message",
      type: "string",
      default: "Hello World!",
      title: "Hello!",
      description: "Message",
    },
  ],
  onLoad: (context) => {
    firebot.logger.info(context.parameters.message);
  },
};

export default plugin;
